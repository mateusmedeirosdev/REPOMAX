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
            heroCarrossel.style.transform = `translateX(${index * 100}%)`;
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