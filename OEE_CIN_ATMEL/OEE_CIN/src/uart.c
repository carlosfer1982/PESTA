#include <avr/io.h>
#include "uart.h"

void UART_init(uint16_t baud) // Asynchronous normal mode
{
	uint16_t ubrr = F_CPU/16/baud - 1; // calculo do ubrr para manter 38400 @ 8 Mhz. Logo, 8x10^6/(16*38400) = 12,020. De acordo com a tabela, é esperado uma taxa de erro de 0,2%
	UBRR0H = (ubrr >> 8);				// Número de 16 bits é distribuído entre a parte alta e baixa do registo
	UBRR0L = ubrr;
	UCSR0B = (1<<RXEN0)|(1<<TXEN0);		// Habilita o RX e TX (full-duplex)
	UCSR0C = (1<<UCSZ01)|(1<<UCSZ00);	// Character size = 8 bits (8 bits de dados)
}

void UART_sendChar(char c)
{
	while (!(UCSR0A & (1<<UDRE0))); // Verifica se o buffer de transmissão está vazio
	UDR0 = c;						// transmite um caracter
}

void UART_sendString(const char* str)	// recebe um ponteiro para uma string
{
	while (*str)						// Se mantem no loop até encontrar o '\0'
	UART_sendChar(*str++);				// A string é enviada caracter a caracter para a função UART_sendChar. O ponteiro é incrementado a cada iteração.
}

uint8_t UART_available()		// Verifica o estado do registo da UART.
{
	return (UCSR0A & (1<<RXC0));
}

char UART_readChar()
{
	while (!UART_available());	// Se a UART estiver "ocupada", retorna o registo.
	return UDR0;
}
