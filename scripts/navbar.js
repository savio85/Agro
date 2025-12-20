// navbar.js - Script refatorado para controlar o menu lateral
document.addEventListener('DOMContentLoaded', function() {
    const botaoMenu = document.querySelector('.botao-menu');
    const menuLateral = document.querySelector('.menu-lateral');
    const background = document.querySelector('.background');
    const conteudo = document.querySelector('.conteudo');

    botaoMenu.addEventListener('click', function() {
        menuLateral.classList.toggle('ativo');
        background.classList.toggle('ativo');
        botaoMenu.classList.toggle('ativo');
        conteudo.classList.toggle('ativo');
        document.body.classList.toggle('ativo'); // Novo: Alterna a classe no body
    });

    // Verificações de segurança: Se algum elemento não existir, loga erro e para
    if (!botao || !menuLateral || !conteudo || !background) {
        console.error('Erro: Um ou mais elementos do menu não foram encontrados no DOM. Verifique o HTML e as classes.');
        return;  // Evita execução se houver problema
    }

    // Função para alternar o menu (abre/fecha)
    function toggleMenu() {
        menuLateral.classList.toggle('ativo');
        conteudo.classList.toggle('ativo');
        botao.classList.toggle('ativo');
        background.classList.toggle('ativo');
        
        // Em vez de alterar diretamente o backgroundColor, use uma classe CSS para evitar conflitos
        // Adicione no CSS: .body-ativo { background-color: #34495e; }
        document.body.classList.toggle('body-ativo', menuLateral.classList.contains('ativo'));
        
        console.log('Menu alternado. Estado ativo:', menuLateral.classList.contains('ativo'));  // Log para depuração
    }

    // Evento de clique no botão do menu
    botao.addEventListener('click', toggleMenu);

    // Evento para fechar o menu ao clicar no background
    background.addEventListener('click', () => {
        menuLateral.classList.remove('ativo');
        conteudo.classList.remove('ativo');
        botao.classList.remove('ativo');
        background.classList.remove('ativo');
        document.body.classList.remove('body-ativo');  // Remove a classe para resetar o fundo
        
        console.log('Menu fechado via background.');  // Log para depuração
    });

    console.log('Navbar.js carregado com sucesso.');  // Confirmação de que o script rodou
});