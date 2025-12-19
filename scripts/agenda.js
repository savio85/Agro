        function loadClients() {
            return JSON.parse(localStorage.getItem('clients')) || [];
        }

        // Carregar agendamentos do localStorage
        function loadAgendamentos() {
            return JSON.parse(localStorage.getItem('agendamentos')) || [];
        }

        // Salvar agendamentos no localStorage
        function saveAgendamentos(agendamentos) {
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        }

        // Preencher o select com clientes cadastrados
        function populateClientes() {
            const clients = loadClients();
            const select = document.getElementById('cliente');
            select.innerHTML = '<option value="">Selecione um cliente</option>';
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.email; // Usar email como identificador único
                option.textContent = client.nome;
                select.appendChild(option);
            });
        }

        // Exibir agendamentos
        function displayAgendamentos() {
            const agendamentos = loadAgendamentos();
            const clients = loadClients();
            const container = document.getElementById('agendamentos');
            container.innerHTML = '';

            if (agendamentos.length === 0) {
                container.innerHTML = '<p>Nenhum agendamento realizado.</p>';
                return;
            }

            agendamentos.forEach(agendamento => {
                const client = clients.find(c => c.email === agendamento.clienteEmail);
                if (client) {
                    const item = document.createElement('div');
                    item.className = 'agendamento-item';
                    item.innerHTML = `
                        <h3>${client.nome}</h3>
                        <p><strong>Email:</strong> ${client.email}</p>
                        <p><strong>Telefone:</strong> ${client.telefone}</p>
                        <p><strong>Endereço:</strong> ${client.endereco}</p>
                        <p><strong>Data:</strong> ${agendamento.data}</p>
                        <p><strong>Hora:</strong> ${agendamento.hora}</p>
                    `;
                    container.appendChild(item);
                }
            });
        }

        // Evento de submissão do formulário
        document.getElementById('agendamentoForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Limpar mensagens de erro
            const errors = document.querySelectorAll('.error');
            errors.forEach(error => error.style.display = 'none');

            const clienteEmail = document.getElementById('cliente').value;
            const data = document.getElementById('data').value;
            const hora = document.getElementById('hora').value;

            let hasError = false;

            if (!clienteEmail) {
                document.getElementById('clienteError').style.display = 'block';
                hasError = true;
            }
            if (!data) {
                document.getElementById('dataError').style.display = 'block';
                hasError = true;
            }
            if (!hora) {
                document.getElementById('horaError').style.display = 'block';
                hasError = true;
            }

            if (!hasError) {
                const agendamentos = loadAgendamentos();
                agendamentos.push({ clienteEmail, data, hora });
                saveAgendamentos(agendamentos);

                alert('Agendamento realizado com sucesso!');
                document.getElementById('agendamentoForm').reset();
                displayAgendamentos(); // Atualizar lista
            }
        });

        // Inicializar página
        populateClientes();
        displayAgendamentos();

        const formFields = ['cliente', 'data', 'hora'];
formFields.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Impede comportamento padrão
            document.getElementById('agendamentoForm').dispatchEvent(new Event('submit')); // Simula submissão
        }
    });
});