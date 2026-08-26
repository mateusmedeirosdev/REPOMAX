// ===== Menu de categorias =====
const dropdown = document.querySelector('.dropdown');
const categorias = document.querySelector('.categorias');
let hideTimeout;

if (dropdown && categorias) {
    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        categorias.classList.add('show');
    });
    dropdown.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => categorias.classList.remove('show'), 200);
    });
    categorias.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    categorias.addEventListener('mouseleave', () => categorias.classList.remove('show'));
}

// ===== Carrossel do Hero =====
let currentSlide = 0;
const heroSlides = document.querySelectorAll('.hero .slide');
const heroCarrossel = document.querySelector('.hero .carrossel');
const totalHeroSlides = heroSlides.length;
let autoplayHero;

function irParaSlideHero(index) {
    if (!heroCarrossel || !totalHeroSlides) return;
    currentSlide = index;
    heroCarrossel.style.transform = `translateX(-${index * 100}%)`;
}

function mudarSlideHero(direcao) {
    if (!totalHeroSlides) return;
    currentSlide = (currentSlide + direcao + totalHeroSlides) % totalHeroSlides;
    irParaSlideHero(currentSlide);
    clearInterval(autoplayHero);
    iniciarAutoplayHero();
}

function iniciarAutoplayHero() {
    autoplayHero = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalHeroSlides;
        irParaSlideHero(currentSlide);
    }, 10000);
}

if (totalHeroSlides) iniciarAutoplayHero();

// ===== Carrossel de lançamentos =====
const containerLancamentos = document.querySelector('.carrossel-container');
const itensVisiveis = 4;

function moverCarrossel(direcao) {
    if (!containerLancamentos) return;
    const primeiroItem = containerLancamentos.querySelector('.item-lancamento');
    if (!primeiroItem) return;

    const estiloContainer = window.getComputedStyle(containerLancamentos);
    const gap = parseFloat(estiloContainer.columnGap || estiloContainer.gap || '0');
    const scrollStep = (primeiroItem.offsetWidth + gap) * itensVisiveis;
    const maxScrollLeft = containerLancamentos.scrollWidth - containerLancamentos.clientWidth;

    if (direcao > 0 && containerLancamentos.scrollLeft >= maxScrollLeft - 10) {
        containerLancamentos.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direcao < 0 && containerLancamentos.scrollLeft <= 10) {
        containerLancamentos.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
        containerLancamentos.scrollBy({ left: direcao * scrollStep, behavior: 'smooth' });
    }
}

if (containerLancamentos) setInterval(() => moverCarrossel(1), 5000);

// ===== Catálogo de produtos carregado de produtos.json =====
const produtosGrid = document.getElementById('produtos-grid');
const filtroBotoes = document.querySelectorAll('.filtro-btn');
const produtosVazio = document.getElementById('produtos-vazio');
const produtosStatus = document.getElementById('produtos-status');
const campoBusca = document.getElementById('campo-busca');
const botaoBusca = document.querySelector('.botao-busca');
const botaoCarregarMais = document.getElementById('botao-carregar-mais');
const tamanhoLote = 10;
const categoriasValidas = ['todos', 'vans', 'pickups', 'linha-leve'];
const nomesCategorias = { vans: 'Vans', pickups: 'Pick-ups', 'linha-leve': 'Linha Leve' };
let produtos = [];
let categoriaAtiva = 'todos';
let quantidadeVisivel = tamanhoLote;

function normalizarTexto(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function obterProdutosFiltrados() {
    const busca = normalizarTexto(campoBusca?.value.trim());
    return produtos.filter(produto => {
        const correspondeCategoria = categoriaAtiva === 'todos' || produto.categoria === categoriaAtiva;
        const textoProduto = normalizarTexto(`${produto.nome} ${produto.codigo}`);
        return correspondeCategoria && (!busca || textoProduto.includes(busca));
    });
}

function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.className = 'produto-card';
    card.dataset.categoria = produto.categoria;

    const imagem = document.createElement('img');
    imagem.src = produto.imagem || 'imagens/produto-placeholder.jpg';
    imagem.alt = produto.nome || 'Produto REPOMAX';
    imagem.addEventListener('error', () => { imagem.src = 'imagens/produto-placeholder.jpg'; }, { once: true });

    const info = document.createElement('div');
    info.className = 'produto-info';

    const tag = document.createElement('span');
    tag.className = 'produto-categoria-tag';
    tag.textContent = nomesCategorias[produto.categoria] || produto.categoria;

    const nome = document.createElement('h3');
    nome.textContent = produto.nome || 'Produto sem nome';

    const codigo = document.createElement('p');
    codigo.className = 'produto-codigo';
    codigo.textContent = `Cód. ${produto.codigo || 'Não informado'}`;

    info.append(tag, nome, codigo);
    card.append(imagem, info);
    return card;
}

function renderizarProdutos() {
    if (!produtosGrid) return;

    const filtrados = obterProdutosFiltrados();
    const exibidos = filtrados.slice(0, quantidadeVisivel);
    produtosGrid.replaceChildren(...exibidos.map(criarCardProduto));

    if (produtosVazio) produtosVazio.hidden = filtrados.length > 0;
    if (produtosStatus) {
        produtosStatus.textContent = filtrados.length
            ? `Exibindo ${exibidos.length} de ${filtrados.length} produto${filtrados.length === 1 ? '' : 's'}.`
            : '';
    }
    if (botaoCarregarMais) botaoCarregarMais.hidden = exibidos.length >= filtrados.length;
}

function selecionarCategoria(categoria, atualizarUrl = false) {
    categoriaAtiva = categoriasValidas.includes(categoria) ? categoria : 'todos';
    quantidadeVisivel = tamanhoLote;

    filtroBotoes.forEach(botao => {
        botao.classList.toggle('ativo', botao.dataset.categoria === categoriaAtiva);
    });

    if (atualizarUrl) {
        const url = new URL(window.location.href);
        if (categoriaAtiva === 'todos') url.searchParams.delete('categoria');
        else url.searchParams.set('categoria', categoriaAtiva);
        window.history.replaceState({}, '', url);
    }
    renderizarProdutos();
}

async function carregarCatalogo() {
    if (!produtosGrid) return;

    try {
        const resposta = await fetch('produtos.json');
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        const dados = await resposta.json();
        if (!Array.isArray(dados)) throw new Error('O catálogo deve ser uma lista de produtos.');

        produtos = dados.filter(produto => categoriasValidas.includes(produto.categoria) && produto.categoria !== 'todos');
        const categoriaDaUrl = new URLSearchParams(window.location.search).get('categoria');
        selecionarCategoria(categoriaDaUrl || 'todos');
    } catch (erro) {
        console.error('Não foi possível carregar produtos.json:', erro);
        if (produtosStatus) produtosStatus.textContent = 'Não foi possível carregar o catálogo. Abra o site por um servidor local ou hospedagem.';
    }
}

filtroBotoes.forEach(botao => {
    botao.addEventListener('click', () => selecionarCategoria(botao.dataset.categoria, true));
});

campoBusca?.addEventListener('input', () => {
    quantidadeVisivel = tamanhoLote;
    renderizarProdutos();
});
botaoBusca?.addEventListener('click', () => {
    quantidadeVisivel = tamanhoLote;
    renderizarProdutos();
});
botaoCarregarMais?.addEventListener('click', () => {
    quantidadeVisivel += tamanhoLote;
    renderizarProdutos();
});

carregarCatalogo();

// ===== Formulário de contato (demonstração visual) =====
const formularioContato = document.getElementById('formulario-contato');
const formularioStatus = document.getElementById('formulario-status');

formularioContato?.addEventListener('submit', evento => {
    evento.preventDefault();
    formularioStatus.textContent = 'Mensagem registrada. Configure o envio do formulário quando o site estiver pronto.';
    formularioContato.reset();
});
