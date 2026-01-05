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


// Dados de Paragens
export class paragem {
  constructor() {
    this.id = null;
    this.horaInicio = null;
    this.tipoParagem = null;
    this.duracao = null;
    this.horaFim = null;
    this.observacao = null;
    //this.completa = false;
  }
   
  setid (id) {
    this.id = id;
  }
  
  setHoraInicio(horaInicio) {
    this.horaInicio = horaInicio;
  }

  setTipoParagem(tipoParagem) {
    this.tipoParagem = tipoParagem;
  }
  setduracao(duracao) {
    this.duracao = duracao;
  }
    sethoraFim(horaFim) {
    this.horaFim = horaFim;
  }


  /*
  setCaudal(caudal) {
    this.caudal = caudal;
    this._checkCompleta();
  }
*/
/*  _checkCompleta() {
    this.completa =
      this.tensao !== null &&
      this.corrente !== null &&
      this.caudal !== null;
  }
*/

}


// Dados de Fabrico
export class dadosFabrico {
  constructor() {
    this.equipamento = null;
    this.ordemFabrico = null;
    this.totalaProduzir = null;
    this.cadenciaTeorica = null;
    this.tempoEstimadoPreparacao = null;
    this.tempoEstimadoProducao = null;
    this.tempoEstimadoTotal = null;
    this.estado = null;
    this.equipa = null;
  }
}

// Dados de Preparação / Produção
export class dadosPreparacaoProducao {
  constructor() {
    this.horaInicio = null;
    this.tempoEstimado = null;
    this.duracao = null;
    this.tempodeParagemPlaneada = null;
    this.tempodeParagemNaoPlaneada = null;
    this.horaFim = null;
  }
}

// Dados de OEE
export class dadosOEE {
  constructor() {
    this.disponibilidade = null;
    this.desempenho = null;
    this.qualidade = null;
    this.oee = null;
  }
}

// Dados de KPI
export class dadosKPI {
  constructor() {
    this.cadenciaReal = null;
    this.cadenciaTeorica = null;
    this.producaoReal = null;
    this.producaoTeorica = null;
    this.desperdicio = null;
    this.duracaoReal = null;
    this.duracaoTeorica = null;
  }
}

