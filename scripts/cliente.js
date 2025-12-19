// GEORGIA DELIVERYS - Sistema do Cliente

// Produtos de exemplo (depois vem do banco)
const produtos = [
    {
        id: 1,
        nome: "X-Burger Georgia",
        descricao: "Pão brioche, hambúrguer 180g, queijo, bacon crocante",
        preco: 29.90,
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        categoria: "🔥 Mais Pedidos",
        vendidos: 125
    },
    {
        id: 2,
        nome: "Combo Família",
        descricao: "4 hambúrgueres + batata frita + 4 refris",
        preco: 99.90,
        imagem: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w-400&h=300&fit=crop",
        categoria: "🍱 Combos",
        vendidos: 89
    },
    {
        id: 3,
        nome: "Batata Frita Grande",
        descricao: "Porção grande com cheddar e bacon",
        preco: 19.90,
        imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
        categoria: "🥗 Acompanhamentos",
        vendidos: 210
    },
    {
        id: 4,
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante geladinho",
        preco: 12.90,
        imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
        categoria: "🥤 Bebidas",
        vendidos: 156
    },
    {
        id: 5,
        nome: "Brownie com Sorvete",
        descricao: "Brownie quente com sorvete de creme",
        preco: 24.90,
        imagem: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
        categoria: "🍰 Sobremesas",
        vendidos: 78
    },
    {
        id: 6,
        nome: "X-Salada Especial",
        descricao: "Com alface, tomate, maionese caseira",
        preco: 27.90,
        imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433w?w=400&h=300&fit=crop",
        categoria: "🍽️ Principais",
        vendidos: 92
    }
];

// Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho_georgia')) || [];

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Georgia Deliverys - Sistema Iniciado!');
    
    // Mostrar produtos
    mostrarProdutos();
    
    // Atualizar carrinho
    atualizarCarrinho();
    
    // Configurar categorias
    configurarCategorias();
});

// Mostrar produtos na tela
function mostrarProdutos() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    produtos.forEach(produto => {
        const card = `
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${produto.nome}</h3>
                    <p class="product-desc">${produto.descricao}</p>
                    <p class="product-price">R$ ${produto.preco.toFixed(2)}</p>
                    <button class="btn-add-to-cart" onclick="adicionarAoCarrinho(${produto.id})">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    
    // Verificar se já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    // Salvar no navegador
    localStorage.setItem('carrinho_georgia', JSON.stringify(carrinho));
    
    // Atualizar tela
    atualizarCarrinho();
    
    // Animação
    mostrarNotificacao(`✅ ${produto.nome} adicionado!`);
}

// Atualizar carrinho na tela
function atualizarCarrinho() {
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    const totalValor = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    
    // Atualizar sacola fixa
    document.getElementById('cart-count').textContent = 
        `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
    document.getElementById('cart-total').textContent = 
        `R$ ${totalValor.toFixed(2)}`;
    
    // Atualizar modal se estiver aberto
    if (document.getElementById('cart-modal').style.display === 'flex') {
        mostrarItensCarrinho();
    }
}

// Mostrar itens dentro do modal do carrinho
function mostrarItensCarrinho() {
    const container = document.getElementById('cart-items');
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Sua sacola está vazia</p>
                <p>Adicione itens deliciosos!</p>
            </div>
        `;
        document.getElementById('modal-total').textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2)} cada</p>
                </div>
                <div class="item-controls">
                    <button onclick="alterarQuantidade(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantidade">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remover" onclick="removerItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="item-subtotal">
                    R$ ${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('modal-total').textContent = `R$ ${total.toFixed(2)}`;
}

// Funções do carrinho
function alterarQuantidade(id, mudanca) {
    const item = carrinho.find(item => item.id === id);
    
    if (item) {
        item.quantidade += mudanca;
        
        if (item.quantidade < 1) {
            removerItem(id);
        } else {
            localStorage.setItem('carrinho_georgia', JSON.stringify(carrinho));
            atualizarCarrinho();
        }
    }
}

function removerItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinho_georgia', JSON.stringify(carrinho));
    atualizarCarrinho();
    mostrarNotificacao('Item removido do carrinho');
}

// Configurar categorias
function configurarCategorias() {
    const botoes = document.querySelectorAll('.category');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover ativo de todos
            botoes.forEach(b => b.classList.remove('active'));
            // Adicionar ativo no clicado
            this.classList.add('active');
            
            // Filtrar produtos (simplificado)
            const categoria = this.textContent;
            console.log(`Categoria selecionada: ${categoria}`);
        });
    });
}

// Notificação simples
function mostrarNotificacao(mensagem) {
    // Criar notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #8B5CF6, #EC4899);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    notificacao.innerHTML = `
        <i class="fas fa-check-circle"></i> ${mensagem}
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover depois de 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Adicionar animação CSS para notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .item-controls button {
        background: #f0f0f0;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
    }
    
    .remover {
        color: #ff4444;
    }
    
    .item-subtotal {
        font-weight: bold;
        color: #8B5CF6;
    }
    
    .quantidade {
        font-weight: bold;
        min-width: 30px;
        text-align: center;
    }
`;
document.head.appendChild(style);
