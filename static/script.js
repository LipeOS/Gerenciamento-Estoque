document.addEventListener('DOMContentLoaded', function() {
    fetch('/produtos')
        .then(response => response.json())
        .then(produtos => {
            const produtosList = document.getElementById('produtos-list');
            produtosList.innerHTML = ''; // Clear the list before appending
            produtos.forEach(produto => {
                const produtoDiv = document.createElement('div');
                produtoDiv.className = 'produto';
                produtoDiv.innerHTML = `
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <p>Quantidade: ${produto.quantidade}</p>
                    <p>Preço: R$ <span class="preco">${produto.preco}</span></p>
                    <p>Fornecedor: ${produto.fornecedor}</p>
                    <button onclick="deleteProduto(${produto.id})">Excluir</button>
                    <button onclick="venderProduto(${produto.id})">Vender</button>
                    <button onclick="editarPreco(${produto.id})">Editar Preço</button>
                    <button onclick="editarQuantidade(${produto.id})">Editar Quantidade</button>
                `;
                produtosList.appendChild(produtoDiv);
            });
        })
        .catch(error => console.error('Erro:', error));

    document.getElementById('add-produto-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            preco: parseFloat(document.getElementById('preco').value),
            fornecedor: document.getElementById('fornecedor').value
        };

        fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.className = 'produto';
            produtoDiv.innerHTML = `
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Preço: R$ <span class="preco">${produto.preco}</span></p>
                <p>Fornecedor: ${produto.fornecedor}</p>
                <button onclick="deleteProduto(${produto.id})">Excluir</button>
                <button onclick="venderProduto(${produto.id})">Vender</button>
                <button onclick="editarPreco(${produto.id})">Editar Preço</button>
                <button onclick="editarQuantidade(${produto.id})">Editar Quantidade</button>
            `;
            document.getElementById('produtos-list').appendChild(produtoDiv);
        })
        .catch(error => console.error('Erro:', error));
    });
});

function editarQuantidade(produtoId) {
    const novaQuantidade = prompt("Digite a nova quantidade:");

    if (isNaN(novaQuantidade) || novaQuantidade < 0) {
        alert("Por favor, insira uma quantidade válida.");
        return;
    }

    fetch(`/produtos/${produtoId}/quantidade`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantidade: parseInt(novaQuantidade) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Quantidade atualizada com sucesso!');
            const produtoDiv = document.querySelector(`button[onclick="editarQuantidade(${produtoId})"]`).parentElement;
            const quantidadeP = produtoDiv.querySelector('p:nth-child(3)');
            quantidadeP.innerHTML = `Quantidade: ${novaQuantidade}`;
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Erro:', error));
}

function searchProdutos() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    const produtosList = document.getElementById('produtos-list');
    produtosList.innerHTML = ''; // Clear the list before appending

    fetch('/produtos')
        .then(response => response.json())
        .then(produtos => {
            produtos.forEach(produto => {
                if (produto.nome.toLowerCase().includes(searchInput) || produto.descricao.toLowerCase().includes(searchInput)) {
                    const produtoDiv = document.createElement('div');
                    produtoDiv.className = 'produto';
                    produtoDiv.innerHTML = `
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <p>Quantidade: ${produto.quantidade}</p>
                        <p>Preço: R$ <span class="preco">${produto.preco}</span></p>
                        <p>Fornecedor: ${produto.fornecedor}</p>
                        <button onclick="deleteProduto(${produto.id})">Excluir</button>
                        <button onclick="venderProduto(${produto.id})">Vender</button>
                        <button onclick="editarPreco(${produto.id})">Editar Preço</button>
                        <button onclick="editarQuantidade(${produto.id})">Editar Quantidade</button>
                    `;
                    produtosList.appendChild(produtoDiv);
                }
            });
        })
        .catch(error => console.error('Erro:', error));
}

function deleteProduto(produtoId) {
    fetch(`/produtos/${produtoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Produto excluído com sucesso!');
            const produtoDiv = document.querySelector(`button[onclick="deleteProduto(${produtoId})"]`).parentElement;
            produtoDiv.remove();
        } else {
            throw new Error('Erro ao excluir o produto');
        }
    })
    .catch(error => console.error('Erro:', error));
}

function venderProduto(produtoId) {
    const quantidadeVenda = prompt("Digite a quantidade a ser vendida:");

    if (isNaN(quantidadeVenda) || quantidadeVenda <= 0) {
        alert("Por favor, insira uma quantidade válida.");
        return;
    }

    fetch('/venda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: produtoId, quantidade: parseInt(quantidadeVenda) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Produto vendido com sucesso!');
            const produtoDiv = document.querySelector(`button[onclick="venderProduto(${produtoId})"]`).parentElement;
            const quantidadeP = produtoDiv.querySelector('p:nth-child(3)');
            quantidadeP.innerHTML = `Quantidade: ${data.nova_quantidade}`;
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Erro:', error));
}

function editarPreco(produtoId) {
    const novoPreco = prompt("Digite o novo preço:");

    if (isNaN(novoPreco) || novoPreco <= 0) {
        alert("Por favor, insira um preço válido.");
        return;
    }

    fetch(`/produtos/${produtoId}/preco`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preco: parseFloat(novoPreco) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Preço atualizado com sucesso!');
            const produtoDiv = document.querySelector(`button[onclick="editarPreco(${produtoId})"]`).parentElement;
            const precoSpan = produtoDiv.querySelector('.preco');
            precoSpan.innerHTML = novoPreco;
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Erro:', error));
}
