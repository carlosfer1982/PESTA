#include <stdio.h>
#include <stddef.h>
#include <stdlib.h>
#include "dados_producao.h"
#include "uart.h"
#include "cJSON.h"


DadosProducao dados = {0};

/*
Troca de informações em JSON




*/



void enviar_dados_para_pc(void)
{
    char buffer[160];
    sprintf(buffer, "OF:%s;TOTAL:%u;ENT:%u;SAI:%u;PROD:%u;DESP:%u;ATIVO:%u\r\n",
            dados.ordem_fabrico,
            dados.quantidade_total,
			dados.contador_entrada,
			dados.contador_saida,
			dados.quantidade_produzida,
            dados.desperdicio,
            dados.sistema_ativo);
    UART_sendString(buffer);
}


void enviar_dados_para_pc_json(void)
{
	cJSON *json = cJSON_CreateObject();

	cJSON_AddStringToObject(json, "of", dados.ordem_fabrico);
	cJSON_AddNumberToObject(json, "total", dados.quantidade_total);
	cJSON_AddNumberToObject(json, "entrada", dados.contador_entrada);
	cJSON_AddNumberToObject(json, "saida", dados.contador_saida);
	cJSON_AddNumberToObject(json, "producao", dados.quantidade_produzida);
	cJSON_AddNumberToObject(json, "desperdicio", dados.desperdicio);
	cJSON_AddNumberToObject(json, "ativo", dados.sistema_ativo);

	char *msg = cJSON_PrintUnformatted(json);
	UART_sendString(msg);
	UART_sendString("\r\n");

	free(msg);
	//cJSON_free(msg);
	cJSON_Delete(json);
}
