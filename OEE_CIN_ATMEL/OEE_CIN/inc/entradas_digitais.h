#ifndef ENTRADAS_DIGITAIS_H
#define ENTRADAS_DIGITAIS_H

void ENTRADAS_init(void);
uint8_t ler_sensor_entrada(void);
uint8_t ler_sensor_saida(void);
uint8_t ler_estado_ligada(void);
uint8_t ler_estado_emergencia(void);
uint8_t ler_estado_producao(void);
uint8_t ler_estado_erro(void);

#endif