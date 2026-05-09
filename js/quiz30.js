let q30Score = 0;
let q30Lives = 3;
let q30TimeLeft = 30;
let q30TimerInterval;
let q30Active = false;

function initQuiz30() {
    // Reset de variables
    q30Score = 0;
    q30Lives = 3;
    q30TimeLeft = 30;
    q30Active = true;

    // Reset UI
    document.getElementById('score-q30').innerText = '0';
    document.getElementById('q30-lives').innerText = '❤❤❤';
    document.getElementById('q30-timer').innerText = '30';
    document.getElementById('q30-timer').classList.remove('low-time');
    document.getElementById('q30-game-over').classList.add('hidden');
    document.getElementById('q30-card').classList.remove('hidden');
    
    // Cargar Récord
    const record = localStorage.getItem('high_score_q30') || 0;
    document.getElementById('high-score-q30').innerText = record;

    startTimer();
    nextQ30Question();
}

function startTimer() {
    clearInterval(q30TimerInterval);
    q30TimerInterval = setInterval(() => {
        q30TimeLeft--;
        const timerEl = document.getElementById('q30-timer');
        timerEl.innerText = q30TimeLeft;

        if (q30TimeLeft <= 5) timerEl.classList.add('low-time');

        if (q30TimeLeft <= 0) {
            endGameQ30("¡Se acabó el tiempo! ⏰");
        }
    }, 1000);
}

function nextQ30Question() {
    if (!q30Active) return;

    const correctIdx = Math.floor(Math.random() * db.length);
    const correct = db[correctIdx];

    // Obtener 3 opciones falsas (distintas a la correcta)
    let options = db
        .filter(w => w.english !== correct.english)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    options.push(correct);
    options.sort(() => 0.5 - Math.random());

    renderQ30UI(correct, options);
}

function renderQ30UI(correct, options) {
    document.getElementById('q30-word').innerText = correct.english;
    const grid = document.getElementById('q30-options-grid');
    grid.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt.spanish;
        btn.className = "btn-option";
        
        btn.onclick = () => {
            if (!q30Active) return;

            if (opt.english === correct.english) {
                // ACIERTO
                q30Score++;
                btn.classList.add('correct');
                document.getElementById('score-q30').innerText = q30Score;
                setTimeout(nextQ30Question, 200); // Cambio rápido para no perder tiempo
            } else {
                // ERROR
                q30Lives--;
                btn.classList.add('incorrect');
                document.getElementById('q30-lives').innerText = "❤".repeat(q30Lives) || "💔";
                
                if (q30Lives <= 0) {
                    setTimeout(() => endGameQ30("¡Te quedaste sin vidas! 💔"), 300);
                } else {
                    setTimeout(nextQ30Question, 400);
                }
            }
        };
        grid.appendChild(btn);
    });
}

function endGameQ30(reason) {
    q30Active = false;
    clearInterval(q30TimerInterval);

    // Guardar récord
    const currentRecord = localStorage.getItem('high_score_q30') || 0;
    if (q30Score > currentRecord) {
        localStorage.setItem('high_score_q30', q30Score);
    }

    // Mostrar Modal
    document.getElementById('q30-final-score').innerText = q30Score;
    document.getElementById('q30-best-score').innerText = localStorage.getItem('high_score_q30');
    document.getElementById('q30-game-over').querySelector('h2').innerText = reason;
    document.getElementById('q30-game-over').classList.remove('hidden');
    document.getElementById('q30-card').classList.add('hidden');
}