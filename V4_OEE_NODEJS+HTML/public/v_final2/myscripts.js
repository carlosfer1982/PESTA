// ficheiro: myscripts.js



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