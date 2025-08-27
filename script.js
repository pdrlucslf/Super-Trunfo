// 1. Definindo as cartas do nosso baralho
const deck = [
    {
        nome: "Dragão Vermelho",
        ataque: 95,
        defesa: 80,
        magia: 70
    },
    {
        nome: "Elfo Arqueiro",
        ataque: 75,
        defesa: 60,
        magia: 85
    },
    {
        nome: "Anão Guerreiro",
        ataque: 85,
        defesa: 95,
        magia: 40
    },
    {
        nome: "Mago das Sombras",
        ataque: 60,
        defesa: 70,
        magia: 98
    },
    {
        nome: "Golem de Pedra",
        ataque: 80,
        defesa: 100,
        magia: 20
    }
];

// 2. Pegando os elementos do HTML que vamos manipular
const playerCardElement = document.getElementById('player-card');
const opponentCardElement = document.getElementById('opponent-card');
const resultElement = document.getElementById('result');
const playButton = document.getElementById('play-button');

let playerCard, opponentCard;

// 3. Função para exibir uma carta na tela
function displayCard(card, element) {
    element.innerHTML = `
        <h3>${card.nome}</h3>
        <p>Ataque: ${card.ataque}</p>
        <p>Defesa: ${card.defesa}</p>
        <p>Magia: ${card.magia}</p>
    `;
}

// 4. Função principal que executa quando o botão "Jogar" é clicado
function playGame() {
    // Sorteia um índice aleatório para o jogador e o oponente
    const playerIndex = Math.floor(Math.random() * deck.length);
    let opponentIndex;

    // Garante que o oponente não tenha a mesma carta que o jogador
    do {
        opponentIndex = Math.floor(Math.random() * deck.length);
    } while (opponentIndex === playerIndex);

    playerCard = deck[playerIndex];
    opponentCard = deck[opponentIndex];

    // Mostra as cartas sorteadas na tela
    displayCard(playerCard, playerCardElement);
    displayCard(opponentCard, opponentCardElement);

    // Compara o atributo "ataque" (pode ser qualquer um)
    if (playerCard.ataque > opponentCard.ataque) {
        resultElement.textContent = "Você Venceu!";
        resultElement.style.color = "green";
    } else if (playerCard.ataque < opponentCard.ataque) {
        resultElement.textContent = "Você Perdeu!";
        resultElement.style.color = "red";
    } else {
        resultElement.textContent = "Empate!";
        resultElement.style.color = "orange";
    }
}

// 5. Adiciona o "ouvinte de evento" ao botão. Quando clicado, chama a função playGame
playButton.addEventListener('click', playGame);