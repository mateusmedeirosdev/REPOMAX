// ===== Menu de categorias =====
const dropdown = document.querySelector('.dropdown');
const categorias = document.querySelector('.categorias');
const menuMobile = document.querySelector('.menu-mobile');
const navLinks = document.querySelector('.nav-links');
const dropdownToggle = document.querySelector('.dropdown-toggle');
let hideTimeout;

menuMobile?.addEventListener('click', () => {
    const menuAberto = navLinks.classList.toggle('aberto');
    menuMobile.setAttribute('aria-expanded', String(menuAberto));
    menuMobile.setAttribute('aria-label', menuAberto ? 'Fechar menu' : 'Abrir menu');
});

dropdownToggle?.addEventListener('click', evento => {
    if (!window.matchMedia('(max-width: 780px)').matches) return;
    evento.preventDefault();
    dropdown.classList.toggle('aberto');
});

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
const heroCarrossel = document.querySelector('.hero .carrossel');
const heroSlides = heroCarrossel?.querySelectorAll('.slide') || [];
const totalHeroSlides = heroSlides.length;
let autoplayHero;
let heroEmMovimento = false;

if (heroCarrossel && totalHeroSlides > 1) {
    heroCarrossel.appendChild(heroSlides[0].cloneNode(true));
    heroCarrossel.insertBefore(heroSlides[totalHeroSlides - 1].cloneNode(true), heroCarrossel.firstChild);
    currentSlide = 1;
    heroCarrossel.style.transition = 'none';
    heroCarrossel.style.transform = `translateX(-${currentSlide * 100}%)`;
    void heroCarrossel.offsetWidth;
    heroCarrossel.style.transition = '';
}

function irParaSlideHero(index) {
    if (!heroCarrossel || !totalHeroSlides) return;
    currentSlide = index;
    heroCarrossel.style.transform = `translateX(-${index * 100}%)`;
}

function reposicionarHero(index) {
    if (!heroCarrossel) return;
    heroCarrossel.style.transition = 'none';
    irParaSlideHero(index);
    heroCarrossel.getBoundingClientRect();
    heroCarrossel.style.transition = '';
}

function mudarSlideHero(direcao) {
    if (!totalHeroSlides || heroEmMovimento) return;
    heroEmMovimento = true;
    irParaSlideHero(currentSlide + direcao);
    clearInterval(autoplayHero);
    iniciarAutoplayHero();
}

heroCarrossel?.addEventListener('transitionend', evento => {
    if (evento.propertyName !== 'transform' || totalHeroSlides < 2) return;

    if (currentSlide === 0) {
        reposicionarHero(totalHeroSlides);
    } else if (currentSlide >= totalHeroSlides + 1) {
        reposicionarHero(1);
    }

    heroEmMovimento = false;
});

function iniciarAutoplayHero() {
    autoplayHero = setInterval(() => {
        if (heroEmMovimento) return;
        heroEmMovimento = true;
        irParaSlideHero(currentSlide + 1);
    }, 10000);
}

if (totalHeroSlides) iniciarAutoplayHero();

// ===== Carrossel de lançamentos =====
const containerLancamentos = document.querySelector('.carrossel-container');
const itensVisiveis = 4;
let larguraGrupoLancamentos = 0;
let normalizacaoLancamentos;
let lancamentosEmMovimento = false;

if (containerLancamentos) {
    const itensOriginais = [...containerLancamentos.querySelectorAll('.item-lancamento')];
    const estiloContainer = window.getComputedStyle(containerLancamentos);
    const gapLancamentos = parseFloat(estiloContainer.columnGap || estiloContainer.gap || '0');

    itensOriginais.forEach(item => containerLancamentos.appendChild(item.cloneNode(true)));
    itensOriginais.slice().reverse().forEach(item => {
        containerLancamentos.insertBefore(item.cloneNode(true), containerLancamentos.firstChild);
    });

    larguraGrupoLancamentos = itensOriginais.reduce((largura, item) => largura + item.offsetWidth, 0)
        + gapLancamentos * itensOriginais.length;
    containerLancamentos.style.scrollBehavior = 'auto';
    containerLancamentos.scrollLeft = larguraGrupoLancamentos;
    containerLancamentos.style.scrollBehavior = '';
}

function normalizarLancamentos() {
    if (!containerLancamentos || !larguraGrupoLancamentos) return;

    const inicioGrupoOriginal = larguraGrupoLancamentos;
    const fimGrupoOriginal = inicioGrupoOriginal * 2;
    const margem = 10;
    let novaPosicao = null;

    if (containerLancamentos.scrollLeft >= fimGrupoOriginal - margem) {
        novaPosicao = containerLancamentos.scrollLeft - larguraGrupoLancamentos;
    } else if (containerLancamentos.scrollLeft <= inicioGrupoOriginal - margem) {
        novaPosicao = containerLancamentos.scrollLeft + larguraGrupoLancamentos;
    }

    if (novaPosicao === null) return;
    containerLancamentos.style.scrollBehavior = 'auto';
    containerLancamentos.scrollLeft = novaPosicao;
    void containerLancamentos.offsetWidth;
    containerLancamentos.style.scrollBehavior = '';
}

function agendarNormalizacaoLancamentos() {
    clearTimeout(normalizacaoLancamentos);
    normalizacaoLancamentos = setTimeout(() => {
        normalizarLancamentos();
        lancamentosEmMovimento = false;
    }, 800);
}

containerLancamentos?.addEventListener('scrollend', () => {
    clearTimeout(normalizacaoLancamentos);
    normalizarLancamentos();
    lancamentosEmMovimento = false;
});
containerLancamentos?.addEventListener('scroll', agendarNormalizacaoLancamentos);

function moverCarrossel(direcao) {
    if (!containerLancamentos || lancamentosEmMovimento) return;
    const primeiroItem = containerLancamentos.querySelector('.item-lancamento');
    if (!primeiroItem) return;

    const estiloContainer = window.getComputedStyle(containerLancamentos);
    const gap = parseFloat(estiloContainer.columnGap || estiloContainer.gap || '0');
    const scrollStep = (primeiroItem.offsetWidth + gap) * itensVisiveis;
    lancamentosEmMovimento = true;
    containerLancamentos.scrollBy({ left: direcao * scrollStep, behavior: 'smooth' });
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
