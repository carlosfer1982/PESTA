// Ficheiro classe dados - dados.js
// Classe para armazenar os dados do processo de produção
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


export function teste() {
    console.log("Teste da função exportada do dadosproducao.js");
}
