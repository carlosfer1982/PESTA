#include <avr/io.h>
#include "entradas_analogicas.h"

void ANALOGICAS_init(void)
{
    ADMUX = (1 << REFS0);
    ADCSRA = (1 << ADEN) | (1 << ADPS2) | (1 << ADPS1);
}

uint16_t ler_tensao(void) {
    ADMUX = (ADMUX & 0xF0) | 0;
    ADCSRA |= (1 << ADSC);
    while (ADCSRA & (1 << ADSC));
    return ADC;
}

uint16_t ler_corrente(void) {
    ADMUX = (ADMUX & 0xF0) | 1;
    ADCSRA |= (1 << ADSC);
    while (ADCSRA & (1 << ADSC));
    return ADC;
}

uint16_t ler_caudal(void) {
    ADMUX = (ADMUX & 0xF0) | 2;
    ADCSRA |= (1 << ADSC);
    while (ADCSRA & (1 << ADSC));
    return ADC;
}