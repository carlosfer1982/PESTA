#define F_CPU 8000000UL

#include <avr/io.h>
#include <util/delay.h>
#include <avr/eeprom.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

#include "uart.h"
#include "timer.h"
#include "entradas_digitais.h"
#include "entradas_analogicas.h"
#include "saidas.h"
#include "memoria.h"
#include "dados_producao.h"
#include "cJSON.h"

uint8_t anterior_entrada = 0;
uint8_t anterior_saida = 0;

/*
Troca de informações
Quando o Proteus estiver aberto, a correr o ficheiro .hex, é possível copiar e colar no serialcom os comandos para o microcontrolador
Pode-se enviar tudo em de uma vez, separado por vígula ou um a um.
ENVIO PC - > Microcontrolador
Envio "tudo de uma vez"
exemplo 1: 
{"of":"10F2025","setq":100,"cmd":"start"}
exemplo 2: 
{"of":"TESTE_01","setq":10,"cmd":"start"}

Envio separado:
{"of":"TESTE_01"}
{"setq":10}
{"cmd":"start"}
	
	
{"cmd":"pause"}
{"cmd":"start"}
{"cmd":"cancel"}
		
	
*/


void processar_json(const char *json_str)
{
	cJSON *json = cJSON_Parse(json_str);
	if (!json) {
		UART_sendString("{\"status\":\"ERRO\",\"msg\":\"JSON invalido\"}\r\n");
		return;
	}

	const cJSON *cmd = cJSON_GetObjectItem(json, "cmd");
	const cJSON *of = cJSON_GetObjectItem(json, "of");
	const cJSON *setq = cJSON_GetObjectItem(json, "setq");

	if (cJSON_IsString(cmd)) {
		if (strcmp(cmd->valuestring, "start") == 0) {
			dados.quantidade_produzida = 0;
			dados.desperdicio = 0;
			dados.sistema_ativo = 1;
			UART_sendString("{\"status\":\"OK\",\"action\":\"start\"}\r\n");
			} else if (strcmp(cmd->valuestring, "pause") == 0) {
			dados.sistema_ativo = 0;
			UART_sendString("{\"status\":\"OK\",\"action\":\"pause\"}\r\n");
			} else if (strcmp(cmd->valuestring, "cancel") == 0) {
			dados.quantidade_produzida = 0;
			dados.desperdicio = 0;
			dados.contador_entrada = 0;
			dados.contador_saida = 0;
			dados.quantidade_total = 0;
			dados.sistema_ativo = 0;
			strcpy(dados.ordem_fabrico, "SEM_OF");
			salvar_total_na_eeprom(0);
			UART_sendString("{\"status\":\"OK\",\"action\":\"cancel\"}\r\n");
		}
	}

	if (cJSON_IsString(of)) {
		strncpy(dados.ordem_fabrico, of->valuestring, sizeof(dados.ordem_fabrico) - 1);
		dados.ordem_fabrico[sizeof(dados.ordem_fabrico) - 1] = '\0';
		UART_sendString("{\"status\":\"OK\",\"action\":\"of\"}\r\n");
	}

	if (cJSON_IsNumber(setq)) {
		dados.quantidade_total = setq->valueint;
		salvar_total_na_eeprom(dados.quantidade_total);
		UART_sendString("{\"status\":\"OK\",\"action\":\"setq\"}\r\n");
	}

	cJSON_Delete(json);
}
int main(void)
{
	UART_init(38400);
	TIMER0_init();
	ENTRADAS_init();
	ANALOGICAS_init();
	SAIDAS_init();

	dados.quantidade_total = ler_total_da_eeprom();
	strcpy(dados.ordem_fabrico, "SEM_OF");

	char comando[128];
	uint8_t idx = 0;

	UART_sendString("Sistema OEE v2.5 iniciado\r\n");

	while (1)
	{
		// Heartbeat separado
		if (TIMER0_check500ms()) {
			static uint8_t estado_heartbeat = 0;
			set_led_heartbeat(estado_heartbeat);
			estado_heartbeat = !estado_heartbeat;
		}

		// Leitura do comando UART
		if (UART_available()) {
			char c = UART_readChar();
			if (c == '\n' || c == '\r') {
				comando[idx] = '\0';
				processar_json(comando);
				idx = 0;
				} else if (idx < sizeof(comando) - 1) {
				comando[idx++] = c;
			}
		}

		// Lógica de produção ativa
		if (dados.sistema_ativo && TIMER0_check1s()) {
			uint8_t entrada = ler_sensor_entrada();
			uint8_t saida = ler_sensor_saida();

			if (entrada && !anterior_entrada)
			dados.contador_entrada++;

			if (saida && !anterior_saida)
			dados.contador_saida++;

			anterior_entrada = entrada;
			anterior_saida = saida;

			dados.quantidade_produzida = dados.contador_saida;
			dados.desperdicio = (dados.contador_entrada > dados.contador_saida)
			? (dados.contador_entrada - dados.contador_saida)
			: 0;

			enviar_dados_para_pc_json();
		}
	}
}
