<h1>Este documento é composto por 3 Pastas</h1>
<ol>
	<li>OEE_CIN_ATMEL - Contém a programação do ATMEGA328P</li>
 	<li>OEE_Proteus_SIM - Contém o desenho esquemático e simulação do Circuito do ATMEGA328P</li>
  	<li>V4_OEE_NODEJS+HTML - Contém o servidor que está a correr o Serial PORT, bem como as API´s necessárias (back-end) e páginas</li>
</ol>


<h1>1. OEE_CIN_ATMEL - Contém a programação do ATMEGA328P</h1>
<p>A pasta OEE_CIN_ATMEL apresenta o projeto e todos os ficheiros .c e .h relacionados ao projeto. É possível abrir o Projeto através do Atmel Studio ou qualquer ficheiro em separado.
Note que não há um makefile, pois o mesmo foi gerado automaticamente pelo Atmel Studio</p>

<h1>2. OEE_PRoteus_SIM - Contém o desenho esquemático e simulação do Circuito do ATMEGA328P</h1>
O Ficheiro .hex gerado pelo atmel encontra-se na mesma pasta. Assim, é possível executar a simulação a partir do Proteus. Com a simulação em execução, 
é possível enviar os comandos. Preferencialmente, copiar e colar, caso necessário, pode-se alterar quaisquer dados.
Possíveis comandos de envio do PC para o Microcontrolador:

<h2>Comandos</h2>
<p>
Troca de informações: Quando o Proteus estiver aberto, a correr o ficheiro .hex, é possível copiar e colar no serialcom os comandos para o microcontrolador
Pode-se enviar tudo em de uma vez, separado por vígula ou um a um.
</p>
<div>ENVIO PC - > Microcontrolador</div>
<div>Envio "tudo de uma vez"</div>
<div>Exemplo 1: </div>
<div><b>{"of":"10F2025","setq":100,"cmd":"start"}</b></div>
<br>
<div>Exemplo 2: </div>
<div><b>{"of":"TESTE_01","setq":10,"cmd":"start"}</b></div>
<br>
Explicação: envio de ordem de fabrico ("of":"TESTE_01"), quantidade total ("setq":10) e comando para iniciar ("cmd":"start")
<br>
<br>

<div>Alternativamente, os envios podem ser separado, tal como apresentado abaixo:</div>
<b>{"of":"TESTE_01"}</b> <br>
<b>{"setq":10}</b>	<br>
<b>{"cmd":"start"}</b> <br>
<br>
<p> Explicação:
Comando para fazer o pause no envio de dados	
{"cmd":"pause"}

Comando para iniciar o envio de dados
{"cmd":"start"}

Comando para finalizar uma produção ou cancelar
{"cmd":"cancel"}
</p>		
	
<h1> 3. V4_OEE_NODEJS+HTML - Contém o servidor que está a correr o Serial PORT, bem como as API´s necessárias (back-end) e páginas HTML necessárias (Front-end) </h1>

<p> Para correr o servidor sem o microcontrolador: </p>
<b>npm run dev_no_serial</b>
ou
<b>node dev_no_serial.js</b> <br>
<br>

No navegador, digitar: http://localhost:3000/v51 - versão do vídeo



