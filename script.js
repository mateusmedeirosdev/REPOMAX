const dropdown = document.querySelector('.dropdown');
const categorias = document.querySelector('.categorias');
let hideTimeout;

dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    categorias.classList.add('show');
});

dropdown.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
        categorias.classList.remove('show');
    }, 200);
});

categorias.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    categorias.classList.add('show');
});

categorias.addEventListener('mouseleave', () => {
    categorias.classList.remove('show');
});

// ===== Carrossel do Hero (banner principal) =====
let currentSlide = 0;
const heroSlides = document.querySelectorAll('.hero .slide');
const heroCarrossel = document.querySelector('.hero .carrossel');
const totalHeroSlides = heroSlides.length;

function irParaSlideHero(index) {
    currentSlide = index;
    heroCarrossel.style.transform = `translateX(-${index * 100}%)`;
}

function mudarSlideHero(direcao) {
    currentSlide = (currentSlide + direcao + totalHeroSlides) % totalHeroSlides;
    irParaSlideHero(currentSlide);
    reiniciarAutoplayHero();
}

let autoplayHero = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalHeroSlides;
    irParaSlideHero(currentSlide);
}, 10000);

function reiniciarAutoplayHero() {
    clearInterval(autoplayHero);
    autoplayHero = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalHeroSlides;
        irParaSlideHero(currentSlide);
    }, 10000);
}
// ===== Carrossel de Lançamentos =====
const containerLancamentos = document.querySelector('.carrossel-container');
const itensVisiveis = 4;

function moverCarrossel(direcao) {
    const container = containerLancamentos;
    if (!container) return;

    const primeiroItem = container.querySelector('.item-lancamento');
    if (!primeiroItem) return;

    const estiloContainer = window.getComputedStyle(container);
    const gap = parseFloat(estiloContainer.columnGap || estiloContainer.gap || '0');
    const itemWidth = primeiroItem.offsetWidth + gap;
    const scrollStep = itemWidth * itensVisiveis;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (direcao > 0 && container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        return;
    }

    if (direcao < 0 && container.scrollLeft <= 10) {
        container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        return;
    }

    container.scrollBy({
        left: direcao * scrollStep,
        behavior: 'smooth'
    });
}

function avancarLancamentos() {
    moverCarrossel(1);
}

setInterval(avancarLancamentos, 5000); // Muda de bloco de 4 itens a cada 5 segundos

// ===== Filtro de categorias (visual, por enquanto sem busca por texto) =====
const filtroBotoes = document.querySelectorAll('.filtro-btn');
const produtoCards = document.querySelectorAll('.produto-card');
const produtosVazio = document.getElementById('produtos-vazio');

filtroBotoes.forEach(botao => {
    botao.addEventListener('click', () => {
        filtroBotoes.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');

        const categoria = botao.dataset.categoria;
        let algumVisivel = false;

        produtoCards.forEach(card => {
            const mostrar = categoria === 'todos' || card.dataset.categoria === categoria;
            card.style.display = mostrar ? 'block' : 'none';
            if (mostrar) algumVisivel = true;
        });

        produtosVazio.style.display = algumVisivel ? 'none' : 'block';
    });
});

// ===== Campo de busca (estrutura pronta, lógica de filtro a implementar depois) =====
const campoBusca = document.getElementById('campo-busca');

campoBusca.addEventListener('input', () => {
    // TODO: implementar filtro por nome/código do produto
    console.log('Busca digitada:', campoBusca.value);
});