document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
    });
  }

  const cards = document.querySelectorAll('.project-card');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (cards.length && prevBtn && nextBtn) {
    let current = 0;

    function updateCards(direction = 'right') {
      cards.forEach((card, index) => {
        card.classList.remove('active', 'slide-left', 'slide-right');
        if (index === current) {
          card.classList.add('active');
          card.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');

          setTimeout(() => {
            card.classList.remove('slide-left', 'slide-right');
          }, 600);
        }
      });
    }

    prevBtn.addEventListener('click', () => {
      current = (current - 1 + cards.length) % cards.length;
      updateCards('left');
    });

    nextBtn.addEventListener('click', () => {
      current = (current + 1) % cards.length;
      updateCards('right');
    });

    updateCards(); // initialize
  }
});
