var hora_atual = null;
var horaInicio = null;
var cadencia = null;
let ultimoDado = null; // mantém o último JSON recebido do servidor para usar no "finalizar"
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

  if (hora_atual === null) {
    const hora_atual = new Date();
    document.getElementById('hora_atual').textContent = `Hora Atual: ${hora_atual.toLocaleTimeString()}`;
    document.getElementById('hora_inicial').textContent = `Hora Atual: ${horaInicio.toLocaleTimeString()}`;

  }   
}

function enviarComando(cmd) {
  let payload = { cmd };
  if (cmd === 'of') {
    payload.of = prompt("Ordem de Fabrico:", "OF2025");
  }
  if (cmd === 'setq') {
    payload.setq = parseInt(prompt("Quantidade a produzir:", "100"), 10);
  }

  if (cmd === 'start') {
    if (!horaInicio) {
      horaInicio = new Date();
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

  
  

  ultimoDado = {horaInicio: horaInicio.toISOString(),horaFim: horaFim.toISOString(), duracaoSeg,duracaoMin,...ultimoDado};
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


 document.getElementById('mostrarFormularioBtn').addEventListener('click', function() {
    const formulario = document.getElementById('form_setup');
    if (formulario.style.display === 'none') {
      formulario.style.display = 'block'; // Torna o formulário visível
    } else {
      formulario.style.display = 'none'; // Oculta o formulário
    }
  });


setInterval(atualizarDados, 1000);
