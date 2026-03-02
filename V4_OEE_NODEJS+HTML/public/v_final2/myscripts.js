// ficheiro: myscripts.js
export class DadosProducao {
    constructor() {
        this.horaInicioPreparacao = null;
        this.tempoEstimadoPreparacao = null;
        this.duracaoPreparacao = null;
        this.tempoParagemPreparacao = null;
        this.horaFimPreparacao = null;
        this.horaInicioProducao = null;
        this.tempoEstimadoProducao = null;
        this.duracaoProducao = null;
        this.tempoParagemProducao = null;
        this.horaFimProducao = null;
    }
}

export class DadosMicrocontrolador {
    constructor() {
        this.of = null;
        this.setq = null;
        this.cmd = null;
    }
}





// Função para formatar o tempo em milissegundos para HH:MM:SS
export function formatarTempo(ms) {
    const totalSegundos = Math.floor(ms / 1000);
    const segundos = totalSegundos % 60;
    const minutos = Math.floor(totalSegundos / 60) % 60;
    const horas = Math.floor(totalSegundos / (60 * 60));

    // Retorna a string formatada
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

export function calculaIntervalodeTempo(horaInicial, horaFinal) {
    const intervalodeTempo = horaFinal - horaInicial;
    return intervalodeTempo;
}

// Função para retornar a data e hora atual
export function formatarDataHora(dataHora) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dataHoraFormatada = agora.toLocaleDateString('pt-PT', options).replace(',', '');
    return dataHoraFormatada;
}

export function atualizarDuracao(hora_inicio) {
    const hora_atual = new Date();
    const calculodetempo = hora_atual - hora_inicio;
    return calculodetempo;
    
}


// Função para atualizar a data e hora no cabeçalho
    export function atualizarDataHora() {
        const elementoDataHora = document.querySelector('.data-hora');
        const agora = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dataHoraFormatada = agora.toLocaleDateString('pt-PT', options).replace(',', '');
        elementoDataHora.textContent = dataHoraFormatada;
    }



// Função para enviar dados para a Base de Dados
/*export async function gravar() {
  const url = '/api/db/producao'; // URL da rota no servidor para gravar os dados
  */
export async function db_EnviarDados(payload) {
    
        fetch('/api/db/producao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log("Os dados foram enviados");
}



// Função para enviar dados para o microcontrolador

export async function uC_EnviarDados(payload) {
    
    fetch('/api/micro/cmd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log("Os dados foram enviados para o microcontrolador");
}

// Função para receber dados do microcontrolador
export async function uC_ReceberDados() {

    const url = '/api/micro/data';  // URL da rota no servidor que fornece os dados do microcontrolador

    try {
        console.log("A solicitar dados ao servidor...");

        // 1. O 'await' pausa a execução aqui até que o servidor responda.
        // O browser não "tranca", apenas esta função fica a aguardar.
        const resposta = await fetch(url);

        // 2. Verificamos se o servidor respondeu com sucesso (status 200-299)
        if (!resposta.ok) {
            // Se o servidor deu erro (ex: 404 ou 500), lançamos um erro para o 'catch'
            throw new Error(`Erro no servidor: ${resposta.status}`);
        }

        // 3. O corpo da resposta também precisa de ser "aguardado" para converter em JSON
        const receitas = await resposta.json();
        if (!receitas || receitas.length === 0) {
            console.warn("Servidor respondeu, mas não há dados de receitas disponíveis.");
            return null; // Sai da função se não houver dados
        }   
        else
        {
            //console.log(receitas);
            //console.log('Função:', receitas);
            return receitas;
        }
        /*
        // 4. Verifica se está a receber dados do microcontrolador 
        //if (receitas.of !== "SEM_OF") { // Verifica se a propriedade 'of' existe no objeto recebido. 
        //    console.log(`Receita OF: ${receitas.of}`);
        //} else {
            // Caso não possui Ordem de Fabrico do uControlador, permite criar um novo registo.
        //    console.warn("A resposta do servidor não contém a propriedade 'of'.");
        //}
        */
        
        // Exemplo: preencher dropdown de embalagens
        // popularDropdownEmbalagem(receitas);

    } catch (erro) {
        // Se a internet falhar, ou o servidor estiver desligado, o código vem para aqui
        console.error("Erro crítico na comunicação:", erro.message);
        return null;
        // Aqui podias mostrar um aviso visual ao operador no computador da fábrica
        // mostrarAvisoErro("Não foi possível ligar ao servidor de receitas.");
    }
}





// Função para registar na base de dados os dados recebidos do microcontrolador
