document.addEventListener('DOMContentLoaded', () => {

    // Referências aos elementos HTML
    const dashboardContent = document.getElementById('dashboard-content');
    const actionButtonsDashboard = document.getElementById('action-buttons-dashboard');
    const actionButtonsModal = document.getElementById('action-buttons-modal');

    const modalIniciarProducao = document.getElementById('modal-iniciar-producao');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnIniciar = document.getElementById('btn-iniciar');

    // Função para atualizar a data e hora no cabeçalho
    function atualizarDataHora() {
        const elementoDataHora = document.querySelector('.data-hora');
        const agora = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dataHoraFormatada = agora.toLocaleDateString('pt-PT', options).replace(',', '');
        elementoDataHora.textContent = dataHoraFormatada;
    }

    // Atualiza a data e hora a cada segundo
    setInterval(atualizarDataHora, 1000);
    atualizarDataHora();

    // Lógica para mostrar o modal e esconder a dashboard na inicialização
    function mostrarModalInicial() {
        modalIniciarProducao.style.display = 'flex';
        actionButtonsModal.style.display = 'flex';
        dashboardContent.style.display = 'none';
        actionButtonsDashboard.style.display = 'none';
    }

    // Abre o modal quando o botão "Iniciar Produção" for clicado
    btnAbrirModal.addEventListener('click', () => {
        modalIniciarProducao.style.display = 'flex';
        actionButtonsModal.style.display = 'flex';
        dashboardContent.style.display = 'none';
        actionButtonsDashboard.style.display = 'none';
    });
    
    // Lógica para o botão "Cancelar" do modal
    btnCancelar.addEventListener('click', () => {
        modalIniciarProducao.style.display = 'none';
        actionButtonsModal.style.display = 'flex';
        dashboardContent.style.display = 'none';
        actionButtonsDashboard.style.display = 'none';
    });

    // Lógica para o botão "Iniciar" do modal
    btnIniciar.addEventListener('click', () => {
        // Captura os valores dos campos
        const ordemProducao = document.getElementById('ordem-producao').value;
        const nomeProduto = document.getElementById('nome-produto').value;
        const cadenciaInput = document.getElementById('cadencia-input').value;
        const objetivoInput = document.getElementById('objetivo-input').value;

        console.log({ ordemProducao, nomeProduto, cadenciaInput, objetivoInput });
        
        // Simulação dos dados que seriam buscados de uma API
        
        const dadosProducao = {
            linha: "Linha 1",
            estado: "Em produção",
            produto: "Cináqua",
            ordem: "OF2025-1000",
            turno: "Diurno",
            equipe: "AO (1 pessoa)"
        };

        // Preenche a dashboard com os dados do modal
        document.getElementById('info-linha').textContent = dadosProducao.linha;
        document.getElementById('info-estado').textContent = dadosProducao.estado;
        document.getElementById('info-produto').textContent = dadosProducao.produto;
        document.getElementById('info-ordem').textContent = dadosProducao.ordem;
        document.getElementById('info-turno').textContent = dadosProducao.turno;
        document.getElementById('info-equipe').textContent = dadosProducao.equipe;

        // Esconde o modal e mostra a dashboard
        modalIniciarProducao.style.display = 'none';
        actionButtonsModal.style.display = 'none';
        dashboardContent.style.display = 'flex';
        actionButtonsDashboard.style.display = 'flex';
    });

    // Lógica dos botões de ação da dashboard
    document.getElementById('btn-trocar-equipe').addEventListener('click', () => {
        enviarComando('start');
        alert('Comando start enviado!');
        
    });

    document.getElementById('btn-suspender').addEventListener('click', () => {
        alert('Botão "Suspender Produção" clicado!');
    });

    document.getElementById('btn-terminar').addEventListener('click', () => {
        alert('Botão "Terminar Produção" clicado!');
    });
    
    // Inicia a aplicação mostrando o modal de configuração
    //mostrarModalInicial();
});


    function atualizarDados() {
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
        document.getElementById('dados').textContent = JSON.stringify(data, null, 2);
        })
        .catch(err => {
        document.getElementById('dados').textContent = 'Erro ao carregar dados';
        });



        function enviarComando(cmd) {
    let payload = { cmd };
    if (cmd === 'start') {
        payload.of = prompt("Ordem de Fabrico:", "OF2025");
        payload.setq = parseInt(prompt("Quantidade a produzir:", "100"), 10);
    }
    fetch('/api/cmd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });


    setInterval(atualizarDados, 1000);

    }










}

