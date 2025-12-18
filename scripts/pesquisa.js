const clients = [
        ];

        // Função para pesquisar e exibir resultados
        function searchClients() {
            const query = document.getElementById('search').value.toLowerCase();
            const resultsList = document.getElementById('results');
            resultsList.innerHTML = ''; // Limpa resultados anteriores

            // Filtra clientes com base na consulta (nome, email ou cidade)
            const filteredClients = clients.filter(client =>
                client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query) ||
                client.city.toLowerCase().includes(query)
            );

            // Exibe resultados
            if (filteredClients.length > 0) {
                filteredClients.forEach(client => {
                    const li = document.createElement('li');
                    li.className = 'client';
                    li.innerHTML = `
                        <h3>${client.name}</h3>
                        <p><strong>Email:</strong> ${client.email}</p>
                        <p><strong>Telefone:</strong> ${client.phone}</p>
                        <p><strong>Cidade:</strong> ${client.city}</p>
                    `;
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = '<li class="no-results">Nenhum cliente encontrado.</li>';
            }
        }

        // Carrega todos os clientes inicialmente
        searchClients();