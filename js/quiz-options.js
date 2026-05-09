let quizScore = 0;
let quizActive = true;

function initQuizOptions() {
    quizScore = 0;
    quizActive = true;

    document.getElementById('score-quiz').innerText = `Puntos: 0`;
    document.getElementById('high-score-quiz').innerText = Storage.getHighScore('quiz_options');

    // Limpiar pantallas de Game Over si existieran
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');

    const gameCard = document.querySelector('#game-quiz-options .card');
    if (gameCard) gameCard.classList.remove('hidden');
    nextQuestion();
}


function nextQuestion() {
    quizActive = true;
    const correctIdx = Math.floor(Math.random() * db.length);
    const correct = db[correctIdx];

    let options = db
        .filter((_, i) => i !== correctIdx)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    options.push(correct);
    options.sort(() => 0.5 - Math.random());

    renderQuizUI(correct, options);
}

function renderQuizUI(correct, options) {
    document.getElementById('q-word').innerText = correct.english;
    const grid = document.getElementById('quiz-options-grid');
    grid.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt.spanish;
        btn.className = "btn-option";
        btn.onclick = () => {
            if (!quizActive) return;
            quizActive = false;

            if (opt.english === correct.english) {
                quizScore++;
                btn.classList.add('correct');

                // ACTUALIZACIÓN EN TIEMPO REAL DEL RÉCORD
                const currentHigh = Storage.getHighScore('quiz_options');
                if (quizScore > currentHigh) {
                    // Actualizamos el récord en el HTML de inmediato
                    document.getElementById('high-score-quiz').innerText = quizScore;
                    // Opcional: Podrías guardar en cada acierto o esperar al Game Over
                    // Para mayor seguridad, guardamos de una vez:
                    Storage.saveHighScore('quiz_options', quizScore);
                }

                setTimeout(() => {
                    document.getElementById('score-quiz').innerText = `Puntos: ${quizScore}`;
                    nextQuestion();
                }, 600);

            } else {
                btn.classList.add('incorrect');
                quizActive = false;
                Storage.saveHighScore('quiz_options', quizScore);

                // Inyectamos la información de la palabra correcta antes de mostrar la pantalla
                document.getElementById('correct-word-en').innerText = correct.english;
                document.getElementById('correct-word-es').innerText = correct.spanish;
                document.getElementById('final-score').innerText = quizScore;

                setTimeout(() => {
                    document.getElementById('game-over-screen').classList.remove('hidden');
                    document.querySelector('#game-quiz-options .card').classList.add('hidden');
                }, 600);
            }
        };
        grid.appendChild(btn);
    });
}