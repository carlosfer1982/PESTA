#include <avr/io.h>
#include "saidas.h"

void SAIDAS_init(void)
{
    DDRD |= (1 << PD2) | (1 << PD3) | (1 << PD5) | (1 << PD6);
    DDRC |= (1 << PC4) | (1 << PC5);
}

void set_autorizacao(uint8_t estado)       { if (estado) PORTD |= (1 << PD2); else PORTD &= ~(1 << PD2); }
void set_led_avaria(uint8_t estado)        { if (estado) PORTD |= (1 << PD3); else PORTD &= ~(1 << PD3); }
void set_led_warning(uint8_t estado)       { if (estado) PORTD |= (1 << PD5); else PORTD &= ~(1 << PD5); }
void set_led_normal(uint8_t estado)        { if (estado) PORTD |= (1 << PD6); else PORTD &= ~(1 << PD6); }
void set_led_heartbeat(uint8_t estado)     { if (estado) PORTC |= (1 << PC4); else PORTC &= ~(1 << PC4); }
void set_led_erro(uint8_t estado)          { if (estado) PORTC |= (1 << PC5); else PORTC &= ~(1 << PC5); }