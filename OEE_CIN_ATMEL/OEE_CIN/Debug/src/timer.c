#include <avr/io.h>
#include <avr/interrupt.h>
#include "timer.h"

volatile uint16_t counter = 0;
volatile uint8_t counter500ms = 0;
volatile uint8_t flag_500ms = 0;
volatile uint8_t flag_1s = 0;


void TIMER0_init(void)
{
	TCCR0A = 0; // Timer counter control Register A - Operação normal da Porta - OC0A desconectado. Verificar DDR Pin relativo ao OC0A
    //TCCR0A |= (1 << WGM01); // Timer counter control Register A - Operação normal da Porta - OC0A desconectado. Verificar DDR Pin relativo ao OC0A
    TCCR0B = (1 << CS02) | (1 << CS00); // Timer Counter Register B - Clock Select bit - prescaler: 1024
    TIMSK0 = (1 << TOIE0); // Timer Counter Interrupt Mask = Overflow interrupt is enabled
    TCNT0 = 0; // Valor inicial de TCNT0
	//OCR0A = 61;
    sei(); // Habilita interrupções
	
	// Configurações do contador para 500 ms
	// Neste caso, não há um OCR para comparar, o tempo é o total dos 256 disponíveis, ou TOP.
	
}

ISR(TIMER0_OVF_vect) // Interrupção de overflow
{

    counter++;
    if (counter >= 16) {
        flag_500ms = 1;
		counter = 0;
		counter500ms++;

    }
	if(counter500ms == 4 ) 
	{
		PORTD ^= (1<<PD6);
		flag_1s = 1;
		counter500ms = 0;
	}
	
	
}


uint8_t TIMER0_check1s(void)
{
    
	if (flag_1s) {
        flag_1s = 0;
        return 1;
    }
    return 0;
}

uint8_t TIMER0_check500ms(void)
{
	    if (flag_500ms) {
		    flag_500ms = 0;
		    return 1;
	    }
	    return 0;
	
	
}
