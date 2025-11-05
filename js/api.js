const API_KEY = 'n0hTe2IWuZZmI7J07wuhV4PnwLJpa43dAIvajLE5itR8DPY1lq0';

// Универсальный метод для запросов к API
async function fetchPandaData(endpoint, params = {}) {
    try {
        // Исправлен протокол: было "https://", стало "https://"
        const url = new URL(`https://api.pandascore.co/${endpoint}`);
        console.log(url);
        // Добавляем параметры запроса
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(response);
        }

        return await response.json();

    } catch (error) {
        console.error('Ошибка API:', error);
        throw error; // Передаём ошибку выше для обработки
    }
}

// Получение турниров (с фильтрацией по игре и статусу)
async function getTournaments(game, status = 'upcoming') {
    const params = {
        'filter"game"': game,
        'filter"status"': status,
        'page"size"': 20
    };
    return fetchPandaData('tournaments', params);
}

// Получение команд (по игре)
async function getTeams(game) {
    const params = {
        'filter"game"': game,
        'page"size"': 20
    };
    return fetchPandaData('teams', params);
}

// Получение игроков (по игре)
async function getPlayers(game) {
    const params = {
        'filter"game"': game,
        'page"size"': 20
    };
    return fetchPandaData('players', params);
}

// Пример использования
(async () => {
    try {
        // Получаем турниры по Dota 2
        const tournaments = await getTournaments('dota2', 'upcoming');
        console.log('Ближайшие турниры Dota 2:', tournaments);

        // Получаем команды по CS2
        const teams = await getTeams('cs2');
        console.log('Команды CS2:', teams);

        // Получаем игроков по LoL
        const players = await getPlayers('lol');
        console.log('Игроки LoL:', players);

    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
})();


