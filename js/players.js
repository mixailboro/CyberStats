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
        const matchesGame = !game || player.game === game;
        const matchesPosition = !position || player.position === position;
        const matchesSearch = player.name.toLowerCase().includes(search);
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
      <p><strong>Игра:</strong> ${player.game}</p>
      <p><strong>Команда:</strong> ${player.team || 'Свободный агент'}</p>
      <p><strong>Позиция:</strong> ${player.position || 'N/A'}</p>
      <p><strong>Рейтинг:</strong> ${player.rating || 'N/A'}</p>
    </div>
  `).join('');
}
