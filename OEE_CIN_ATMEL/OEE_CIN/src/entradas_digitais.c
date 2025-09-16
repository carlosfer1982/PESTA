#include <avr/io.h>
#include "entradas_digitais.h"

void ENTRADAS_init(void)
{
    DDRC &= ~(1 << PC3); // Passa a 0 (zero) o PC3 do DDRC - Define o pino como entrada
    DDRD &= ~(1 << PD4 | 1 << PD7);
    DDRB &= ~(1 << PB0 | 1 << PB1 | 1 << PB2);
	PORTC |= (1 << PC3);	// Passa a 1 o PC3 do PORTC - Liga resistência de pull-up
    PORTD |= (1 << PD4) | (1 << PD7);
    PORTB |= (1 << PB0) | (1 << PB1) | (1 << PB2);
}

uint8_t ler_sensor_entrada(void)    { return !(PINC & (1 << PC3)); } // A função retorna o valor do estado do pino PC3 no Porto C. Note que devido ao pull-up, esta lógica teve que ser invertida.
uint8_t ler_sensor_saida(void)      { return !(PIND & (1 << PD4)); }
uint8_t ler_estado_ligada(void)     { return !(PINB & (1 << PB0)); }
uint8_t ler_estado_emergencia(void) { return !(PINB & (1 << PB1)); }
uint8_t ler_estado_producao(void)   { return !(PINB & (1 << PB2)); }
uint8_t ler_estado_erro(void)       { return !(PIND & (1 << PD7)); }