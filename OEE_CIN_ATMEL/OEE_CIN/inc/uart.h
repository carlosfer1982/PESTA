#ifndef UART_H
#define UART_H

void UART_init(unsigned int baud);
void UART_sendChar(char data);
void UART_sendString(const char *str);
uint8_t UART_available(void);
char UART_readChar(void);
#endif