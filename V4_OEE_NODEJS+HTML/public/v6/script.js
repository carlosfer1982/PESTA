import { teste } from './setup_script.js';
  // Variáveis para setup
var setup_data = JSON.stringify({});
var hora_atual_setup = null;
var hora_final_setup = null;
var horaInicio = null;
var tempo_estimado_setup = null;
var pausa_final = null;
var pausa_inicial = null;
var tempo_de_pausa = 0;

const btn_of = document.getElementById('btn_of');
btn_of.addEventListener('click', enviarComando('of'));

// Variáveis para produção
var hora_fim_setup = null;
var horaInicio_producao = null;
var cadencia = null;
let ultimoDado = null; 
let pausas = [];
let pauseTimer = 0;
let timeRunning = false;

// Butões



// mantém o último JSON recebido do servidor para usar no "finalizar"
// Adicionar cadencia e confrontar com a cadência real do equipamento.

function atualizarDados() {
  fetch('/api/micro/data')
    .then(res => res.json())
    .then(data => {
      document.getElementById('dados').textContent = JSON.stringify(data, null, 2);
      ultimoDado = data; // guarda o último dado recebido
      document.getElementById('of').textContent = data.of ? `Ordem de Fabrico: ${data.of}` : 'Ordem de Fabrico: N/A';
      document.getElementById('total').textContent = data.total ? `Quantidade Total: ${data.total}` : 'Quantidade Total: 0';
      document.getElementById('entrada').textContent = data.entrada ? `Entrada: ${data.entrada}` : 'Entrada: N/A';
      document.getElementById('saida').textContent = data.saida ? `Saída: ${data.saida}` : 'Saída: N/A';
      document.getElementById('producao').textContent = data.producao ? `Total Produzido: ${data.producao}` : 'Total Produzido: 0';
      document.getElementById('desperdicio').textContent = data.desperdicio ? `Desperdício: ${data.desperdicio}` : 'Desperdício: 0';
      //document.getElementById('ativo').textContent = data.ativo ? `Ativo: ${data.ativo}` : 'Ativo: 0';
      document.getElementById('ativo').textContent = data.ativo ? `Ativo: ${data.ativo}` : `Ativo: ${data.ativo}`;

      document.getElementById('m_producao').textContent = data.Maquina_em_Producao ? `Máquina em Produção: ${data.Maquina_em_Producao}` : 'Máquina em Produção: 0';
      document.getElementById('m_erro').textContent = data.Maquina_em_erro ? `Máquina em Erro: ${data.Maquina_em_erro}` : 'Máquina em Erro: 0';
      document.getElementById('m_normal').textContent = data.Maquina_em_normal ? `Máquina em Estado Normal: ${data.Maquina_em_normal}` : 'Máquina em Estado Normal: 0';
      document.getElementById('m_ligada').textContent = data.Maquina_ligada ? `Máquina Ligada: ${data.Maquina_ligada}` : 'Máquina Ligada: 0';


    })
    .catch(err => {
      document.getElementById('dados').textContent = 'Erro ao carregar dados';
    });

    // Atualiza e exibe a hora atual
    const hora_atual_setup = new Date();
    document.getElementById('hora_atual_setup').textContent = `Hora Atual: ${hora_atual_setup.toLocaleTimeString()}`;

    // Tempo de Pause


    // SETUP
    // Atualiza e exibe a duração do Setup
    
    if(horaInicio && !hora_fim_setup)
    {
      const duracao_min_setup = (hora_atual_setup - horaInicio);
      const tempo_decorrido_setup = formatarTempo(duracao_min_setup);
      document.getElementById('duracao_min_setup').textContent = `Duração do Setup: ${tempo_decorrido_setup}`;



    }
    // PRODUÇÃO
    // Atualiza e exibe a duração da Produção

}

function postData (payload) {
        fetch('/api/micro/cmd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
}





function enviarComando_producao(cmd) {
  let payload = {cmd};
  if (cmd === 'start') {
    if (!horaInicio_producao) {
      horaInicio_producao = new Date();
      document.getElementById('hora_inicial_producao').textContent = `Hora Inicial Produção: ${horaInicio_producao.toLocaleTimeString('pt-Pt')}`;

    }
  }
  
  fetch('/api/micro/cmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}





function regista_cadencia(cmd) {
cadencia = parseInt(prompt("Cadência (segundos):", "60"), 10);
}



function finalizarProducao(){
  if(confirm("Confirma que pretende finalizar a produção e gravar os dados na base de dados?")==true){
  
  const horaFim = new Date();
  const duracaoMs = ((horaFim - horaInicio));
  const duracaoSeg = duracaoMs /1000;
  const duracaoMin = duracaoSeg / 60; // converte para minutos

  // Dados adicionais para calculo do OEE
  // Tempo de setup
 
  

  ultimoDado = {...ultimoDado,
    horaInicio: horaInicio.toLocaleString(),
    horaFim: horaFim.toLocaleString(), 
    duracaoSeg,duracaoMin
  
  };
  horaInicio = null; // reseta para a próxima produção

  fetch('/api/db/producao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ultimoDado)
    });
    console.log('Os dados registados na base de dados foram:');
    console.log(JSON.stringify(ultimoDado));
    alert("Producao Finalizada!");

    fetch('/api/micro/cmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"cmd":"cancel"})
  });
  
  
  
  
  } else {
    return;
  }
  
  
}



// Quando o botão finalizar setup é carregado, o é enviado o comando de pause
//para o microcontrolador e regista-se a hora, caso a varável esteja nula.
document.getElementById('finalizar_setup').addEventListener('click', function(event) {
  enviarComando('pause');
  const tempo_estimado_setup_input = document.getElementById('tempo_estimado_setup_input');
  console.log(tempo_estimado_setup_input.value);


  if (!hora_fim_setup) {
      hora_fim_setup = new Date();
      setup_data.hora_fim_setup = hora_fim_setup;
      document.getElementById('hora_final').textContent = `Hora Final Setup: ${hora_fim_setup.toLocaleTimeString()}`;
      console.log(JSON.stringify(hora_fim_setup));
      
      //let kpi_parcial_setup = (hora_atual_setup.toLocaleTimeString());
      //console.log(kpi_parcial_setup.toLocaleString());
      //document.getElementById('hora_final').textContent = `Hora Final Setup: ${hora_fim_setup.toLocaleTimeString()}`;
      //document.getElementById('kpi_parcial_setp').textContent = `KPI Parcial Setup: ${kpi_parcial_setup.toLocaleString()}`;

    }


});

document.getElementById('tempo_estimado_setup').addEventListener('click', function(event) {
      
      tempo_estimado_setup = prompt("Tempo Estimado de Setup (min):", "15");
      document.getElementById('tempo_estimado_setup_text').textContent = `Tempo Estimado de Setup: ${tempo_estimado_setup}`;
      



      

});


function formatarTempo(ms) {
    const totalSegundos = Math.floor(ms / 1000);
    const segundos = totalSegundos % 60;
    const minutos = Math.floor(totalSegundos / 60) % 60;
    const horas = Math.floor(totalSegundos / (60 * 60));

    // Retorna a string formatada
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

setInterval(atualizarDados, 1000);
