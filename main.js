const lottoBtn = document.getElementById('lotto-btn');
const lottoRows = document.querySelectorAll('.lotto-row');

lottoBtn.addEventListener('click', () => {
  lottoRows.forEach(row => {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    
    const numberSpans = row.querySelectorAll('.lotto-number');
    numberSpans.forEach((span, index) => {
      span.textContent = sortedNumbers[index];
    });
  });
});