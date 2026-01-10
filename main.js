console.log('main.js loaded');

const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');

console.log('Elements found:', { lottoBtn, lottoNumbersDiv });

lottoBtn.addEventListener('click', () => {
  console.log('Button clicked!');
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  console.log('Generated numbers:', sortedNumbers);
  lottoNumbersDiv.textContent = sortedNumbers.join(', ');
});