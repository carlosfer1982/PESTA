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


export class paragem {
  constructor() {
    this.id = null;
    this.horaInicio = null;
    this.tipoParagem = null;
    this.duracao = null;
    this.horaFim = null;
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