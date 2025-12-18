document.getElementById('cadastroForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Limpar mensagens de erro anteriores
            const errors = document.querySelectorAll('.error');
            errors.forEach(error => error.style.display = 'none');

            // Obter valores dos campos
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const endereco = document.getElementById('endereco').value.trim();

            let hasError = false;

            // Verificar cada campo
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
                // Simulação de envio (pode ser substituído por uma requisição AJAX)
                alert('Cadastro realizado com sucesso!\nNome: ' + nome + '\nEmail: ' + email + '\nTelefone: ' + telefone + '\nEndereço: ' + endereco);

                // Limpar formulário
                document.getElementById('cadastroForm').reset();
            }
        });