// 1. Control de Navegación
function showSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return; // Seguridad por si el ID no existe

    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });

    el.classList.remove('hidden');

    // --- NUEVO: Inicialización automática de secciones ---
    if (sectionId === 'aprender') {
        initAprender(); // Esto asegura que las flashcards carguen desde la primera
    }

    // Guardamos la sección para el F5
    localStorage.setItem('last_section', sectionId);
}


// 2. Selección de Juegos
function openGame(gameId) {
    const fullGameId = 'game-' + gameId;
    showSection(fullGameId);

    if (gameId === 'quiz-options') {
        initQuizOptions();
    } else if (gameId === 'quiz-30') {
        initQuiz30();
    } else if (gameId === 'hangman') {
        initHangman();
    }

    // Aquí irás sumando otros juegos: else if (gameId === 'hangman') ...
}


// 3. Palabra del día
function initDailyWord() {
    const today = new Date().toDateString();
    let daily = JSON.parse(localStorage.getItem('dailyWord'));
    let lastDate = localStorage.getItem('lastDate');

    if (lastDate !== today || !daily) {
        daily = db[Math.floor(Math.random() * db.length)];
        localStorage.setItem('lastDate', today);
        localStorage.setItem('dailyWord', JSON.stringify(daily));
    }

    document.getElementById('word-en').innerText = daily.english;
    document.getElementById('word-type').innerText = daily.type;
    const es = document.getElementById('word-es');
    es.innerText = "Click para revelar";
    es.onclick = () => es.innerText = daily.spanish;

    updateDailyFavIcon(); // <--- IMPORTANTE: Para que al cargar sepa si es favorita
}

// 4. Actualizar estadísticas en la Landing
function updateLandingStats() {
    const scoreEl = document.getElementById('main-high-score');
    if (scoreEl && typeof Storage !== 'undefined') {
        scoreEl.innerText = Storage.getHighScore('quiz_options');
    }
}

// 5. ÚNICO punto de entrada al cargar la página
window.onload = () => {
    
    // IMPORTANTE: Agrega esto al inicio de tu window.onload para que recuerde el tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-icon').innerText = '☀️';
    }

    // Ejecutamos la lógica de datos
    initDailyWord();
    updateLandingStats();

    // Recuperamos la sección
    const lastSection = localStorage.getItem('last_section');

    if (lastSection && document.getElementById(lastSection)) {
        showSection(lastSection);

        // Si el usuario refrescó estando dentro del quiz, lo reactivamos
        if (lastSection === 'game-quiz-options') {
            initQuizOptions();
        } else if (lastSection === 'game-hangman') {
            initHangman();
        } else if (lastSection === 'game-quiz-30') {
            initQuiz30();
        }

    } else {
        showSection('landing');
    }
};


// Cambiar estado (se llama al hacer click en la estrella)
function toggleDailyFavorite() {
    const daily = JSON.parse(localStorage.getItem('dailyWord'));
    if (!daily) return;

    let favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];
    const wordText = daily.english;

    if (favorites.includes(wordText)) {
        favorites = favorites.filter(f => f !== wordText);
    } else {
        favorites.push(wordText);
    }

    localStorage.setItem('lingo_favs', JSON.stringify(favorites));
    updateDailyFavIcon();
}

// Refrescar el dibujo de la estrella
function updateDailyFavIcon() {
    const daily = JSON.parse(localStorage.getItem('dailyWord'));
    const favBtn = document.getElementById('fav-daily');
    if (!daily || !favBtn) return;

    const favorites = JSON.parse(localStorage.getItem('lingo_favs')) || [];
    favBtn.innerText = favorites.includes(daily.english) ? '★' : '☆';
}



function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.innerText = isDark ? '☀️' : '🌙';
}

