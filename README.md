#Este documento é composto por 3 Pastas

#OEE_CIN_ATMEL - Contém a programação do ATMEGA328P

#OEE_PRoteus_SIM - Contém o desenho esquemático e simulação do Circuito do ATMEGA328P. 
O Ficheiro .hex gerado pelo atmel encontra-se na mesma pasta. Assim, é possível executar a simulação a partir do Proteus. Com a simulação em execução, 
é possível enviar os comandos. Preferencialmente, copiar e colar, caso necessário, pode-se alterar quaisquer dados.
Possíveis comandos de envio do PC para o Microcontrolador:

## Comandos

/*
Troca de informações
Quando o Proteus estiver aberto, a correr o ficheiro .hex, é possível copiar e colar no serialcom os comandos para o microcontrolador
Pode-se enviar tudo em de uma vez, separado por vígula ou um a um.
ENVIO PC - > Microcontrolador
Envio "tudo de uma vez"
exemplo 1: Envio de ordem de fabrico ("of":"10F2025"), quantidade total ("setq":100) e comando para iniciar ("cmd":"start")
{"of":"10F2025","setq":100,"cmd":"start"}
exemplo 2: 
{"of":"TESTE_01","setq":10,"cmd":"start"}

Envio separado:
{"of":"TESTE_01"}
{"setq":10}
{"cmd":"start"}
	
Comando para fazer o pause no envio de dados	
{"cmd":"pause"}

Comando para iniciar o envio de dados
{"cmd":"start"}

Comando para finalizar uma produção ou cancelar
{"cmd":"cancel"}
		
	
*/


#V4_OEE_NODEJS+HTML - Contém o servidor que está a correr o Serial PORT, bem como as API´s necessárias (back-end) e páginas 
HTML necessárias (Front-end)
