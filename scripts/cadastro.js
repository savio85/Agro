 // Carregar clientes do localStorage
        function loadClients() {
            return JSON.parse(localStorage.getItem('clients')) || [];
        }

        // Salvar clientes no localStorage
        function saveClients(clients) {
            localStorage.setItem('clients', JSON.stringify(clients));
        }

        document.getElementById('cadastroForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Limpar mensagens de erro
            const errors = document.querySelectorAll('.error');
            errors.forEach(error => error.style.display = 'none');

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const endereco = document.getElementById('endereco').value.trim();

            let hasError = false;

            if (!nome) {
                document.getElementById('nomeError').style.display = 'block';
                hasError = true;
            }
            if (!email) {
                document.getElementById('emailError').style.display = 'block';
                hasError = true;
            }
            if (!telefone) {
                document.getElementById('telefoneError').style.display = 'block';
                hasError = true;
            }
            if (!endereco) {
                document.getElementById('enderecoError').style.display = 'block';
                hasError = true;
            }

            if (!hasError) {
                const clients = loadClients();
                clients.push({ nome, email, telefone, endereco });
                saveClients(clients);

                alert('Cadastro realizado com sucesso!');
                document.getElementById('cadastroForm').reset();
            }
        });