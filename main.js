const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');

lottoBtn.addEventListener('click', () => {
  lottoNumbersDiv.innerHTML = ''; // Clear previous numbers
  for (let i = 0; i < 5; i++) {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    const numbersString = sortedNumbers.join(', ');
    const p = document.createElement('p');
    p.textContent = numbersString;
    lottoNumbersDiv.appendChild(p);
  }
});