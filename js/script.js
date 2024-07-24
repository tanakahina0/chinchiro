let rollCount = 0;
let history = [];
let users = [];
let currentUserIndex = 0;
let parentIndex = -1;
let roundCount = 0;
document.getElementById('addUserButton').addEventListener('click', addUser);
document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('rollButton').addEventListener('click', rollDice);
document.getElementById('nextUserButton').addEventListener('click', nextUser);
function addUser() {
    const userName = document.getElementById('userNameInput').value.trim();
    const isParent = document.getElementById('isParentCheckbox').checked;
    if (userName && (parentIndex === -1 || !isParent)) {
        users.push({ name: userName, isParent: isParent });
        if (isParent) {
            parentIndex = users.length - 1;
            document.getElementById('isParentCheckbox').disabled = true;
        }
        document.getElementById('userNameInput').value = '';
        document.getElementById('isParentCheckbox').checked = false;
        updateStartButton();
    }
}
function updateStartButton() {
    document.getElementById('startGameButton').disabled = users.length === 0 || parentIndex === -1;
}
function startGame() {
    document.getElementById('userInputContainer').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';
    currentUserIndex = parentIndex;
    document.getElementById('rollButton').disabled = false;
    document.getElementById('nextUserButton').disabled = true;
    updateCurrentUser();
}
function rollDice() {
    rollCount++;
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;
    document.getElementById('dice3').textContent = dice3;
    const result = getResult(dice1, dice2, dice3);
    if (result !== '目無し' || rollCount === 3) {
        document.getElementById('result').textContent = `結果: ${result}`;
        document.getElementById('rollButton').disabled = true;
        document.getElementById('nextUserButton').disabled = false;
        addToHistory(users[currentUserIndex].name, result, [dice1, dice2, dice3], users[currentUserIndex].isParent);
    } else {
        document.getElementById('result').textContent = `結果: 目無し。もう一度振ってください。 (${rollCount}/3)`;
    }
}
function getResult(dice1, dice2, dice3) {
    const dice = [dice1, dice2, dice3];
    dice.sort();

    if (dice[0] === 1 && dice[1] === 2 && dice[2] === 3) {
        return 'ヒフミ';
    }
    if (dice[0] === 4 && dice[1] === 5 && dice[2] === 6) {
        return 'シゴロ';
    }
    if (dice[0] === 1 && dice[1] === 1 && dice[2] === 1) {
        return 'ピンゾロ';
    }
    if (dice[0] === dice[1] && dice[1] === dice[2]) {
        return `アラシ (${dice1})`;
    }
    if (dice[0] === dice[1]) {
        return `${dice[2]}の目`;
    }
    if (dice[1] === dice[2]) {
        return `${dice[0]}の目`;
    }
    return '目無し';
}
function nextUser() {
    rollCount = 0;
    document.getElementById('dice1').textContent = '-';
    document.getElementById('dice2').textContent = '-';
    document.getElementById('dice3').textContent = '-';
    document.getElementById('result').textContent = '結果: -';
    document.getElementById('rollButton').disabled = false;
    document.getElementById('nextUserButton').disabled = true;
    if (currentUserIndex === parentIndex) {
        roundCount++;
    }
    currentUserIndex = (currentUserIndex + 1) % users.length;
    if (roundCount === users.length) {
        parentIndex = (parentIndex + 1) % users.length;
        roundCount = 0;
        currentUserIndex = parentIndex;
    }
    updateCurrentUser();
}
function updateCurrentUser() {
    const currentUser = users[currentUserIndex];
    document.getElementById('result').textContent = `現在のプレイヤー: ${currentUser.isParent ? '親: ' : ''}${currentUser.name}`;
}
function addToHistory(user, result, dice, isParent) {
    const historyEntry = `${isParent ? '親: ' : ''}${user} - 結果: ${result}, サイコロ: [${dice.join(', ')}]`;
    history.push(historyEntry);
    document.getElementById('history').innerHTML = history.map(entry => `<div>${entry}</div>`).join('');
}

function audio() {
    document.getElementById('btn_audio').currentTime = 0;
    document.getElementById('btn_audio').play();
}
