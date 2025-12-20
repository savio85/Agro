 // Carregar clientes do localStorage
        function loadClients() {
            return JSON.parse(localStorage.getItem('clients')) || [];
        }

        // Carregar agendamentos do localStorage
        function loadAppointments() {
            return JSON.parse(localStorage.getItem('appointments')) || [];
        }

        // Salvar agendamentos no localStorage
        function saveAppointments(appointments) {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }

        // Carregar clientes no dropdown da agenda
        function loadClientsForAgenda() {
            const clients = loadClients();
            const select = document.getElementById('cliente');
            select.innerHTML = '<option value="">Escolha um cliente</option>';
            if (clients.length === 0) {
                select.innerHTML += '<option value="" disabled>Nenhum cliente cadastrado</option>';
                return;
            }
            clients.forEach((client, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = client.nome;
                select.appendChild(option);
            });
        }

        // Exibir agendamentos
        function displayAppointments() {
            const appointments = loadAppointments();
            const appointmentsDiv = document.getElementById('appointments');
            appointmentsDiv.innerHTML = '';

            if (appointments.length === 0) {
                appointmentsDiv.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
                return;
            }

            appointments.forEach((appt, index) => {
                const apptDiv = document.createElement('div');
                apptDiv.className = 'appointment-item';
                apptDiv.innerHTML = `
                    <h3>${appt.clienteNome}</h3>
                    <p><strong>Data/Hora:</strong> ${new Date(appt.datahora).toLocaleString('pt-BR')}</p>
                    <p><strong>Telefone:</strong> ${appt.telefone}</p>
                    <button onclick="sendWhatsApp(${index})">Enviar Confirmação por WhatsApp</button>
                `;
                appointmentsDiv.appendChild(apptDiv);
            });
        }

        // Evento de submissão do formulário de agenda
        document.getElementById('agendaForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Limpar mensagens de erro
            document.querySelectorAll('.error').forEach(error => error.style.display = 'none');

            const clienteIndex = document.getElementById('cliente').value;
            const datahora = document.getElementById('datahora').value;

            let hasError = false;

            if (!clienteIndex) {
                document.getElementById('clienteError').style.display = 'block';
                hasError = true;
            }
            if (!datahora) {
                document.getElementById('datahoraError').style.display = 'block';
                hasError = true;
            }

            if (!hasError) {
                const clients = loadClients();
                if (clients.length === 0 || !clients[clienteIndex]) {
                    alert('Erro: Cliente não encontrado.');
                    return;
                }
                const client = clients[clienteIndex];
                const appointments = loadAppointments();
                appointments.push({
                    clienteNome: client.nome,
                    telefone: client.telefone,
                    datahora: datahora
                });
                saveAppointments(appointments);

                alert('Agendamento realizado com sucesso!');
                document.getElementById('agendaForm').reset();
                displayAppointments();
            }
        });

        // Função para enviar confirmação por WhatsApp
        function sendWhatsApp(index) {
            const appointments = loadAppointments();
            if (!appointments[index]) {
                alert('Erro: Agendamento não encontrado.');
                return;
            }
            const appt = appointments[index];
            const dataHoraFormatada = new Date(appt.datahora).toLocaleString('pt-BR');
            const mensagem = `Agendamento de visita concluído. Data e hora: ${dataHoraFormatada}`;
            const numero = appt.telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
            if (numero.length < 10) {
                alert('Erro: Número de telefone inválido.');
                return;
            }
            const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        }

        // Inicializar ao carregar a página
        window.onload = function() {
            loadClientsForAgenda();
            displayAppointments();
        };