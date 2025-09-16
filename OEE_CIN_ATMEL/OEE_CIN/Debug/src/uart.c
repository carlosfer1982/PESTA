#include <avr/io.h>
#include "uart.h"

void UART_init(uint16_t baud)
{
	uint16_t ubrr = F_CPU/16/baud - 1;
	UBRR0H = (ubrr >> 8);
	UBRR0L = ubrr;
	UCSR0B = (1<<RXEN0)|(1<<TXEN0);
	UCSR0C = (1<<UCSZ01)|(1<<UCSZ00);
}

void UART_sendChar(char c)
{
	while (!(UCSR0A & (1<<UDRE0)));
	UDR0 = c;
}

void UART_sendString(const char* str)
{
	while (*str)
	UART_sendChar(*str++);
}

uint8_t UART_available()
{
	return (UCSR0A & (1<<RXC0));
}

char UART_readChar()
{
	while (!UART_available());
	return UDR0;
}
