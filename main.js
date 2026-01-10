const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');
const resultImage = document.getElementById('result-image');

const DOG_IMAGE_URL = 'https://place.dog/300/200';
const CAT_IMAGE_URL = 'https://placekitten.com/300/200';

lottoBtn.addEventListener('click', () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  lottoNumbersDiv.textContent = sortedNumbers.join(', ');

  const lowNumbersCount = sortedNumbers.filter(n => n <= 20).length;
  const highNumbersCount = sortedNumbers.filter(n => n > 20).length;

  if (lowNumbersCount >= 4) {
    resultImage.src = DOG_IMAGE_URL;
    resultImage.style.display = 'block';
  } else if (highNumbersCount >= 4) {
    resultImage.src = CAT_IMAGE_URL;
    resultImage.style.display = 'block';
  } else {
    resultImage.src = '';
    resultImage.style.display = 'none';
  }
});