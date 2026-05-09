const Storage = {
    // Guardar el puntaje máximo de un juego específico
    saveHighScore: function(gameKey, score) {
        const currentHigh = this.getHighScore(gameKey);
        if (score > currentHigh) {
            localStorage.setItem('lingoFlow_' + gameKey, score);
            return true;
        }
        return false;
    },

    // Obtener el puntaje máximo de un juego específico
    getHighScore: function(gameKey) {
        return parseInt(localStorage.getItem('lingoFlow_' + gameKey)) || 0;
    }
};