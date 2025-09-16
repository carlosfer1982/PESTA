mongoose = require('mongoose');

const modelo_dados_producao_str = new mongoose.Schema(
    {
        "of": String,
        "total": Number,
        "entrada": Number,
        "saida": Number,
        "producao": Number,
        "desperdicio": Number,
        "ativo": Number,
        "Maquina_em_Producao": Number,
        "Maquina_em_erro": Number,
        "Maquina_em_normal": Number,
        "Maquina_ligada": Number,
        "timestamp": { type: Date, default: Date.now },

    }
);

const modelo_dados_producao = mongoose.model('modelo_dados_producao_str', ProductSchema);

module.exports = modelo_dados_producao;