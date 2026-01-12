const lottoBtn = document.getElementById('lotto-btn');
const lottoRows = document.querySelectorAll('.lotto-row');
const numberSelectionContainer = document.getElementById('number-selection-container');

const selectedNumbers = new Set();

// Create number selection buttons
for (let i = 1; i <= 45; i++) {
  const btn = document.createElement('button');
  btn.classList.add('number-btn');
  btn.textContent = i;
  btn.addEventListener('click', () => {
    if (selectedNumbers.has(i)) {
      selectedNumbers.delete(i);
      btn.classList.remove('selected');
    } else {
      if (selectedNumbers.size < 6) {
        selectedNumbers.add(i);
        btn.classList.add('selected');
      }
    }
  });
  numberSelectionContainer.appendChild(btn);
}

lottoBtn.addEventListener('click', () => {
  const finalNumbers = new Set(selectedNumbers);

  while (finalNumbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    if (!finalNumbers.has(randomNumber)) {
      finalNumbers.add(randomNumber);
    }
  }

  const sortedNumbers = Array.from(finalNumbers).sort((a, b) => a - b);

  // Update only the first row (A)
  const firstRow = lottoRows[0];
  const numberSpans = firstRow.querySelectorAll('.lotto-number');
  numberSpans.forEach((span, index) => {
    span.textContent = sortedNumbers[index];
  });
  
  // Clear the other rows
  for (let i = 1; i < lottoRows.length; i++) {
    const row = lottoRows[i];
    const numberSpans = row.querySelectorAll('.lotto-number');
    numberSpans.forEach(span => {
      span.textContent = '?';
    });
  }

  // Clear selection
  selectedNumbers.clear();
  document.querySelectorAll('.number-btn.selected').forEach(btn => {
    btn.classList.remove('selected');
  });
});