#ifndef MEMORIA_H
#define MEMORIA_H

#include <stdint.h>

void salvar_total_na_eeprom(uint16_t total);
uint16_t ler_total_da_eeprom(void);

#endif