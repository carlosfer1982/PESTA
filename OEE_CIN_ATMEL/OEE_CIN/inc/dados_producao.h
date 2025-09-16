#ifndef DADOS_PRODUCAO_H
#define DADOS_PRODUCAO_H


#include <stdint.h>

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

void enviar_dados_para_pc(void);

void enviar_dados_para_pc_json(void);

#endif
