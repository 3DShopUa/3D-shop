const reviews = [
    {
        id: 1,
        author: "Олександр",
        stars: 5,
        date: "12.03.2026",
        text: "Замовив фігурку дракона. Якість просто бомба! Ніяких полос від друку майже не видно, заповнення міцне. Микита допоміг обрати пластик. Рекомендую!"
    },
    {
        id: 2,
        author: "Марія",
        stars: 5,
        date: "28.02.2026",
        text: "Дуже швидко надрукували тримач для навушників. Колір ідеально підійшов під стіл. Все приїхало Новою Поштою цілим."
    },
    {
        id: 3,
        author: "Артем",
        stars: 4,
        date: "15.02.2026",
        text: "Замовляв деталь для Scrap Mechanic (жартую, для моделі авто). Все круто, але трохи затримали на пошті. До самого друку претензій нуль!"
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