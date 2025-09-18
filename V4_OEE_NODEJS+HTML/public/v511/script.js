
// Variáveis para setup
var setup_data = JSON.stringify({});
var hora_atual_setup = null;
var hora_final_setup = null;
var horaInicio = null;
var tempo_decorrido_setup = 0;
var tempo_estimado_setup = null;
var pausa_final = null;
var pausa_inicial = null;
var tempo_de_pausa = 0;



// Variáveis para produção
var hora_fim_setup = null;
var horaInicio_producao = null;
var duracao_estimada_producao = null;
var cadencia = null;
let ultimoDado = null;
let pausas = [];
let pauseTimer = 0;
let timeRunning = false;


// Variáveis para KPI
var kpi_parcial_qualidade = 0;


// Botões

const COMANDOS = {
  'of': "of",
  'setq': 'setq',
  'start': 'start',
  'pause': 'pause'
}

// Interação com o DOM
// Botões de Setup
const btn_of = document.getElementById('btn_of');
const btn_setq = document.getElementById('btn_setq');
const btn_start = document.getElementById('btn_start');
const btn_pause = document.getElementById('pause');
const btn_cadencia = document.getElementById('btn_cadencia');
const btn_tempo_estimado_setup = document.getElementById('tempo_estimado_setup');

/*
document.getElementById('tempo_estimado_setup').addEventListener('click', function (event) {

  tempo_estimado_setup = prompt("Tempo Estimado de Setup (min):", "15");
  document.getElementById('tempo_estimado_setup_text').textContent = `Tempo Estimado de Setup: ${tempo_estimado_setup}`;






});
*/


btn_of.addEventListener('click', () => enviarComando('of'));
btn_setq.addEventListener('click', () => enviarComando('setq'));
btn_start.addEventListener('click', () => enviarComando('start'));
btn_pause.addEventListener('click', () => enviarComando('pause'));
btn_cadencia.addEventListener('click', () => regista_cadencia());
btn_tempo_estimado_setup.addEventListener('click', () => regista_tempo_estimado_setup());

// Controlo do Tempo de pausa
btn_pause.addEventListener('click', () => teste_pause());
btn_start.addEventListener('click', () => teste_start());


var teste_pause_incial = {};
var contagem = false;
var contagem_pausas = 0;
var teste_start_final = {};
var tempo_total_pausa = 0;
var trabalho_iniciado = false;

function teste_pause() {
  if (contagem === false && trabalho_iniciado === true) {
    teste_pause_incial = new Date();
    contagem = true;
    contagem_pausas += 1;
    alert(teste_pause_incial.toLocaleTimeString());
    console.log("contagem_pausas: %d, contagem: %d",contagem_pausas, contagem);
    console.log(contagem);
  }
}


function teste_start() {
trabalho_iniciado = true;
btn_of.disabled = true;
btn_setq.disabled = true;
btn_cadencia.disabled = true;
btn_tempo_estimado_setup.disabled = true;



  if (contagem === true) {
    teste_start_final = new Date();
    contagem = false;
    console.log(contagem_pausas);
    console.log(contagem);
    console.log((teste_start_final - teste_pause_incial) / 1000);
    alert(teste_start_final.toLocaleTimeString());
    tempo_total_pausa += (teste_start_final - teste_pause_incial) / 1000;
    console.log(tempo_total_pausa);
  }



}


function regista_tempo_estimado_setup() {
  tempo_estimado_setup = parseInt(prompt("Tempo Estimado de Setup (min):", "15"), 10);
  document.getElementById('tempo_estimado_setup_text').textContent = `Tempo Estimado de Setup: ${tempo_estimado_setup}`;
}


// Botões de Produção


const btn_start_producao = document.getElementById('btn_start_producao');
const btn_pause_producao = document.getElementById('btn_pause_producao');
const btn_cancel_producao = document.getElementById('btn_cancel_producao');
const btn_finalizar_producao = document.getElementById('btnFinalizar');



btn_start_producao.addEventListener('click', () => start_producao());
btn_pause_producao.addEventListener('click', () => pause_producao());
btn_cancel_producao.addEventListener('click', () => cancel_producao());
btn_finalizar_producao.addEventListener('click', finalizarProducao);

// Modo inicial dos botões da produção
btn_start_producao.disabled = true;
btn_pause_producao.disabled = true;
btn_cancel_producao.disabled = true;
btn_finalizar_producao.disabled = true;


const tempo_de_pausa_producao = document.getElementById('tempo_de_pausa_producao');





// mantém o último JSON recebido do servidor para usar no "finalizar"
// Adicionar cadencia e confrontar com a cadência real do equipamento.

function atualizarDados() {
  fetch('/api/micro/data')
    .then(res => res.json())
    .then(data => {
      document.getElementById('dados').textContent = JSON.stringify(data, null, 2);
      document.getElementById('of').textContent = data.of ? `Ordem de Fabrico: ${data.of}` : 'Ordem de Fabrico: N/A';
      ultimoDado = data; // guarda o último dado recebido

      document.getElementById('total').textContent = data.total ? `Quantidade Total: ${data.total}` : 'Quantidade Total: 0';
      document.getElementById('entrada').textContent = data.entrada ? `Entrada: ${data.entrada}` : 'Entrada: 0';
      document.getElementById('saida').textContent = data.saida ? `Saída: ${data.saida}` : 'Saída: 0';
      document.getElementById('producao').textContent = data.producao ? `Total Produzido: ${data.producao}` : 'Total Produzido: 0';
      document.getElementById('desperdicio').textContent = data.desperdicio ? `Desperdício: ${data.desperdicio}` : 'Desperdício: 0';
      //document.getElementById('ativo').textContent = data.ativo ? `Ativo: ${data.ativo}` : 'Ativo: 0';
      document.getElementById('ativo').textContent = data.ativo ? `Ativo: ${data.ativo}` : `Ativo: 0`;

      document.getElementById('m_producao').textContent = data.Maquina_em_Producao ? `Máquina em Produção: ${data.Maquina_em_Producao}` : 'Máquina em Produção: 0';
      document.getElementById('m_erro').textContent = data.Maquina_em_erro ? `Máquina em Erro: ${data.Maquina_em_erro}` : 'Máquina em Erro: 0';
      document.getElementById('m_normal').textContent = data.Maquina_em_normal ? `Máquina em Estado Normal: ${data.Maquina_em_normal}` : 'Máquina em Estado Normal: 0';
      document.getElementById('m_ligada').textContent = data.Maquina_ligada ? `Máquina Ligada: ${data.Maquina_ligada}` : 'Máquina Ligada: 0';
      //console.log(JSON.stringify(ultimoDado.entrada,null,2));

    })
    .catch(err => {
      document.getElementById('dados').textContent = 'Erro ao carregar dados';
    });

  // Atualiza e exibe a hora atual
  const hora_atual_setup = new Date();
  document.getElementById('hora_atual_setup').textContent = `Hora Atual: ${hora_atual_setup.toLocaleTimeString()}`;

  // Atualiza KPI - Qualidade
  kpi_parcial_qualidade = (ultimoDado.total - ultimoDado.desperdicio) / ultimoDado.total * 100 || 0;
  document.getElementById('kpi_parcial_qualidade').textContent = `KPI - Qualidade: ${kpi_parcial_qualidade} %`;



  // SETUP
  // Atualiza e exibe a duração do Setup

  if (horaInicio && !hora_fim_setup) {
    const duracao_min_setup = (hora_atual_setup - horaInicio);
    tempo_decorrido_setup = formatarTempo(duracao_min_setup);
    document.getElementById('duracao_min_setup').textContent = `Duração do Setup: ${tempo_decorrido_setup}`;




  }
  // Tempo total de pausa
  const duracao_pausa = formatarTempo(tempo_total_pausa * 1000);
  document.getElementById('tempo_de_pausa').textContent = `Tempo de Pausa: ${duracao_pausa} segundos`;

}

function postData(payload) {
  fetch('/api/micro/cmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}



function enviarComando(cmd) {
  let payload = { cmd };
  switch (COMANDOS[cmd]) {
    case COMANDOS.of:
      payload[COMANDOS.of] = prompt("Ordem de Fabrico:", "OF2025");
      break;
    case COMANDOS.setq:
      payload[COMANDOS.setq] = parseInt(prompt("Quantidade a produzir:", "100"), 10);
      break;
    case COMANDOS.start:
      pausa_final = new Date();
      timeRunning = true;
      if (!horaInicio) {
        horaInicio = new Date();
        setup_data.hora_inicial = horaInicio;
        document.getElementById('hora_inicial').textContent = `Hora Inicial Setup: ${horaInicio.toLocaleTimeString()}`;
        
      }
      break;
    case COMANDOS.pause:
      if (timeRunning) {
        tempo_de_pausa = new Date();
        pausas.push(new Date());
        if (pausas.length === 2) {
          pauseTimer += +(pausas[1] - pausas[0]);
          //document.getElementById('tempo_de_pausa').textContent = `Tempo de Pausa: ${pauseTimer / 1000} segundos`;
          //document.getElementById('tempo_de_pausa').textContent = `Tempo de Pausa: ${tempo_total_pausa} segundos`;
          
          pausas = [];
        }
      }
      timeRunning = false;
      break;
    default:
      break;
  }
  console.log({
    cmd,
    pausas,
    pauseTimer
  })
  postData({ 'cmd': cmd });

}


function start_producao() {
      btn_finalizar_producao.disabled = false;
 if (!horaInicio_producao) {
      horaInicio_producao = new Date();
      document.getElementById('hora_inicial_producao').textContent = `Hora Inicial Produção: ${horaInicio_producao.toLocaleTimeString('pt-Pt')}`;
    }
  
  postData({ 'cmd': "start" });
}


function pause_producao() {

  
  postData({ 'cmd': "pause" });
}



function cancel_producao() {
  
  
  postData({ 'cmd': "cancel" });

}





function regista_cadencia(cmd) {
  cadencia = parseInt(prompt("Cadência (segundos):", "60"), 10);
}



function finalizarProducao() {
  if (confirm("Confirma que pretende finalizar a produção e gravar os dados na base de dados?") == true) {

    const horaFim = new Date();
    const duracaoMs = ((horaFim - horaInicio_producao));
    const duracaoSeg = duracaoMs / 1000;
    const duracaoMin = duracaoSeg / 60; // converte para minutos

    // Dados adicionais para calculo do OEE
    // Tempo de setup



    ultimoDado = {
      ...ultimoDado,
      hora_inicio_setup: horaInicio.toLocaleString(),
      hora_fim_setup: hora_fim_setup.toLocaleString(),
      duração_setup: tempo_decorrido_setup,
      tempo_estimado_setup: tempo_estimado_setup,
      tempo_de_pausa: pauseTimer / 1000, // em segundos
      cadencia: cadencia,
      // Dados de produção
      hora_inicio_producao: horaInicio_producao.toLocaleString(),
      hora_fim_producao: horaFim.toLocaleString(),
      duracaoSeg_producao: duracaoSeg,
      duracaomin_producao: duracaoMin,
      kpi_parcial_qualidade: kpi_parcial_qualidade

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
      body: JSON.stringify({ "cmd": "cancel" })
    });


    window.location.reload(true); // recarrega a página para reiniciar o processo

  } else {
    return;
  }


}



// Quando o botão finalizar setup é carregado, o é enviado o comando de pause
//para o microcontrolador e regista-se a hora, caso a varável esteja nula.
document.getElementById('finalizar_setup').addEventListener('click', function (event) {
  enviarComando('pause');
  const tempo_estimado_setup_input = document.getElementById('tempo_estimado_setup_input');
  console.log(tempo_estimado_setup_input.value);


  if (!hora_fim_setup) {
    hora_fim_setup = new Date();
    setup_data.hora_fim_setup = hora_fim_setup;
    document.getElementById('hora_final').textContent = `Hora Final Setup: ${hora_fim_setup.toLocaleTimeString()}`;
    console.log(JSON.stringify(hora_fim_setup));
    duracao_estimada_producao = Math.floor((ultimoDado.total / cadencia) * 100) / 100;
    document.getElementById('duracao_estimada_producao').textContent = `Duração Estimada Produção: ${duracao_estimada_producao} segundos`;
    
    btn_start.disabled = true;
    btn_pause.disabled = true;
    document.getElementById('finalizar_setup').disabled = true;
    document.getElementById('btn_cancel').disabled = true;

    // Ativa os botões da produção
    btn_start_producao.disabled = false;
    btn_pause_producao.disabled = false;
    btn_cancel_producao.disabled = false;



  
    //btn_of.disabled = false;
    //btn_setq.disabled = false;

    // Cálculo do KPI Parcial Setup
    //kpi_parcial_setup = (tempo_estimado_setup - tempo_decorrido_setup) / tempo_estimado_setup * 100;
    //console.log(tempo_estimado_setup);
    //console.log(tempo_decorrido_setup);
    //console.log(kpi_parcial_setup);
    //setup_data.kpi_parcial_setup = kpi_parcial_setup;
    //console.log(JSON.stringify(kpi_parcial_setup));
    //let kpi_parcial_setup = (hora_atual_setup.toLocaleTimeString());
    //console.log(kpi_parcial_setup.toLocaleString());
    //document.getElementById('hora_final').textContent = `Hora Final Setup: ${hora_fim_setup.toLocaleTimeString()}`;
    //document.getElementById('kpi_parcial_setp').textContent = `KPI Parcial Setup: ${kpi_parcial_setup.toLocaleString()}`;

  }


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
