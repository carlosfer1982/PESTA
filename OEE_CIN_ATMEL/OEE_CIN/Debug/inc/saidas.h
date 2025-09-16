#ifndef SAIDAS_H
#define SAIDAS_H

void SAIDAS_init(void);
void set_autorizacao(uint8_t estado);
void set_led_avaria(uint8_t estado);
void set_led_warning(uint8_t estado);
void set_led_normal(uint8_t estado);
void set_led_heartbeat(uint8_t estado);
void set_led_erro(uint8_t estado);

#endif