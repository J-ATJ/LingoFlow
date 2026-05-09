function getDailyWord() {
    const today = new Date().toDateString(); // Ejemplo: "Mon Oct 23 2023"
    const storedDate = localStorage.getItem('lastUpdate');
    let dailyWord;

    if (storedDate === today) {
        // Si ya se generó hoy, recuperamos la guardada
        dailyWord = JSON.parse(localStorage.getItem('dailyWord'));
    } else {
        // Si es un día nuevo, elegimos una al azar
        dailyWord = db[Math.floor(Math.random() * db.length)];
        localStorage.setItem('lastUpdate', today);
        localStorage.setItem('dailyWord', JSON.stringify(dailyWord));
    }
    return dailyWord;
}

function displayDailyWord() {
    const word = getDailyWord();
    document.getElementById('word-en').innerText = word.english;
    document.getElementById('word-type').innerText = word.type;
    
    const esText = document.getElementById('word-es');
    esText.onclick = () => esText.innerText = word.spanish;
}

// Navegación simple entre secciones
function showSection(sectionId) {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('aprender').classList.add('hidden');
    // ... agregar las demás
    document.getElementById(sectionId).classList.remove('hidden');
}

// Inicializar
window.onload = displayDailyWord;