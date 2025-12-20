let currentIndex = 0;
const images = document.querySelectorAll('.carousel-inner img');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  images.forEach(img => img.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  images[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showSlide(currentIndex);
}

function goToSlide(index) {
  currentIndex = index;
  showSlide(currentIndex);
}

// Inicializar com a primeira imagem
showSlide(currentIndex);

// Opcional: Auto-play a cada 3 segundos
setInterval(nextSlide, 3000);