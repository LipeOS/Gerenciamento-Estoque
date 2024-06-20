# Sistema de Gerenciamento de Estoque

Este é um guia simples para configurar e executar o Sistema de Gerenciamento de Estoque.

## Passos para Configuração e Execução

### Estrutura do Projeto

- `app.py`: Script principal do sistema.
- `templates/index.html`: Página principal do sistema.
- `static/styles.css`: Estilos CSS para a página.
- `static/script.js`: Script JavaScript para interações.

### Configuração Inicial

1. Crie um ambiente virtual Python e ative.
venv\Scripts\activate

2. Para fechar o ambiente use:
deactivate



3. Instale as dependências necessárias.
  pip install Flask
  pip install mysql-connector-python

4. Para iniciar o projeto use esse comando no terminal do projeto:
  python app.py


### Banco de Dados

- Instale o MySQL.
- Crie um banco de dados chamado "estoque".
- Crie uma tabela "produtos" com os campos necessários.

## Configuração da tabela produtos

CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `quantidade` int NOT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `fornecedor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


### Execução do Sistema

1. Inicie o servidor Flask executando `app.py`.
2. Acesse o sistema no navegador pelo endereço `http://localhost:5000`.

