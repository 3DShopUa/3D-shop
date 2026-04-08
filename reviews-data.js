const reviews = [
    {
        id: 1,
        author: "Алімов Саша",
        stars: 4.5,
        date: "6.04.2026",
        text: "Хороший товар, якість достойна( за таку ціну) .  Трохи довга доставка та в цілому норм."
    },
    {
        id: 2,
        author: "",
        stars: 0,
        date: "28.02.2026",
        text: ""
    },
    {
        id: 3,
        author: "",
        stars: 0,
        date: "15.02.2026",
        text: ""
    }
];

function renderReviews() {
    const container = document.getElementById('reviews-container');
    reviews.forEach(rev => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.onclick = () => openReview(rev);
        
        let starsHtml = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
        
        card.innerHTML = `
            <div class="review-stars">${starsHtml}</div>
            <div class="review-author">${rev.author}</div>
            <div class="review-text-preview">${rev.text}</div>
            <div class="review-date">${rev.date}</div>
        `;
        container.appendChild(card);
    });
}

function openReview(rev) {
    const modal = document.getElementById('review-modal');
    document.getElementById('modal-author').innerText = rev.author;
    document.getElementById('modal-stars').innerText = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
    document.getElementById('modal-full-text').innerText = rev.text;
    document.getElementById('modal-date').innerText = rev.date;
    modal.style.display = 'flex';
}

function closeReview() {
    document.getElementById('review-modal').style.display = 'none';
}

// Закриття при кліку поза модалкою
window.onclick = (event) => {
    const modal = document.getElementById('review-modal');
    if (event.target == modal) modal.style.display = 'none';
}

// Запуск при завантаженні
document.addEventListener('DOMContentLoaded', renderReviews);
