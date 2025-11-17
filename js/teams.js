document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие ключевых элементов
    const gameFilter = document.getElementById('game-filter');
    const searchInput = document.getElementById('search-input');
    const teamsList = document.getElementById('teams-list');

    if (!gameFilter || !searchInput || !teamsList) {
        console.error('Критические элементы DOM не найдены');
        return;
    }

    // Дебаунсинг для поиска (ждем 300 мс после ввода)
    let debounceTimer;
    const debouncedLoadTeams = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(loadTeams, 300);
    };

    // Слушатели событий
    gameFilter.addEventListener('change', loadTeams);
    searchInput.addEventListener('input', debouncedLoadTeams);

    // Инициализация
    loadTeams();
});

// Кэширование данных (чтобы не запрашивать повторно для одной игры)
const teamsCache = new Map();

async function loadTeams() {
    const gameFilter = document.getElementById('game-filter');
    const searchInput = document.getElementById('search-input');
    const teamsList = document.getElementById('teams-list');

    if (!gameFilter || !searchInput || !teamsList) return;

    const game = gameFilter.value;
    const search = searchInput.value.toLowerCase();

    // Показываем лоадер
    teamsList.innerHTML = '<p>Загружаем...</p>';

    try {
        // Проверяем кэш
        if (teamsCache.has(game)) {
            const teams = teamsCache.get(game);
        } else {
            // Запрашиваем данные
            const teams = await getTeams(game);
            teamsCache.set(game, teams); // Сохраняем в кэш
        }

        const filtered = teams.filter(team =>     // сука тут где-то!!!
            team.name.toLowerCase().includes(search)
        );

        if (filtered.length === 0) {
            teamsList.innerHTML = '<p>Команды не найдены.</p>';
            return;
        }

        // Безопасная генерация HTML (экранирование)
        const itemsHTML = filtered.map(team => {
            const escapedName = escapeHtml(team.name);
            const escapedGame = escapeHtml(team.game);
            const escapedCountry = escapeHtml(team.country || 'N/A');
            const escapedRating = escapeHtml(team.rating || 'N/A');

            return `
                <div class="item">
                    <h3>${escapedName}</h3>
                    <p><strong>Игра:</strong> ${escapedGame}</p>
                    <p><strong>Страна:</strong> ${escapedCountry}</p>
                    <p><strong>Рейтинг:</strong> ${escapedRating}</p>
                </div>
            `;
        }).join('');

        teamsList.innerHTML = itemsHTML;

    } catch (error) {
        console.error('Ошибка загрузки команд:', error);
        teamsList.innerHTML = `
            <p>Ошибка загрузки данных. Попробуйте позже.</p>
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

// Заглушка для getTeams (замените на реальный API‑запрос)
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: 'Bearer n0hTe2IWuZZmI7J07wuhV4PnwLJpa43dAIvajLE5itR8DPY1lq0'
    }
};

fetch('https://api.pandascore.co/teams?filter[videogame_id][0]=1&sort=acronym&page=1&per_page=50', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

