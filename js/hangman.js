let hangmanAnswer = "";
let guessedLetters = [];
let errorCount = 0;
let hangmanActive = false;

function initHangman() {
    // 1. Configuración inicial
    hangmanActive = true;
    errorCount = 0;
    guessedLetters = [];

    // 2. Seleccionar palabra al azar de tu db.js
    const randomObj = db[Math.floor(Math.random() * db.length)];
    hangmanAnswer = randomObj.english.toUpperCase();

    // 3. UI Reset
    document.getElementById('hangman-over').classList.add('hidden');
    document.getElementById('hangman-spa-hint').innerText = `Pista: ${randomObj.spanish}`;
    document.getElementById('used-letters').innerText = "";
    document.querySelector('#game-hangman .card').classList.remove('hidden');

    renderHangmanWord();

    generateKeyboard();

    // 4. Preparar Canvas
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHangmanBase(ctx);
}

function renderHangmanWord() {
    const container = document.getElementById('word-display');
    container.innerHTML = "";

    let allGuessed = true;

    const isSymbol = /[^A-ZÑ]/;     // definir caracteres especiales

    for (let char of hangmanAnswer) {
        const span = document.createElement('span');
        span.className = "letter-slot";

        if (char === " ") {
            span.classList.add('space');
            span.innerText = " ";
        } 
        
        else if (guessedLetters.includes(char) || isSymbol.test(char)) {
            span.innerText = char;
        } else {
            span.innerText = "";
            allGuessed = false;
        }
        container.appendChild(span);
    }

    if (allGuessed && hangmanActive) {
        endHangman(true);
    }
}

// Escuchar teclado
document.addEventListener("keydown", (e) => {
    if (document.getElementById('game-hangman').classList.contains('hidden') || !hangmanActive) return;

    const letter = e.key.toUpperCase();
    const validLetters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

    if (validLetters.includes(letter)) {
        // Buscamos si existe el botón en pantalla para desactivarlo también
        const btns = document.querySelectorAll('.key-btn');
        let targetBtn = null;
        btns.forEach(b => { if (b.innerText === letter) targetBtn = b; });

        handleInput(letter, targetBtn);
    }
});

function endHangman(isWin) {
    hangmanActive = false;
    document.getElementById('hangman-result-title').innerText = isWin ? "¡Ganaste! 🎉" : "¡Oh no! Perdiste 💀";
    document.getElementById('hangman-correct-word').innerText = hangmanAnswer;

    setTimeout(() => {
        document.getElementById('hangman-over').classList.remove('hidden');
        document.querySelector('#game-hangman .card').classList.add('hidden');
    }, 800);
}

// --- FUNCIONES DE DIBUJO (Traducidas de tu Canvas) ---
function drawHangmanBase(ctx) {

    // Si por alguna razón ctx no llega, lo buscamos
    if (!ctx) {
        const canvas = document.getElementById('hangmanCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
    }

    ctx.strokeStyle = "#4a90e2"; // Tu color --primary
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(20, 230); ctx.lineTo(180, 230); // Base
    ctx.moveTo(50, 230); ctx.lineTo(50, 20);   // Poste
    ctx.moveTo(50, 20); ctx.lineTo(150, 20);   // Techo
    ctx.moveTo(150, 20); ctx.lineTo(150, 50);  // Cuerda
    ctx.stroke();
}

function drawHangmanStep(step) {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#dc3545"; // Color --danger
    ctx.lineWidth = 3;

    switch (step) {
        case 1: // Cabeza
            ctx.beginPath(); ctx.arc(150, 75, 25, 0, Math.PI * 2); ctx.stroke(); break;
        case 2: // Tronco
            ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(150, 150); ctx.stroke(); break;
        case 3: // Brazo izq
            ctx.beginPath(); ctx.moveTo(150, 120); ctx.lineTo(120, 150); ctx.stroke(); break;
        case 4: // Brazo der
            ctx.beginPath(); ctx.moveTo(150, 120); ctx.lineTo(180, 150); ctx.stroke(); break;
        case 5: // Cuerpo abajo (extensión tronco)
            ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(150, 170); ctx.stroke(); break;
        case 6: // Pierna izq
            ctx.beginPath(); ctx.moveTo(150, 170); ctx.lineTo(120, 210); ctx.stroke(); break;
        case 7: // Pierna der
            ctx.beginPath(); ctx.moveTo(150, 170); ctx.lineTo(180, 210); ctx.stroke(); break;
    }
}

function handleInput(letter, btnElement) {
    if (!hangmanActive || guessedLetters.includes(letter)) return;

    // Desactivar el botón visualmente para que no se repita
    if (btnElement) {
        btnElement.disabled = true;
        btnElement.style.opacity = "0.5";
    }

    if (hangmanAnswer.includes(letter)) {
        guessedLetters.push(letter);
        renderHangmanWord();
    } else {
        guessedLetters.push(letter);
        errorCount++;
        document.getElementById('used-letters').innerText += letter + " ";
        drawHangmanStep(errorCount);
        if (errorCount >= 7) endHangman(false);
    }
}


// Teclado virtual
function generateKeyboard() {
    const keyboard = document.getElementById('hangman-keyboard');
    keyboard.innerHTML = "";
    "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").forEach(letter => {
        const btn = document.createElement('button');
        btn.innerText = letter;
        btn.className = "key-btn";
        btn.onclick = () => handleInput(letter, btn); // Función que procesa la letra
        keyboard.appendChild(btn);
    });
}
