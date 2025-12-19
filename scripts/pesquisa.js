 function loadClients() {
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            return clients;
        }

        // Função de busca
        function searchClients() {
            const query = document.getElementById('search').value.trim().toLowerCase();
            const clients = loadClients();
            const resultsDiv = document.getElementById('results');

            resultsDiv.innerHTML = ''; // Limpar resultados anteriores

            if (!query) {
                resultsDiv.innerHTML = '<p>Digite algo para buscar.</p>';
                return;
            }

            const filteredClients = clients.filter(client =>
                client.nome.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query)
            );

            if (filteredClients.length === 0) {
                resultsDiv.innerHTML = '<p>Nenhum cliente encontrado.</p>';
            } else {
                filteredClients.forEach(client => {
                    const clientDiv = document.createElement('div');
                    clientDiv.className = 'client-item';
                    clientDiv.innerHTML = `
                        <h3>${client.nome}</h3>
                        <p><strong>Email:</strong> ${client.email}</p>
                        <p><strong>Telefone:</strong> ${client.telefone}</p>
                        <p><strong>Endereço:</strong> ${client.endereco}</p>
                    `;
                    resultsDiv.appendChild(clientDiv);
                });
            }
        }

        document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchClients();
    }
});