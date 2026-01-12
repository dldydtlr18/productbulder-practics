const lottoBtn = document.getElementById('lotto-btn');
const lottoRows = document.querySelectorAll('.lotto-row');
const lottoGrid = document.getElementById('lotto-grid');

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
    commentEntryElement.innerHTML = `<strong>${commentEntryData.name}:</strong><p>${commentEntryData.commentText}</p>`; // Corrected commentText to commentData
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