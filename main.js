const lottoBtn = document.getElementById('lotto-btn');
const lottoRows = document.querySelectorAll('.lotto-row');
const lottoGrid = document.getElementById('lotto-grid');
const apiWinningNumbersDiv = document.getElementById('api-winning-numbers');

const selectedNumbers = new Set();
const allGridNumberButtons = []; // Store references to all grid number buttons

// Function to reset selection
function resetSelection() {
  selectedNumbers.clear();
  allGridNumberButtons.forEach(btn => {
    btn.classList.remove('selected');
  });
}

// Create number grid
for (let i = 1; i <= 45; i++) {
  const gridNumber = document.createElement('div');
  gridNumber.classList.add('grid-number');
  gridNumber.textContent = i;
  gridNumber.addEventListener('click', () => {
    if (selectedNumbers.has(i)) {
      selectedNumbers.delete(i);
      gridNumber.classList.remove('selected');
    } else {
      if (selectedNumbers.size === 6) { // If 6 numbers are already selected, reset before selecting new one
        resetSelection();
      }
      selectedNumbers.add(i);
      gridNumber.classList.add('selected');
    }
  });
  lottoGrid.appendChild(gridNumber);
  allGridNumberButtons.push(gridNumber); // Store reference
}

lottoBtn.addEventListener('click', () => {
  lottoRows.forEach(row => {
    const finalNumbers = new Set(selectedNumbers);
    while (finalNumbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      if (!finalNumbers.has(randomNumber)) {
        finalNumbers.add(randomNumber);
      }
    }
    const sortedNumbers = Array.from(finalNumbers).sort((a, b) => a - b);
    
    const numberSpans = row.querySelectorAll('.lotto-number');
    numberSpans.forEach((span, index) => {
      span.textContent = sortedNumbers[index];
    });
  });

  // Keep selection visible after generation, do not clear here
});

const commentForm = document.getElementById('comment-form');
const commentNameInput = document.getElementById('comment-name');
const commentTextInput = document.getElementById('comment-text');
const commentsDisplay = document.getElementById('comments-display');

// Initialize comments from localStorage
let comments = JSON.parse(localStorage.getItem('lottoComments')) || [];

function renderComments() {
  commentsDisplay.innerHTML = '';
  comments.forEach(commentEntryData => {
    const commentEntryElement = document.createElement('div');
    commentEntryElement.classList.add('comment-entry');
    commentEntryElement.innerHTML = `<strong>${commentEntryData.name}:</strong><p>${commentEntryData.commentText}</p>`;
    commentsDisplay.appendChild(commentEntryElement);
  });
}

// Render comments on page load
renderComments();

commentForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const name = commentNameInput.value.trim();
  const commentText = commentTextInput.value.trim();

  if (name && commentText) {
    // Add new comment
    comments.push({ name, commentText });

    // Enforce maximum of 100 comments
    if (comments.length > 100) {
      comments.shift(); // Remove the oldest comment
    }

    // Save comments to localStorage
    localStorage.setItem('lottoComments', JSON.stringify(comments));

    // Re-render comments display
    renderComments();

    // Clear input fields
    commentNameInput.value = '';
    commentTextInput.value = '';
  }
});

// --- API Integration for Winning Numbers ---

async function getLatestRoundNumber() {
  const mainPageUrl = `https://www.dhlottery.co.kr/common.do?method=main`;
  try {
    const response = await fetch(mainPageUrl);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    // Attempt to find the latest round number using the correct selector
    const latestRoundElement = doc.querySelector('.lotto_round strong');
    if (latestRoundElement) {
      const roundMatch = latestRoundElement.textContent.match(/\d+/);
      if (roundMatch) {
        return parseInt(roundMatch[0]);
      }
    }
    // Fallback if selector fails or not found
    console.warn('Could not dynamically determine latest round number. Falling back to default.');
    return 1206; // Fallback to a known recent round
  } catch (error) {
    console.error('Error fetching latest round number:', error);
    return 1206; // Fallback on error
  }
}

async function fetchAndDisplayWinningNumbers(roundNumber) {
  const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${roundNumber}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json(); // Expect JSON now

    if (data.returnValue === 'success') {
      const winningNumbers = [
        data.drwtNo1, data.drwtNo2, data.drwtNo3,
        data.drwtNo4, data.drwtNo5, data.drwtNo6
      ].sort((a, b) => a - b);
      const bonusNumber = data.bnusNo;
      const drwNoDate = data.drwNoDate;

      let winningNumbersHtml = `<h4>${roundNumber}회 당첨결과 (${drwNoDate})</h4>`;
      winningNumbersHtml += `<div class="winning-numbers-display">`;
      winningNumbers.forEach(num => {
        winningNumbersHtml += `<span class="winning-number-ball">${num}</span>`;
      });
      winningNumbersHtml += `<span class="bonus-number-plus">+</span>`;
      winningNumbersHtml += `<span class="winning-number-ball bonus-number-ball">${bonusNumber}</span>`;
      winningNumbersHtml += `</div>`;

      apiWinningNumbersDiv.innerHTML = winningNumbersHtml;
    } else {
      apiWinningNumbersDiv.innerHTML = `<p>최신 로또 당첨 번호를 불러오는데 실패했습니다. (${data.returnValue})</p>`;
    }
  } catch (error) {
    console.error('Error fetching lotto winning numbers:', error);
    apiWinningNumbersDiv.innerHTML = `<p>로또 당첨 번호를 불러오는 중 오류가 발생했습니다.</p>`;
  }
}

// Fetch and display winning numbers on page load
(async () => {
  const latestRound = await getLatestRoundNumber();
  fetchAndDisplayWinningNumbers(latestRound);
})();