let currentLetter = 'A';
let currentDictPage = 0;
const WORDS_PER_PAGE = 25; 
let filteredWords = [];

function initDictionary() {
    buildAlphabetBar();
    loadLetter(currentLetter);
}

function buildAlphabetBar() {
    const bar = document.getElementById('dict-alphabet-bar');
    if (!bar) return;
    bar.innerHTML = '';

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.className = `alphabet-btn ${letter === currentLetter ? 'active' : ''}`;
        btn.onclick = () => {
            currentLetter = letter;
            currentDictPage = 0;
            document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadLetter(letter);
        };
        bar.appendChild(btn);
    });
}

function loadLetter(letter) {
    filteredWords = db.filter(item => {
        return item.english.trim().toUpperCase().startsWith(letter);
    });

    filteredWords.sort((a, b) => a.english.localeCompare(b.english));

    renderDictionaryList();
}

function renderDictionaryList() {
    const listContainer = document.getElementById('dict-list');
    const paginationContainer = document.getElementById('dict-pagination');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (filteredWords.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:var(--secondary); margin:20px 0;">No hay palabras con la letra ${currentLetter}.</p>`;
        paginationContainer.innerHTML = '';
        return;
    }

    const startIndex = currentDictPage * WORDS_PER_PAGE;
    const endIndex = startIndex + WORDS_PER_PAGE;
    const wordsToDisplay = filteredWords.slice(startIndex, endIndex);
    const favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];

    wordsToDisplay.forEach(item => {
        const isFav = favorites.includes(item.english);
        
        // Tarjeta contenedora visual única
        const row = document.createElement('div');
        row.className = 'dict-row';

        // 1. CELDA IZQUIERDA: Zona segura para la estrella
        const cellFav = document.createElement('div');
        cellFav.className = 'dict-cell-fav';

        const star = document.createElement('span');
        star.className = 'dict-fav-star';
        star.textContent = isFav ? '★' : '☆';
        star.onclick = () => {
            toggleDictFavorite(item.english, star);
        };

        cellFav.appendChild(star);

        // 2. CELDA DERECHA: Zona exclusiva para abrir la modal
        const cellText = document.createElement('div');
        cellText.className = 'dict-cell-text';
        cellText.onclick = () => openDictModal(item); // Vinculado solo al bloque de texto

        const textSpan = document.createElement('span');
        textSpan.className = 'dict-word-text';
        textSpan.textContent = item.english;

        cellText.appendChild(textSpan);

        // Construir la estructura combinada
        row.appendChild(cellFav);
        row.appendChild(cellText);
        listContainer.appendChild(row);
    });

    renderDictPagination();
}

function renderDictPagination() {
    const container = document.getElementById('dict-pagination');
    if (!container) return;
    container.innerHTML = '';

    const totalPages = Math.ceil(filteredWords.length / WORDS_PER_PAGE);
    if (totalPages <= 1) return; 

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀ Anterior';
    prevBtn.disabled = currentDictPage === 0;
    prevBtn.onclick = () => {
        currentDictPage--;
        renderDictionaryList();
        document.getElementById('dictionary').scrollIntoView({ behavior: 'smooth' });
    };

    const pageIndicator = document.createElement('span');
    pageIndicator.style.fontWeight = 'bold';
    pageIndicator.textContent = `${currentDictPage + 1} / ${totalPages}`;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Siguiente ▶';
    nextBtn.disabled = currentDictPage >= totalPages - 1;
    nextBtn.onclick = () => {
        currentDictPage++;
        renderDictionaryList();
        document.getElementById('dictionary').scrollIntoView({ behavior: 'smooth' });
    };

    container.appendChild(prevBtn);
    container.appendChild(pageIndicator);
    container.appendChild(nextBtn);
}

function toggleDictFavorite(wordText, starElement) {
    let favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];

    if (favorites.includes(wordText)) {
        favorites = favorites.filter(f => f !== wordText);
        starElement.textContent = '☆';
    } else {
        favorites.push(wordText);
        starElement.textContent = '★';
    }

    localStorage.setItem('lingo_favs', JSON.stringify(favorites));
    
    if (typeof updateDailyFavIcon === 'function') {
        updateDailyFavIcon();
    }
}

function openDictModal(wordObj) {
    document.getElementById('modal-word-en').textContent = wordObj.english;
    document.getElementById('modal-word-es').textContent = wordObj.spanish;
    document.getElementById('modal-word-type').textContent = wordObj.type;
    document.getElementById('modal-word-example').textContent = wordObj.example || "No hay ejemplo disponible.";

    document.getElementById('dict-modal').classList.remove('hidden');
}

function closeDictModal() {
    document.getElementById('dict-modal').classList.add('hidden');
}
