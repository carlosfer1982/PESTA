#define F_CPU 8000000UL	// Define (informa) a velocidade da CPU.

// Includes da biblioteca padrão do C
#include <avr/io.h>
#include <util/delay.h>
#include <avr/eeprom.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>


// Includes dos arquivos. Foi feito isto para melhor organização do código
#include "uart.h"
#include "timer.h"
#include "entradas_digitais.h"
#include "entradas_analogicas.h"
#include "saidas.h"
#include "memoria.h"
#include "dados_producao.h"
#include "cJSON.h"	// biblioteca externa para facilitar a manipulação do JSON	

uint8_t anterior_entrada = 0;	//	Inicializa a entrada
uint8_t anterior_saida = 0;		// Inicializa a saída

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


// Função que processa uma string json
// https://www.geeksforgeeks.org/c/cjson-json-file-write-read-modify-in-c/
void processar_json(const char *json_str)	// Recebe os dados em formato string pela UART
{
	cJSON *json = cJSON_Parse(json_str);	// Faz o parsing dos dados recebidos, json_str e atribui ao objeto json.
	if (!json) {							//  Verifica se o json é um objeto válido. Caso não seja, apresenta um erro.
		UART_sendString("{\"status\":\"ERRO\",\"msg\":\"JSON invalido\"}\r\n");
		return;
	}

	const cJSON *cmd = cJSON_GetObjectItem(json, "cmd");	// Procura no objeto json uma chave chamada "cmd" e armazena um ponteiro para o valor encontrado na variavel cmd
	const cJSON *of = cJSON_GetObjectItem(json, "of");		// Procura no objeto json uma chave chamada "of" e armazena um ponteiro para o valor encontrado na variavel of
	const cJSON *setq = cJSON_GetObjectItem(json, "setq");	// Procura no objeto json uma chave chamada "setq" e armazena um ponteiro para o valor encontrado na variavel setq

	if (cJSON_IsString(cmd)) {	// Verifica se realmente chegou uma string
		if (strcmp(cmd->valuestring, "start") == 0) {	// Verifica se a string == start
			dados.quantidade_produzida = 0;	// inicializa variáveis
			dados.desperdicio = 0;
			dados.sistema_ativo = 1;		// indicação lógica de sistema ativo
			UART_sendString("{\"status\":\"OK\",\"action\":\"start\"}\r\n");	// Indica que recebeu corretamente a string "start"
			} else if (strcmp(cmd->valuestring, "pause") == 0) {				// Verifica se recebeu "pause"
			dados.sistema_ativo = 0;											// Indicação lógica do sistema inativo.
			UART_sendString("{\"status\":\"OK\",\"action\":\"pause\"}\r\n");	// Indica que recebeu corretamente a string "pause"
			} else if (strcmp(cmd->valuestring, "cancel") == 0) {				// Verifica se recebeu "cancel"
			dados.quantidade_produzida = 0;										// Faz reset em todas as variáveis
			dados.desperdicio = 0;
			dados.contador_entrada = 0;
			dados.contador_saida = 0;
			dados.quantidade_total = 0;
			dados.sistema_ativo = 0;
			strcpy(dados.ordem_fabrico, "SEM_OF");
			salvar_total_na_eeprom(0);											// O total fica salvo na eeprom. Esta parte pode ser melhorada
			UART_sendString("{\"status\":\"OK\",\"action\":\"cancel\"}\r\n");	// Indica que recebeu corretamente a string "cancel"
		}
	}

	if (cJSON_IsString(of)) {
		strncpy(dados.ordem_fabrico, of->valuestring, sizeof(dados.ordem_fabrico) - 1); // Copia os dados de of->valuestring para dados.ordem_fabrico, indicando o tamanho do destino com -1 
		dados.ordem_fabrico[sizeof(dados.ordem_fabrico) - 1] = '\0';					// Aplica o caracter de terminação de string '\0'
		UART_sendString("{\"status\":\"OK\",\"action\":\"of\"}\r\n");					// Após realizada as tarefas acima, devolve uma mensagem de confirmação
	}

	if (cJSON_IsNumber(setq)) {
		dados.quantidade_total = setq->valueint;
		salvar_total_na_eeprom(dados.quantidade_total);									// Salva a quantidade total na EEPROM
		UART_sendString("{\"status\":\"OK\",\"action\":\"setq\"}\r\n");
	}

	cJSON_Delete(json);		// Deleta o objeto JSON
}
int main(void)
{
	UART_init(38400);	// inicializa a uart com 38400 kbps
	TIMER0_init();		// Inicializa timer0 (Base de tempo para todas as funções que necessitam do tempo)
	ENTRADAS_init();	// Inicializa as entradas digitais
	ANALOGICAS_init();	// Inicializa as entradas analógicas (note que não estou a fazer solicitações de conversão no código principal)
	SAIDAS_init();		// Inicializa as saídas

	// Dados iniciais
	dados.quantidade_total = ler_total_da_eeprom(); // A quantidade total é lida da EEPROM - Futuramente podemos guardar a entrada, saída e ordem de fabrico
	strcpy(dados.ordem_fabrico, "SEM_OF");			// Inicializa o nome ordem de Fabrico como "SEM_OF"

	char comando[128];	// Cria uma variável do tipo string que pode armazenar até 127 caracteres, sendo o último o delimitador da string '\0'
	uint8_t idx = 0;	// Cria uma variável do tipo inteira que pode assumir valores de 0 a 255 e que servirá como indexador do vetor comando

	UART_sendString("Sistema OEE v2.5 iniciado\r\n");	// Se toda a etapa de inicializações foi concluída com sucesso, envia a mensagem através da UART

	while (1)
	{
		// Heartbeat separado
		if (TIMER0_check500ms()) {	// Esta função verifica a flag de 500ms. Retorna 1 quando a flag for "baixada", caso contrário, retorna 0 e salta este código
			static uint8_t estado_heartbeat = 0;	// Cria uma variável auxiliar para realizar o toggle bit
			set_led_heartbeat(estado_heartbeat);	// Passa o bit a 1
			estado_heartbeat = !estado_heartbeat;	// Alterna o bit (toggle bit)
		}

		// Leitura do comando UART, realizada a cada ciclo de máquina
		if (UART_available()) {		// Fução retorna a verificação de alguma informação no buffer uart. Caso exista, o bloco if é executado
			char c = UART_readChar();	// Lê o próximo caracter
			if (c == '\n' || c == '\r') {	// Verifica se o último caracter lido é um fim de linha '\n' ou '\r', se sim, executa o bloco if
				comando[idx] = '\0';		// Adiciona '\0' ao idx. Note que o idx está a ser incrementado quando não entra no bloco if, através do else
				processar_json(comando);
				idx = 0;
				} else if (idx < sizeof(comando) - 1) {	// Verifica o tamanho de idx é menor que o comando -1 (128-1=127 bytes)
				comando[idx++] = c;			// Constrói o vetor, caracter a caracter, atribuindo c ao vetor.
			}
		}

		// Lógica de produção ativa
		if (dados.sistema_ativo && TIMER0_check1s()) {	// Caso o sistema esteja ativo logicamente e o timer0_check1s for atingido, executa o bloco if
			uint8_t entrada = ler_sensor_entrada();		// Retorna 1 quando o pino é acionado e 0 quando não está acionado. 
			uint8_t saida = ler_sensor_saida();			

			if (entrada && !anterior_entrada)			// Verifica se houve alteração de estado desde a última execução. 
			dados.contador_entrada++;					// Se sim, incrementa o contador_entrada

			if (saida && !anterior_saida)				// Verifica se houve alteração de estado desde a última execução. 
			dados.contador_saida++;						// Se sim, incrementa o contador_entrada


			anterior_entrada = entrada;		// Atribui o estado atual da entrada para a variável anterior_entrada
			anterior_saida = saida;			// O obetivo é manter o registo anterior do estado destes pinos

			dados.quantidade_produzida = dados.contador_saida;	// Quer dizer que cada produto que efetivamente sai do equipamento, é contabilizado como um produto produzido
			// operador condicional ternário
			// condição ? valor_se_verdadeiro : valor_se_falso
			dados.desperdicio = (dados.contador_entrada > dados.contador_saida) // Quando entram 10 latas e saem 10 latas, temos um total de 10 latas boas produzidas
			? (dados.contador_entrada - dados.contador_saida)					// Se entram 15 latas e saem 10 latas, presume-se que 5 latas foram perdidas durante o processo, ou seja, abriram o equipamento e removeram a lata.
			: 0;

			enviar_dados_para_pc_json();	// Função que envia dados para o PC em formato string json
		}
	}
}
