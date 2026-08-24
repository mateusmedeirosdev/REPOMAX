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

    categorias.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        categorias.classList.add('show');
    });

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
    reiniciarAutoplayHero();
}

function reiniciarAutoplayHero() {
    if (!totalHeroSlides) return;
    clearInterval(autoplayHero);
    autoplayHero = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalHeroSlides;
        irParaSlideHero(currentSlide);
    }, 10000);
}

if (totalHeroSlides) reiniciarAutoplayHero();

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

// ===== Pesquisa e filtro de produtos =====
const filtroBotoes = document.querySelectorAll('.filtro-btn');
const produtoCards = document.querySelectorAll('.produto-card');
const produtosVazio = document.getElementById('produtos-vazio');
const campoBusca = document.getElementById('campo-busca');
const botaoBusca = document.querySelector('.botao-busca');
let categoriaAtiva = 'todos';

function normalizarTexto(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function aplicarFiltros() {
    if (!produtoCards.length) return;

    const busca = normalizarTexto(campoBusca?.value.trim() || '');
    let algumVisivel = false;

    produtoCards.forEach(card => {
        const correspondeCategoria = categoriaAtiva === 'todos' || card.dataset.categoria === categoriaAtiva;
        const correspondeBusca = !busca || normalizarTexto(card.textContent).includes(busca);
        const mostrar = correspondeCategoria && correspondeBusca;

        card.style.display = mostrar ? 'block' : 'none';
        if (mostrar) algumVisivel = true;
    });

    if (produtosVazio) produtosVazio.style.display = algumVisivel ? 'none' : 'block';
}

function selecionarCategoria(categoria, atualizarUrl = false) {
    const categoriasValidas = ['todos', 'vans', 'pickups', 'linha-leve'];
    categoriaAtiva = categoriasValidas.includes(categoria) ? categoria : 'todos';

    filtroBotoes.forEach(botao => {
        botao.classList.toggle('ativo', botao.dataset.categoria === categoriaAtiva);
    });

    if (atualizarUrl) {
        const url = new URL(window.location.href);
        if (categoriaAtiva === 'todos') url.searchParams.delete('categoria');
        else url.searchParams.set('categoria', categoriaAtiva);
        window.history.replaceState({}, '', url);
    }

    aplicarFiltros();
}

filtroBotoes.forEach(botao => {
    botao.addEventListener('click', () => selecionarCategoria(botao.dataset.categoria, true));
});

campoBusca?.addEventListener('input', aplicarFiltros);
botaoBusca?.addEventListener('click', aplicarFiltros);

if (produtoCards.length) {
    const categoriaDaUrl = new URLSearchParams(window.location.search).get('categoria');
    selecionarCategoria(categoriaDaUrl || 'todos');
}

// Mantém o formulário funcional visualmente até que um serviço de envio seja configurado.
const formularioContato = document.getElementById('formulario-contato');
const formularioStatus = document.getElementById('formulario-status');

formularioContato?.addEventListener('submit', evento => {
    evento.preventDefault();
    formularioStatus.textContent = 'Mensagem registrada. Configure o envio do formulário quando o site estiver pronto.';
    formularioContato.reset();
});
