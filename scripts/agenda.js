// Carregar clientes do localStorage
function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    // Adicionar ID único se não existir (usando timestamp para simplicidade)
    clients.forEach((client, index) => {
        if (!client.id) {
            client.id = Date.now() + index; // ID único baseado em timestamp + índice
        }
    });
    localStorage.setItem('clients', JSON.stringify(clients)); // Salvar de volta com IDs
    return clients;
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
    clients.forEach((client) => {
        const option = document.createElement('option');
        option.value = client.id; // Usar ID em vez de índice
        option.textContent = client.nome;
        select.appendChild(option);
    });
}

// Variáveis para paginação
let currentPage = 1;
const itemsPerPage = 5;

// Exibir agendamentos com paginação (filtrando apenas válidos)
function displayAppointments(page = 1) {
    const appointments = loadAppointments();
    const clients = loadClients();
    
    // Filtrar apenas agendamentos cujos clientes ainda existem (comparando nome e telefone normalizados)
    const validAppointments = appointments.filter(appt => {
        const apptTelefoneNormalized = appt.telefone.replace(/\D/g, ''); // Normalizar telefone do agendamento
        return clients.some(client => {
            const clientTelefoneNormalized = client.telefone.replace(/\D/g, ''); // Normalizar telefone do cliente
            return client.nome === appt.clienteNome && clientTelefoneNormalized === apptTelefoneNormalized;
        });
    });
    
    const totalPages = Math.ceil(validAppointments.length / itemsPerPage);
    
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageAppointments = validAppointments.slice(start, end);
    
    const appointmentsDiv = document.getElementById('appointments');
    appointmentsDiv.innerHTML = '';
    
    if (pageAppointments.length === 0) {
        appointmentsDiv.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }
    
    pageAppointments.forEach((appt, index) => {
        const globalIndex = start + index; // Índice global para sendWhatsApp e sendReminder (usando validAppointments)
        const apptDiv = document.createElement('div');
        apptDiv.className = 'appointment-item';
        apptDiv.innerHTML = `
                    <h3>${appt.clienteNome}</h3>
                    <p><strong>Data/Hora:</strong> ${new Date(appt.datahora).toLocaleString('pt-BR')}</p>
                    <p><strong>Telefone:</strong> ${appt.telefone}</p>
                    <button onclick="sendWhatsApp(${globalIndex})">WhatsApp</button>
                    <button onclick="sendReminder(${globalIndex})">Relembrar</button>
                `;
        appointmentsDiv.appendChild(apptDiv);
    });
    
    // Adicionar controles de navegação
    const navDiv = document.createElement('div');
    navDiv.className = 'pagination';
    navDiv.style.marginTop = '20px';
    
    if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.onclick = () => displayAppointments(page - 1);
        navDiv.appendChild(prevButton);
    }
    
    if (page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
        nextButton.onclick = () => displayAppointments(page + 1);
        navDiv.appendChild(nextButton);
    }
    
    appointmentsDiv.appendChild(navDiv);
}

// Evento de submissão do formulário de agenda
document.getElementById('agendaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Limpar mensagens de erro
    document.querySelectorAll('.error').forEach(error => error.style.display = 'none');
    
    const clienteId = document.getElementById('cliente').value;
    const datahora = document.getElementById('datahora').value;
    
    let hasError = false;
    
    if (!clienteId) {
        document.getElementById('clienteError').style.display = 'block';
        hasError = true;
    }
    if (!datahora) {
        document.getElementById('datahoraError').style.display = 'block';
        hasError = true;
    }
    
    if (!hasError) {
        const clients = loadClients();
        const client = clients.find(c => c.id == clienteId);
        if (!client) {
            alert('Erro: Cliente não encontrado.');
            return;
        }
        const appointments = loadAppointments();
        appointments.push({
            clientId: clienteId, // Adicionar ID do cliente (para novos agendamentos)
            clienteNome: client.nome,
            telefone: client.telefone,
            datahora: datahora
        });
        saveAppointments(appointments);
        
        alert('Agendamento realizado com sucesso!');
        document.getElementById('agendaForm').reset();
        displayAppointments(currentPage); // Manter a página atual após adicionar
    }
});

// Função para excluir um cliente e remover agendamentos associados
function deleteClient(clientId) {
    let clients = loadClients();
    const clientToDelete = clients.find(c => c.id == clientId);
    if (!clientToDelete) {
        alert('Erro: Cliente não encontrado.');
        return;
    }
    
    // Remover o cliente
    clients = clients.filter(client => client.id != clientId);
    localStorage.setItem('clients', JSON.stringify(clients));
    
    // Remover agendamentos associados (normalizando telefones para comparação)
    let appointments = loadAppointments();
    const clientTelefoneNormalized = clientToDelete.telefone.replace(/\D/g, '');
    appointments = appointments.filter(appt => {
        const apptTelefoneNormalized = appt.telefone.replace(/\D/g, '');
        return !(appt.clienteNome === clientToDelete.nome && apptTelefoneNormalized === clientTelefoneNormalized);
    });
    saveAppointments(appointments);
    
    // Recarregar a página ou atualizar elementos
    loadClientsForAgenda();
    displayAppointments(currentPage);
    
    alert('Cliente e agendamentos associados excluídos com sucesso!');
}

// Função opcional para limpar todos os agendamentos órfãos (chame manualmente se quiser)
function cleanOrphanedAppointments() {
    const clients = loadClients();
    let appointments = loadAppointments();
    
    appointments = appointments.filter(appt => {
        const apptTelefoneNormalized = appt.telefone.replace(/\D/g, '');
        return clients.some(client => {
            const clientTelefoneNormalized = client.telefone.replace(/\D/g, '');
            return client.nome === appt.clienteNome && clientTelefoneNormalized === apptTelefoneNormalized;
        });
    });
    
    saveAppointments(appointments);
    displayAppointments(currentPage);
    alert('Agendamentos órfãos removidos!');
}

// Função para enviar confirmação por WhatsApp
function sendWhatsApp(index) {
    const appointments = loadAppointments();
    const clients = loadClients();
    
    // Filtrar válidos novamente para garantir consistência
    const validAppointments = appointments.filter(appt => {
        const apptTelefoneNormalized = appt.telefone.replace(/\D/g, '');
        return clients.some(client => {
            const clientTelefoneNormalized = client.telefone.replace(/\D/g, '');
            return client.nome === appt.clienteNome && clientTelefoneNormalized === apptTelefoneNormalized;
        });
    });
    
    if (!validAppointments[index]) {
        alert('Erro: Agendamento não encontrado.');
        return;
    }
    const appt = validAppointments[index];
    const dataHoraFormatada = new Date(appt.datahora).toLocaleString('pt-BR');
    const mensagem = `Olá! Senhor(a) ${appt.clienteNome}.
A Agrotech confirma a sua visita para o dia ${dataHoraFormatada}.

Ficamos à disposição para qualquer dúvida.
Aguardamos você! `;
    const numero = appt.telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (numero.length < 10) {
        alert('Erro: Número de telefone inválido.');
        return;
    }
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função para enviar lembrete por WhatsApp
function sendReminder(index) {
    const appointments = loadAppointments();
    const clients = loadClients();
    
    // Filtrar válidos novamente para garantir consistência
    const validAppointments = appointments.filter(appt => {
        const apptTelefoneNormalized = appt.telefone.replace(/\D/g, '');
        return clients.some(client => {
            const clientTelefoneNormalized = client.telefone.replace(/\D/g, '');
            return client.nome === appt.clienteNome && clientTelefoneNormalized === apptTelefoneNormalized;
        });
    });
    
    if (!validAppointments[index]) {
        alert('Erro: Agendamento não encontrado.');
        return;
    }
    const appt = validAppointments[index];
    const dataHoraFormatada = new Date(appt.datahora).toLocaleString('pt-BR');
    const mensagem = `Olá Senhor(a) ${appt.clienteNome}, gostariamos de lembra-lo de sua visita agendada para ${dataHoraFormatada}.`;
    const numero = appt.telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (numero.length < 10) {
        alert('Erro: Número de telefone inválido.');
        return;
    }
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Inicializar ao carregar a página
window.onload = function () {
    loadClientsForAgenda();
    displayAppointments(currentPage);
};