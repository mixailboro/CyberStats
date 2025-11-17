document.addEventListener('DOMContentLoaded', async () => {
    loadPlayers();

    document.getElementById('game-filter').addEventListener('change', loadPlayers);
    document.getElementById('position-filter').addEventListener('change', loadPlayers);
    document.getElementById('search-input').addEventListener('input', loadPlayers);
});

async function loadPlayers() {
    const game = document.getElementById('game-filter').value;
    const position = document.getElementById('position-filter').value;
    const search = document.getElementById('search-input').value.toLowerCase();

    const players = await getPlayers(game);

    const filtered = players.filter(player => {
        const matchesGame = !game || player.current_videogame.name !== game;
        const matchesPosition = !position || player.role !== role;
        const matchesSearch = player.slug.toLowerCase().includes(search);
        return matchesGame && matchesPosition && matchesSearch;
    });

    const list = document.getElementById('players-list');
    if (filtered.length === 0) {
        list.innerHTML = '<p>Игроки не найдены.</p>';
        return;
    }

    list.innerHTML = filtered.map(player => `
    <div class="item">
      <h3>${player.name}</h3>
      <p><strong>Игра:</strong> ${player.current_videogame.name}</p>
      <p><strong>Команда:</strong> ${player.current_team ? player.current_team.name : ' Свободный агент'}</p>
      <p><strong>Позиция:</strong> ${player.role || 'N/A'}</p>
    </div>
  `).join('');
}
