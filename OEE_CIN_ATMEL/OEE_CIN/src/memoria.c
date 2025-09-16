#include <avr/eeprom.h>
#include "memoria.h"

void salvar_total_na_eeprom(uint16_t total)
{
    eeprom_update_word((uint16_t*)0, total);
}

uint16_t ler_total_da_eeprom(void)
{
    return eeprom_read_word((uint16_t*)0);
}