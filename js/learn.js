let shuffledDb = [];
let isFavMode = false;
let currentStudyIndex = 0;

function toggleFavMode() {
    isFavMode = document.getElementById('fav-filter-check').checked;
    initAprender();
}

function initAprender() {
    const favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];

    if (isFavMode) {
        // Filtramos y mezclamos
        shuffledDb = db.filter(word => favorites.includes(word.english))
            .sort(() => Math.random() - 0.5);

        if (shuffledDb.length === 0) {
            alert("No tienes palabras marcadas como favoritas aún.");
            document.getElementById('fav-filter-check').checked = false;
            isFavMode = false;
            shuffledDb = [...db].sort(() => Math.random() - 0.5);
        }
    } else {
        shuffledDb = [...db].sort(() => Math.random() - 0.5);
    }

    currentStudyIndex = 0;
    showCard(currentStudyIndex);
}

function showCard(index) {

    const card = document.getElementById('main-card');
    card.classList.remove('flipped'); // Asegurar que empiece por el frente
    const word = shuffledDb[index];

    // Inyectar datos
    document.getElementById('study-word-en').innerText = word.english;
    document.getElementById('study-word-es').innerText = word.spanish;
    document.getElementById('study-type').innerText = word.type;
    document.getElementById('study-example').innerText = word.example || "No hay ejemplo disponible.";

    // Contador
    document.getElementById('card-counter').innerText = `${index + 1} / ${shuffledDb.length}`;

    // Actualizar favicon
    updateFavIcon(); // Actualiza la estrella cada vez que cambias de palabra
}

function nextCard() {
    // Bloqueo estricto: solo avanza si NO es la última
    if (currentStudyIndex < shuffledDb.length - 1) {
        const card = document.getElementById('main-card');

        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            setTimeout(() => {
                currentStudyIndex++;
                showCard(currentStudyIndex);
            }, 300);
        } else {
            currentStudyIndex++;
            showCard(currentStudyIndex);
        }
    }
}

function prevCard() {
    // Bloqueo estricto: solo retrocede si NO es la primera (0)
    if (currentStudyIndex > 0) {
        const card = document.getElementById('main-card');

        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            setTimeout(() => {
                currentStudyIndex--;
                showCard(currentStudyIndex);
            }, 300);
        } else {
            currentStudyIndex--;
            showCard(currentStudyIndex);
        }
    }
}

function toggleFavorite(event) {
    if (event) event.stopPropagation();

    const currentWordObj = shuffledDb[currentStudyIndex];
    if (!currentWordObj) return;

    const wordText = currentWordObj.english;
    let favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];

    if (favorites.includes(wordText)) {
        favorites = favorites.filter(f => f !== wordText);
    } else {
        favorites.push(wordText);
    }

    localStorage.setItem('lingo_favs', JSON.stringify(favorites));
    updateFavIcon();
}

function updateFavIcon() {
    const favBtn = document.getElementById('fav-btn');
    if (!favBtn || !shuffledDb[currentStudyIndex]) return;

    const wordText = shuffledDb[currentStudyIndex].english;
    const favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];

    if (favorites.includes(wordText)) {
        favBtn.innerText = '★';
        favBtn.classList.add('is-fav');
    } else {
        favBtn.innerText = '☆';
        favBtn.classList.remove('is-fav');
    }
}

function playCurrentWord(event) {
    if (event) event.stopPropagation();

    const wordObj = shuffledDb[currentStudyIndex];
    if (wordObj) {
        speakWord(wordObj.english);
    }
}

function playCurrentExample(event) {
    // Evitamos que la carta se voltee al hacer clic en el botón
    if (event) event.stopPropagation();

    const wordObj = shuffledDb[currentStudyIndex];
    
    // Verificamos que exista el objeto y que tenga un ejemplo
    if (wordObj && wordObj.example) {
        // Reutilizamos tu función speakWord que ya tiene los filtros de voz
        speakWord(wordObj.example);
    } else {
        console.warn("No hay ejemplo de audio disponible para esta palabra.");
    }
}

function speakWord(text) {
    window.speechSynthesis.cancel();
    const synth = window.speechSynthesis;

// 1. Reemplazos de abreviaturas
    let cleanText = text.replace(/\bsb\b/g, 'somebody')
                        .replace(/\bsth\b/g, 'something');
    
    // 2. Reemplazo de "/" por "or"
    // Usamos una expresión regular con /g para que cambie todas las apariciones
    cleanText = cleanText.replace(/\//g, ' or ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.90;
    utterance.pitch = 1;

    synth.speak(utterance);
}