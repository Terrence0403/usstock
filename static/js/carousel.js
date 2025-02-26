let currentIndex = 0;
const images = [
    '../static/images/newyork.jpg',
    '../static/images/wallstreet03.jpg',
    '../static/images/fifthave01.jpg',
    '../static/images/fifthave03.jpg',
    '../static/images/ussign02.jpg',
];

function showImage(index) {
    const carouselImages = document.querySelectorAll('.more .carousel img');
    carouselImages.forEach((img, i) => {
        if (i === index) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

// Set up the carousel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing carousel...');
    const carousel = document.querySelector('.more .carousel');
    
    if (!carousel) {
        console.error('Carousel container not found!');
        return;
    }
    
    images.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.position = 'absolute';
        if (index === 0) {
            img.classList.add('active');
        }
        carousel.appendChild(img);
        console.log('Added image:', imgUrl);
    });
    
    // Start automatic slideshow
    setInterval(nextImage, 5000);
    
    // Add button event listeners
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevImage);
        nextButton.addEventListener('click', nextImage);
        console.log('Added button event listeners');
    } else {
        console.error('Navigation buttons not found!');
    }
});
