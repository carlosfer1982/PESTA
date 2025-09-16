#include <avr/eeprom.h>
#include "memoria.h"

void salvar_total_na_eeprom(uint16_t total)
{
    eeprom_update_word((uint16_t*)0, total); // S� regista na mem�ria se o valor for diferente do que est� l�. Posi��o 0, um valor de 16 bits
}

uint16_t ler_total_da_eeprom(void)
{
    return eeprom_read_word((uint16_t*)0); // Retorna a posi��o 0 (zero) de 16 bits
}