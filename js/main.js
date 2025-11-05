
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadGamesSection();
        await loadPredictionsSection();
        setupNavigation(); // Теперь вызывается после загрузки данных
    } catch (error) {
        console.error('Критическая ошибка при инициализации:', error);
    }
});

// Загрузка раздела с играми
async function loadGamesSection() {
    const games = [
        { name: 'CS2', slug: 'cs2', icon: '🎮' }, // Добавлен icon
        { name: 'Dota 2', slug: 'dota-2', icon: '🛡️' },
        { name: 'League of Legends', slug: 'league-of-legends', icon: '⚡' },
        { name: 'Valorant', slug: 'valorant', icon: '🔫' }
    ];

    const gamesContainer = document.querySelector('.games');
    if (!gamesContainer) {
        console.warn('Контейнер .games не найден в DOM');
        return;
    }

    // Индикация загрузки
    gamesContainer.innerHTML = '<p>Загружаем игры...</p>';

    try {
        // Очищаем лоадер перед добавлением карточек
        gamesContainer.innerHTML = '';

        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <h3>${game.icon} ${game.name}</h3>
                <p>Актуальные турниры и статистика</p>
                <a href="tournaments.html?game=${game.slug}" class="btn">Смотреть</a>
            `;
            gamesContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка при генерации карточек игр:', error);
        gamesContainer.innerHTML = '<p>Ошибка загрузки игр. Попробуйте позже.</p>';
    }
}

// Загрузка раздела прогнозов
async function loadPredictionsSection() {
    const predictionsList = document.getElementById('predictions-list');
    if (!predictionsList) {
        console.warn('Элемент #predictions-list не найден в DOM');
        return;
    }

    predictionsList.innerHTML = '<p>Загружаем прогнозы...</p>';

    try {
        // Заглушка для отсутствующей функции
        const predictions = await mockLoadAndPredictMatches();

        if (predictions.length === 0) {
            predictionsList.innerHTML = '<p>Нет предстоящих матчей для прогноза.</p>';
            return;
        }

        predictionsList.innerHTML = ''; // Очищаем лоадер

        predictions.forEach(prediction => {
            const item = document.createElement('div');
            item.className = 'prediction-item';
            item.innerHTML = `
                <strong>${prediction.team1} vs ${prediction.team2}</strong><br>
                Прогноз: <strong>${prediction.predictedWinner}</strong><br>
                Вероятность: ${prediction.probability1}% vs ${prediction.probability2}%
            `;
            predictionsList.appendChild(item);
        });
    } catch (error) {
        console.error('Ошибка загрузки прогнозов:', error);
        predictionsList.innerHTML = '<p>Ошибка загрузки прогнозов. Попробуйте позже.</p>';
    }
}


// Обработчики навигации
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    if (navLinks.length === 0) {
        console.warn('.nav a не найдены в DOM');
        return;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            console.log(`Переход на ${href}`);
            // Здесь можно добавить логику динамической загрузки
        });
    });
}
