// Carregar clientes do localStorage
function loadClients() {
    return JSON.parse(localStorage.getItem('clients')) || [];
}

// Salvar clientes no localStorage
function saveClients(clients) {
    localStorage.setItem('clients', JSON.stringify(clients));
}

// Nova função: Formatar telefone como (XX) XXXXX-XXXX
function formatarTelefone(value) {
    value = value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value.length <= 2) {
        return value; // Apenas DDD
    } else if (value.length <= 7) {
        return `(${value.slice(0, 2)}) ${value.slice(2)}`; // (XX) XXXXX
    } else {
        return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`; // (XX) XXXXX-XXXX
    }
}

document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpar mensagens de erro (incluindo a nova de duplicata)
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.style.display = 'none');

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    let telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();

    // Limpar telefone para validação (remover formatação)
    const telefoneLimpo = telefone.replace(/\D/g, '');

    let hasError = false;

    // Validações básicas (campos obrigatórios)
    if (!nome) {
        document.getElementById('nomeError').style.display = 'block';
        hasError = true;
    }
    if (!email) {
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }
    if (!telefoneLimpo || telefoneLimpo.length < 10) {  // Agora verifica se tem pelo menos 10 dígitos (sem formatação)
        document.getElementById('telefoneError').style.display = 'block';
        hasError = true;
    }
    if (!endereco) {
        document.getElementById('enderecoError').style.display = 'block';
        hasError = true;
    }

    // Nova validação: Verificar duplicatas (usando telefone limpo para comparação)
    if (!hasError) {
        const clients = loadClients();
        const duplicataNomeEmail = clients.some(cliente => 
            cliente.nome.toLowerCase() === nome.toLowerCase() && cliente.email.toLowerCase() === email.toLowerCase()
        );
        const duplicataTelefone = clients.some(cliente => 
            cliente.telefone.replace(/\D/g, '') === telefoneLimpo  // Compara sem formatação
        );

        if (duplicataNomeEmail || duplicataTelefone) {
            document.getElementById('duplicataError').style.display = 'block';
            hasError = true;  // Impede o salvamento
        }
    }

    // Só salva se não houver erros (salva o telefone formatado)
    if (!hasError) {
        const clients = loadClients();
        clients.push({ nome, email, telefone, endereco });  // Salva com formatação
        saveClients(clients);

        alert('Cadastro realizado com sucesso!');
        document.getElementById('cadastroForm').reset();
    }
});

// Event listener para formatar telefone em tempo real
document.getElementById('telefone').addEventListener('input', function(event) {
    this.value = formatarTelefone(this.value);
});