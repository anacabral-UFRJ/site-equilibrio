document.addEventListener('DOMContentLoaded', () => {

    const viewer = document.getElementById('markdown-viewer');
    const loading = document.getElementById('loading');
    const tocNav = document.getElementById('table-of-contents');

    // 1. CARREGAMENTO DO TEXTO DO LIVRO (MÉTODO 100% OFFLINE / ANTIBLOQUEIO)
    try {
        if (typeof window.BOOK_CONTENT === 'undefined') {
            throw new Error("A variável window.BOOK_CONTENT não foi carregada. (content.js falhou)");
        }
        if (typeof marked === 'undefined') {
            throw new Error("A bliblioteca MarkedJS não carregou. É necessária internet para o primeiro acesso à CDN.");
        }

        const markdown = window.BOOK_CONTENT;
        loading.style.display = 'none';

        // Configuração do motor de conversão (MarkedJS)
        marked.use({
            gfm: true,
            breaks: true,
        });

const renderer = new marked.Renderer();
  renderer.heading = function (token) {
  const text = token.text || '';
  const level = token.depth;
  const slug = text.toLowerCase().replace(/[\s\W-]+/g, '-');
  return `<h${level} id="${slug}">${text}</h${level}>`;
  };

        // Injeta o HTML completo no Ecrã Principal
        viewer.innerHTML = marked.parse(markdown, { renderer: renderer });

        // Após renderizar o livro, construímos o Mapa da Mina (O Menu Lateral TOC)
        buildTableOfContents();

    } catch (err) {
        loading.innerHTML = `<span style="color:red;"><b>Falha Total ao Carregar o Livro:</b><br>${err.message}</span>`;
        tocNav.innerHTML = `<p style="color:red; font-size:14px; padding:10px;">Erro Fatal: ${err.message}</p>`;
    }

    // 2. CONSTRUÇÃO ENGENHOSA DO MENU LATERAL INDEXADO (TOC)
    function buildTableOfContents() {
        // Encontra todos os titulos (Módulos, Capítulos e Subcapítulos)
        const headings = viewer.querySelectorAll('h1, h2, h3');
        
        if (headings.length === 0) return;
        
        const ul = document.createElement('ul');
        
        headings.forEach(heading => {
            // Ignoramos titulos vazios ou genéricos dependendo da cor local
            const tagName = heading.tagName.toLowerCase();
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim(); // Remove emojis do menu para fica sério

            // Adiciona identação hierárquica usando classes de CSS!
            if (tagName === 'h1') {
                a.classList.add('toc-h1');
                a.style.fontWeight = 'bold';
                a.style.marginTop = '15px';
                a.textContent = '📖 ' + a.textContent;
            } else if (tagName === 'h2') {
                a.classList.add('toc-h2');
            } else if (tagName === 'h3') {
                a.classList.add('toc-h3');
            }
            
            // Lógica para fechamento automático do menu em celulares pequenos ao clicar links
            a.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove('open');
                }
            });

            li.appendChild(a);
            ul.appendChild(li);
        });
        
        tocNav.innerHTML = '';
        tocNav.appendChild(ul);
    }

    // 3. MENU MOBILE RESPONSIVO TIPO APLICATIVO SUS
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const sidebar = document.getElementById('sidebar');

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    closeMobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // 4. PRESERVAÇÃO DA ROTINA S.O.S (O BOTÃO DE EMERGÊNCIAS 4-7-8)
    const sosBtn = document.getElementById('sos-btn');
    const sosModal = document.getElementById('sos-modal');
    const closeModal = document.getElementById('close-modal');
    const breathText = document.getElementById('breath-instruction');
    const breathCircle = document.getElementById('breath-circle');
    let breatheInterval;

    sosBtn.addEventListener('click', () => {
        sosModal.classList.remove('hidden');
        sidebar.classList.remove('open'); // fecha o menu mobile se tiver aberto
        startBreathingAnimation();
    });

    closeModal.addEventListener('click', () => {
        sosModal.classList.add('hidden');
        clearInterval(breatheInterval);
        breathCircle.style.transform = 'scale(1)';
    });

    function startBreathingAnimation() {
        const breathe478 = () => {
            breathText.textContent = 'Inspire pelo nariz...';
            breathCircle.style.transitionDuration = '4s';
            breathCircle.style.transform = 'scale(1.8)';
            
            setTimeout(() => {
                breathText.textContent = 'Segure o ar...';
                
                setTimeout(() => {
                    breathText.textContent = 'Solte longamente pela boca... (Xiiiii)';
                    breathCircle.style.transitionDuration = '8s';
                    breathCircle.style.transform = 'scale(1)';
                }, 7000);
            }, 4000);
        };

        breathe478();
        breatheInterval = setInterval(breathe478, 19000);
    }
});
