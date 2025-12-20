document.addEventListener('DOMContentLoaded', function() {
    const pesquisaInput = document.getElementById('pesquisa');
    const botaoPesquisar = document.getElementById('botaoPesquisar');
    const listaClientes = document.getElementById('listaClientes');
    const paginacaoContainer = document.getElementById('paginacao');

    // Variáveis para paginação
    const itensPorPagina = 10;  // 10 clientes por página
    let paginaAtual = 1;  // Página inicial
    let clientesAtuais = [];  // Lista atual (todos ou filtrados)

    // Função para carregar clientes do localStorage (chave 'clients')
    function carregarClientes() {
        const clientes = JSON.parse(localStorage.getItem('clients')) || [];
        return clientes;
    }

    // Função para salvar clientes no localStorage (usada após exclusão)
    function salvarClientes(clientes) {
        localStorage.setItem('clients', JSON.stringify(clientes));
    }

    // Função para exibir clientes de uma página específica
    function exibirClientes(clientes, pagina = 1) {
        clientesAtuais = clientes;  // Atualiza a lista atual
        paginaAtual = pagina;  // Atualiza a página atual

        const inicio = (pagina - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const clientesDaPagina = clientes.slice(inicio, fim);  // Pega apenas os da página

        listaClientes.innerHTML = '';  // Limpa a lista
        if (clientesDaPagina.length === 0) {
            listaClientes.innerHTML = '<p>Nenhum cliente encontrado.</p>';
            paginacaoContainer.innerHTML = '';  // Limpa paginação se vazio
            return;
        }

        clientesDaPagina.forEach((cliente, indexGlobal) => {  // indexGlobal para exclusão
            const clienteDiv = document.createElement('div');
            clienteDiv.className = 'cliente-item';

            const nomeDiv = document.createElement('div');
            nomeDiv.className = 'cliente-nome';
            nomeDiv.textContent = cliente.nome;

            const detalhesDiv = document.createElement('div');
            detalhesDiv.className = 'cliente-detalhes';
            detalhesDiv.innerHTML = `
                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                <p><strong>Endereço:</strong> ${cliente.endereco}</p>
                <button class="botao-excluir" data-index="${inicio + indexGlobal}">Excluir</button>
            `;

            // Event listener para o botão de exclusão
            const botaoExcluir = detalhesDiv.querySelector('.botao-excluir');
            botaoExcluir.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`Tem certeza que deseja excluir o cliente "${clientes[index].nome}"?`)) {
                    clientes.splice(index, 1);  // Remove da lista original
                    salvarClientes(clientes);  // Salva
                    // Recarrega a página atual (ou volta para 1 se a página ficar vazia)
                    const totalPaginas = Math.ceil(clientes.length / itensPorPagina);
                    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas || 1;
                    exibirClientes(clientes, paginaAtual);
                    renderizarPaginacao(clientes);  // Atualiza controles
                }
            });

            clienteDiv.appendChild(nomeDiv);
            clienteDiv.appendChild(detalhesDiv);

            // Evento de clique no nome para mostrar/ocultar detalhes
            nomeDiv.addEventListener('click', function() {
                detalhesDiv.classList.toggle('show');
            });

            listaClientes.appendChild(clienteDiv);
        });

        // Renderiza os controles de paginação
        renderizarPaginacao(clientes);
    }

    // Função para renderizar controles de paginação
    function renderizarPaginacao(clientes) {
        paginacaoContainer.innerHTML = '';  // Limpa
        const totalPaginas = Math.ceil(clientes.length / itensPorPagina);
        if (totalPaginas <= 1) return;  // Não mostra se só 1 página

        for (let i = 1; i <= totalPaginas; i++) {
            const botaoPagina = document.createElement('button');
            botaoPagina.textContent = i;
            botaoPagina.className = (i === paginaAtual) ? 'active' : '';
            botaoPagina.addEventListener('click', function() {
                exibirClientes(clientes, i);
            });
            paginacaoContainer.appendChild(botaoPagina);
        }
    }

    // Carregar todos os clientes e exibir a primeira página
    let clientes = carregarClientes();
    exibirClientes(clientes, 1);  // Página 1 inicialmente

    // Evento do botão para pesquisar (filtra e reseta para página 1)
    botaoPesquisar.addEventListener('click', function() {
        const termo = pesquisaInput.value.toLowerCase().trim();
        let clientesFiltrados;
        if (termo === '') {
            clientesFiltrados = clientes;  // Mostra todos
        } else {
            clientesFiltrados = clientes.filter(cliente =>
                cliente.nome.toLowerCase().includes(termo)
            );
        }
        exibirClientes(clientesFiltrados, 1);  // Sempre começa na página 1 após pesquisa
    });
});