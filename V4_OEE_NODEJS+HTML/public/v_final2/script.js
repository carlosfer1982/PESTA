import { atualizarDuracao, formatarTempo } from './myscripts.js';
import { calculaIntervalodeTempo, atualizarDataHora } from './myscripts.js';
// Variaveis globais
let duracao = false;
let hora_inicio_producao = null;
let duracao_atual = null;
let pausa = false;
let preparacao = false;


// Código principal a ser executado após o carregamento do DOM



document.addEventListener('DOMContentLoaded', () => {

    // Referências aos elementos HTML
    const dashboardContent = document.getElementById('dashboard-content');
    const actionButtonsDashboard = document.getElementById('action-buttons-dashboard');
    const actionButtonsModal = document.getElementById('action-buttons-modal');

    // Elementos do Modal Preparação
    // BOTÃO: INICIAR E CANCELAR
    const btnIniciarPreparacao = document.getElementById('btn-preparacao-iniciar');
    const btnCancelarPreparacao = document.getElementById('btn-preparacao-cancelar');

    // Botão DO ECRÃ Principal "INICIAR PREPARAÇÃO", "INICIAR PRODUÇÃO" E "INICIAR MANUTENÇÃO"
    const modalIniciarPreparacao = document.getElementById('modal-iniciar-preparacao');
    const modalIniciarProducao = document.getElementById('modal-suspender');


    //const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnAbrirModalPreparacao = document.getElementById('btn-abrir-modal-preparacao');
    const btnCancelarSuspender = document.getElementById('btn-cancelar-modal-suspender');
    const btnIniciarSuspender = document.getElementById('btn-iniciar-modal-suspender');

    const btnSuspender = document.getElementById('btn-suspender');






    // Atualiza a data e hora a cada segundo
    //setInterval(atualizarDataHora, 1000);
    //atualizarDataHora();


    // Loop de 1 segundo
    // Nesta secção devem estar os códigos que se repetem a cada 1 segundo
    setInterval(() => {

        // Atualizada Data e Hora exibida no cabeçalho
        atualizarDataHora();



        // Atualização do info-card-duração
        if (duracao) {
            duracao_atual = atualizarDuracao(hora_inicio_producao);
            document.getElementById('info-tempo-decorrido').textContent = formatarTempo(duracao_atual);
        }

    }, 1000);


    // Atualizado Duração
    // Verifica se a variável dadosProducao.hora_inicial2 existe





    // Lógica dos botões do Modal Preparação
    // Lógica para o botão "Iniciar" do modal de Preparação
    btnIniciarPreparacao.addEventListener('click', () => {
        alert('Iniciar botão Modal Preparação - Evento 1 - gestão do modal');
        modalIniciarPreparacao.style.display = 'none';
        actionButtonsModal.style.display = 'none';
        dashboardContent.style.display = 'flex';
        actionButtonsDashboard.style.display = 'flex';


    });

    // Lógica para o botão "Cancelar" do modal de Preparação
    btnCancelarPreparacao.addEventListener('click', () => {
        alert('Cancelar botão Modal Preparação');
        modalIniciarPreparacao.style.display = 'none';


    });

    // Lógica para mostrar o modal e esconder a dashboard na inicialização
    function mostrarModalInicial() {
        modalIniciarPreparacao.style.display = 'none';
        actionButtonsModal.style.display = 'flex';
        dashboardContent.style.display = 'none';
        actionButtonsDashboard.style.display = 'none';
    }

    // Abre o modal quando o botão "INICIAR PREPARAÇÃO" for clicado
    btnAbrirModalPreparacao.addEventListener('click', () => {
        modalIniciarPreparacao.style.display = 'flex';
        //actionButtonsModal.style.display = 'flex';
        //dashboardContent.style.display = 'none';
        //actionButtonsDashboard.style.display = 'none';
        //alert('teste');
    });


    // Abre o modal quando o botão "Iniciar Produção" for clicado
    //btnAbrirModal.addEventListener('click', () => {

    //});

    // bOTÃO SUSPENDER PRODUÇÃO - MODAL SUSPENDER
    btnIniciarSuspender.addEventListener('click', () => {
        alert('Iniciar botão Modal Suspender - btn-iniciar-modal-suspender');
        if (pausa == false) {
            pausa = true;
            modalIniciarProducao.style.display = 'none';
            actionButtonsModal.style.display = 'none';
            dashboardContent.style.display = 'flex';
            actionButtonsDashboard.style.display = 'flex';  
            btnSuspender.textContent = "RETOMAR PRODUÇÃO";
        }
        else {
            pausa = false;
            modalIniciarProducao.style.display = 'none';
            actionButtonsModal.style.display = 'none';
            dashboardContent.style.display = 'flex';
            actionButtonsDashboard.style.display = 'flex';
            btnSuspender.textContent = "SUSPENDER PRODUÇÃO";
        }


    });

    // Lógica para o botão "Cancelar" do modal SUSPENDER
    btnCancelarSuspender.addEventListener('click', () => {
        modalIniciarProducao.style.display = 'none';
        actionButtonsModal.style.display = 'none';
        dashboardContent.style.display = 'flex';
        actionButtonsDashboard.style.display = 'flex';
        alert('Cancelar botão Modal Suspender');
    });

    // Lógica para o botão "Iniciar" do modal
    btnIniciarPreparacao.addEventListener('click', () => {
        // Captura os valores dos campos
        //alert('Evento 1 - Parte 2 - Gestão funcional');    
        const equipamento = document.getElementById('lista-equipamento').value;
        const ordemProducao = document.getElementById('ordem-fabrico-producao').value;
        const quantidadeProducao = document.getElementById('quantidade-preparacao').value;
        const cadenciaInput = document.getElementById('lista-cadencia-teorica').value;
        const objetivoInput = document.getElementById('tempo-estimado-preparacao').value;
        console.log("Teste de Funcionamento");

        console.log({ equipamento, ordemProducao, quantidadeProducao, cadenciaInput, objetivoInput });

        // Simulação dos dados que seriam buscados de uma API

        /*
        const dadosProducao = {
            linha: "Linha 1",
            estado: "Em produção",
            produto: "Cináqua",
            ordem: "OF2025-1000",
            turno: "Diurno",
            equipe: "AO (1 pessoa)"
        };
        */

        // Dados preenchidos com os valores do modal ou valores padrão
        const dadosProducao = {
            linha: equipamento || "RO-11",
            estado: "Em produção",
            quantidade: quantidadeProducao || "25",
            ordem: ordemProducao || "OF2025-1000",
            turno: cadenciaInput,
            equipe: "AO (1 pessoa)",
            hora_inicio: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            tempo_estimado_duracao: (quantidadeProducao / cadenciaInput) + (Number(objetivoInput) / 60),
            hora_inicial2: Date.now()

        };

        // Preenche a dashboard com os dados do modal
        document.getElementById('info-linha').textContent = dadosProducao.linha;
        document.getElementById('info-estado').textContent = dadosProducao.estado;
        document.getElementById('info-quantidade').textContent = dadosProducao.quantidade;
        document.getElementById('info-ordem').textContent = dadosProducao.ordem;
        document.getElementById('info-cadencia').textContent = dadosProducao.turno;
        document.getElementById('info-equipe').textContent = dadosProducao.equipe;
        document.getElementById('info_hora_inicio').textContent = dadosProducao.hora_inicio;
        document.getElementById('info_tempo_estimado_duracao').textContent = formatarTempo(dadosProducao.tempo_estimado_duracao * 3600000);
        //document.getElementById('info_tempo_estimado_duracao').textContent = dadosProducao.tempo_estimado_duracao.toFixed(4) + " h";



        // Teste de modulo (função externa)
        //const dataagorateste = Date.now();
        //console.log(dataagorateste);
        // Teste da função 
        //const datahorainicial = new Date('2025-11-03T10:00:00Z');
        //c//onst calculodetempo = calculaIntervalodeTempo(datahorainicial, dadosProducao.hora_inicial2);
        //console.log(calculodetempo);


        // Ativa a contagem
        hora_inicio_producao = new Date();
        duracao = true;

        // Esconde o modal e mostra a dashboard
        modalIniciarProducao.style.display = 'none';
        actionButtonsModal.style.display = 'none';
        dashboardContent.style.display = 'flex';
        actionButtonsDashboard.style.display = 'flex';
    });

    // Lógica dos botões de ação da dashboard
    document.getElementById('btn-trocar-equipe').addEventListener('click', () => {
        alert('Comando start enviado!');

    });

    btnSuspender.addEventListener('click', () => {
        alert('Botão "Suspender Produção" clicado!   btn-suspender ');
        if(pausa == false) {
        modalIniciarProducao.style.display = 'flex';
        actionButtonsModal.style.display = 'none';
        dashboardContent.style.display = 'flex';
        actionButtonsDashboard.style.display = 'flex';
        }
        else {
            pausa = false;
            //modalIniciarProducao.style.display = 'none';
            //actionButtonsModal.style.display = 'none';
            //dashboardContent.style.display = 'flex';
            //actionButtonsDashboard.style.display = 'flex';
            btnSuspender.textContent = "SUSPENDER PRODUÇÃO";
        }



    });

    document.getElementById('btn-terminar').addEventListener('click', () => {
        alert('Botão "Terminar Produção" clicado!');
    });

    // Inicia a aplicação mostrando o modal de configuração
    mostrarModalInicial();




});

/*

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
*/

