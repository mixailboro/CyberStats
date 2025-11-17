document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTournaments();

        // Проверяем наличие элементов перед добавлением обработчиков
        const gameFilter = document.getElementById('game-filter');
        const statusFilter = document.getElementById('status-filter');

        if (gameFilter) {
            gameFilter.addEventListener('change', loadTournaments);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', loadTournaments);
        }
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
});

async function loadTournaments() {
    const gameFilter = document.getElementById('game-filter');
    const statusFilter = document.getElementById('status-filter');
    const list = document.getElementById('tournaments-list');

    // Проверка существования элементов
    if (!gameFilter || !statusFilter || !list) {
        console.warn('Один из элементов DOM не найден');
        return;
    }

    // Получаем текущие значения фильтров
    const game = gameFilter.value;
    const status = statusFilter.value;

    // Показываем индикатор загрузки
    list.innerHTML = '<p>Загружаем турниры...</p>';

    try {
        const tournaments = await getTournaments(game, status);

        if (!tournaments || tournaments.length === 0) {
            list.innerHTML = '<p>Турниры не найдены.</p>';
            return;
        }

        // Безопасная генерация HTML (экранирование)
        const itemsHTML = tournaments.map(tourn => {
            const escapedName = escapeHtml(tourn.name || 'N/A');
            const escapedGame = escapeHtml(tourn.videogame.name || 'N/A');
            const escapedStart = escapeHtml(tourn.begin_at || 'N/A');
            const escapedEnd = escapeHtml(tourn.end_at || 'N/A');
            const escapedCount = tourn.matches.length;
            const prizePool = tourn.prizepool ? `$${tourn.prizepool}` : 'N/A';

            return `
                <div class="item">
                    <h3>${escapedName}</h3>
                    <p><strong>Игра:</strong> ${escapedGame}</p>
                    <p><strong>Даты:</strong> ${escapedStart} – ${escapedEnd}</p>
                    <p><strong>Количество игр:</strong> ${escapedCount}</p>
                    <p><strong>Призовой фонд:</strong> ${escapeHtml(prizePool)}</p>
                </div>
            `;
        }).join('');

        list.innerHTML = itemsHTML;

    } catch (error) {
        console.error('Ошибка загрузки турниров:', error);
        list.innerHTML = `
            <p>Ошибка загрузки турниров. Попробуйте позже.</p>
            <p><small>${error.message}</small></p>
        `;
    }
}

// Функция для экранирования HTML (защита от XSS)
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
