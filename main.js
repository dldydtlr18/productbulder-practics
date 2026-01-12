const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');

lottoBtn.addEventListener('click', () => {
  lottoNumbersDiv.innerHTML = ''; // Clear previous numbers
  const labels = ['A', 'B', 'C', 'D', 'E'];
  for (let i = 0; i < 5; i++) {
    const row = document.createElement('div');
    row.classList.add('lotto-row');

    const label = document.createElement('span');
    label.classList.add('lotto-label');
    label.textContent = labels[i];
    row.appendChild(label);

    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
      const numberSpan = document.createElement('span');
      numberSpan.classList.add('lotto-number');
      numberSpan.textContent = number;
      row.appendChild(numberSpan);
    });

    lottoNumbersDiv.appendChild(row);
  }
});