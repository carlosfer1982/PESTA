#ifndef DADOS_PRODUCAO_H
#define DADOS_PRODUCAO_H


#include <stdint.h>

// Estrutura de dados criada para conter os dados de produção. Durante o desenvolvimento, antes de decidir utilizar o cJSON
// Contudo, esta ficou interligada ao objeto JSON.

typedef struct {
	char ordem_fabrico[16];
	uint16_t quantidade_total;
	uint16_t quantidade_produzida;
	uint16_t desperdicio;
	uint16_t contador_entrada;
	uint16_t contador_saida;
	uint8_t sistema_ativo;
} DadosProducao;

extern DadosProducao dados;

void enviar_dados_para_pc(void); // Função anterior utilizada paar enviar dados para o PC

void enviar_dados_para_pc_json(void); // Função utilizada atualmente, utilizando a biblioteca cJSON

#endif
