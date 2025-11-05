
// Расчёт вероятности победы
function calculateWinProbability(team1Rating, team2Rating) {
    const diff = team1Rating - team2Rating;
    const probability = 1 / (1 + Math.pow(10, -diff / 400));
    return probability;
}

// Прогнозирование исхода
async function predictMatchOutcome(match) {
    // Получаем рейтинги команд (пример)
    const team1Rating = match.team1.rating || 1500;
    const team2Rating = match.team2.rating || 1500;

    const prob1 = calculateWinProbability(team1Rating, team2Rating);
    const prob2 = 1 - prob1;

    return {
        matchId: match.id,
        team1: match.team1.name,
        team2: match.team2.name,
        probability1: Math.round(prob1 * 100),
        probability2: Math.round(prob2 * 100),
        predictedWinner: prob1 > prob2 ? match.team1.name : match.team2.name
    };
}

// Загрузка и прогнозирование предстоящих матчей
async function loadAndPredictMatches() {
    const matches = await getMatches('cs2'); // Пример для CS2
    const predictions = [];

    for (const match of matches) {
        const prediction = await predictMatchOutcome(match);
        predictions.push(prediction);
    }

    return predictions;
}