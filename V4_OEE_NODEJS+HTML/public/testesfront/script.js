let modal = document.getElementById('minha-modal');
let abrirmodal = document.getElementById('abrir-modal');
let fecharmodal = document.getElementById('fechar-modal');
modal.close();

abrirmodal.addEventListener('click',() => {
modal.showModal();
});

fecharmodal.addEventListener('click', () => {
modal.close();
});