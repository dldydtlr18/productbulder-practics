const lottoBtn = document.getElementById('lotto-btn');
const lottoRows = document.querySelectorAll('.lotto-row');
const lottoGrid = document.getElementById('lotto-grid');

const selectedNumbers = new Set();

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
      if (selectedNumbers.size < 6) {
        selectedNumbers.add(i);
        gridNumber.classList.add('selected');
      }
    }
  });
  lottoGrid.appendChild(gridNumber);
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

  // Clear selection
  selectedNumbers.clear();
  document.querySelectorAll('.grid-number.selected').forEach(gridNumber => {
    gridNumber.classList.remove('selected');
  });
});

const commentForm = document.getElementById('comment-form');
const commentNameInput = document.getElementById('comment-name');
const commentTextInput = document.getElementById('comment-text');
const commentsDisplay = document.getElementById('comments-display');

const comments = []; // Array to store comments

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

    // Clear and re-render comments display
    commentsDisplay.innerHTML = '';
    comments.forEach(commentEntryData => {
      const commentEntryElement = document.createElement('div');
      commentEntryElement.classList.add('comment-entry');
      commentEntryElement.innerHTML = `<strong>${commentEntryData.name}:</strong><p>${commentEntryData.commentText}</p>`;
      commentsDisplay.appendChild(commentEntryElement);
    });

    // Clear input fields
    commentNameInput.value = '';
    commentTextInput.value = '';
  }
});