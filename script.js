// ========================================
// DARK MODE TOGGLE
// ========================================

const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

// ========================================
// NAVBAR - HAMBURGER MENU
// ========================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========================================
// NAVBAR - SCROLL BEHAVIOR
// ========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// SCROLL INDICATOR
// ========================================

const scrollIndicator = document.getElementById('scrollIndicator');
const aboutPreview = document.getElementById('aboutPreview');

if (scrollIndicator && aboutPreview) {
    scrollIndicator.addEventListener('click', () => {
        aboutPreview.scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// CAROUSEL
// ========================================

const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');

if (carouselTrack) {
    const cards = document.querySelectorAll('.project-card');
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Create dots
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');
    
    function updateCarousel() {
        const offset = -currentIndex * (100 + 3); // 100% width + gap
        carouselTrack.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Prevent default link behavior when clicking carousel buttons
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only prevent if we're dragging (for potential future drag functionality)
            // For now, links work normally
        });
    });
    
    // Auto-play carousel (optional)
    // setInterval(nextSlide, 5000);
}

// ========================================
// FAQ MODAL
// ========================================

const faqTrigger = document.getElementById('faqTrigger');
const faqOverlay = document.getElementById('faqOverlay');
const faqClose = document.getElementById('faqClose');
const faqQuestions = document.querySelectorAll('.faq-question');

// Open FAQ
faqTrigger.addEventListener('click', () => {
    faqOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close FAQ
faqClose.addEventListener('click', closeFAQ);
faqOverlay.addEventListener('click', (e) => {
    if (e.target === faqOverlay) {
        closeFAQ();
    }
});

function closeFAQ() {
    faqOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// FAQ Accordion
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Close FAQ with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && faqOverlay.classList.contains('active')) {
        closeFAQ();
    }
});

// ========================================
// INTERSECTION OBSERVER - ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('.about-preview, .selected-work').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// ========================================
// CARD STACK - DRAG AND DROP / SWIPE
// ========================================

const cardStack = document.getElementById('cardStack');

if (cardStack) {
    const cards = Array.from(document.querySelectorAll('.fact-card'));
    const factDisplay = document.getElementById('factDisplay');
    const currentCardElement = document.getElementById('currentCard');
    const totalCardsElement = document.getElementById('totalCards');
    
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    if (totalCardsElement) {
        totalCardsElement.textContent = cards.length;
    }
    
    function updateFactDisplay() {
        const activeCard = getActiveCard();
        const factText = activeCard.getAttribute('data-fact');
        
        if (factDisplay) {
            factDisplay.classList.remove('active');
            
            setTimeout(() => {
                factDisplay.textContent = factText;
                factDisplay.classList.add('active');
            }, 200);
        }
        
        if (currentCardElement) {
            currentCardElement.textContent = currentIndex + 1;
        }
    }
    
    function getActiveCard() {
        return cards[currentIndex];
    }
    
    function removeCard() {
        const card = getActiveCard();
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${currentX > 0 ? '150%' : '-150%'}) rotate(${currentX > 0 ? '20deg' : '-20deg'})`;
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.classList.remove('active');
            card.style.transition = '';
            card.style.transform = '';
            card.style.opacity = '';
            cardStack.appendChild(card);
            
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].classList.add('active');
            updateFactDisplay();
            resetCardPositions();
        }, 500);
    }
    
    function resetCardPositions() {
        cards.forEach((card, index) => {
            const relativeIndex = (index - currentIndex + cards.length) % cards.length;
            card.style.zIndex = cards.length - relativeIndex;
            
            if (relativeIndex === 0) {
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
            } else if (relativeIndex === 1) {
                card.style.transform = 'scale(0.98)';
                card.style.opacity = '0.9';
            } else if (relativeIndex === 2) {
                card.style.transform = 'scale(0.96)';
                card.style.opacity = '0.8';
            } else if (relativeIndex === 3) {
                card.style.transform = 'scale(0.94)';
                card.style.opacity = '0.7';
            } else if (relativeIndex === 4) {
                card.style.transform = 'scale(0.92)';
                card.style.opacity = '0.6';
            } else if (relativeIndex === 5) {
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0.5';
            } else if (relativeIndex === 6) {
                card.style.transform = 'scale(0.88)';
                card.style.opacity = '0.4';
            } else {
                card.style.transform = 'scale(0.86)';
                card.style.opacity = '0.3';
            }
        });
    }
    
    // Mouse events
    cardStack.addEventListener('mousedown', (e) => {
        if (e.target.closest('.fact-card') === getActiveCard()) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            getActiveCard().style.transition = 'none';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        const card = getActiveCard();
        const rotation = currentX * 0.1;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(currentX) / 400;
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const card = getActiveCard();
        
        if (Math.abs(currentX) > 150) {
            removeCard();
        } else {
            card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            card.style.transform = '';
            card.style.opacity = '';
        }
        
        currentX = 0;
        currentY = 0;
    });
    
    // Touch events for mobile
    cardStack.addEventListener('touchstart', (e) => {
        if (e.target.closest('.fact-card') === getActiveCard()) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            getActiveCard().style.transition = 'none';
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        
        const card = getActiveCard();
        const rotation = currentX * 0.1;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(currentX) / 400;
    });
    
    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const card = getActiveCard();
        
        if (Math.abs(currentX) > 100) {
            removeCard();
        } else {
            card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            card.style.transform = '';
            card.style.opacity = '';
        }
        
        currentX = 0;
        currentY = 0;
    });
    
    // Initialize
    cards[0].classList.add('active');
    resetCardPositions();
    updateFactDisplay();
}

// ========================================
// PROJECTS PAGE - TAB SWITCHING
// ========================================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ========================================
// STORYBOARD CAROUSEL
// ========================================

const storyboardTrack = document.getElementById('storyboardTrack');
const storyboardPrev = document.getElementById('storyboardPrev');
const storyboardNext = document.getElementById('storyboardNext');
const storyboardDots = document.getElementById('storyboardDots');

if (storyboardTrack) {
    const slides = document.querySelectorAll('.storyboard-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToStoryboardSlide(i));
        storyboardDots.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('#storyboardDots .dot');
    
    function updateStoryboardCarousel() {
        const offset = -currentIndex * (100 + (window.innerWidth <= 768 ? 1.5 : 2.5));
        storyboardTrack.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToStoryboardSlide(index) {
        currentIndex = index;
        updateStoryboardCarousel();
    }
    
    function nextStoryboardSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateStoryboardCarousel();
    }
    
    function prevStoryboardSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateStoryboardCarousel();
    }
    
    // Desktop button controls
    if (storyboardNext) storyboardNext.addEventListener('click', nextStoryboardSlide);
    if (storyboardPrev) storyboardPrev.addEventListener('click', prevStoryboardSlide);
    
    // Mobile Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isDragging = false;
    
    storyboardTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        storyboardTrack.style.transition = 'none';
    }, { passive: true });
    
    storyboardTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            const currentOffset = -currentIndex * 101.5;
            const dragOffset = (deltaX / window.innerWidth) * 100;
            storyboardTrack.style.transform = `translateX(${currentOffset + dragOffset}%)`;
        }
    }, { passive: false });
    
    storyboardTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        storyboardTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only handle horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                // Swiped left - go to next slide
                nextStoryboardSlide();
            } else {
                // Swiped right - go to previous slide
                prevStoryboardSlide();
            }
        } else {
            // Not enough swipe distance, snap back
            updateStoryboardCarousel();
        }
        
        touchStartX = 0;
        touchEndX = 0;
        touchStartY = 0;
        touchEndY = 0;
    }, { passive: true });
}

// ========================================
// WIREFRAME VIEWER - UNIVERSAL
// ========================================

// Check if we're on a project page with wireframes
const wireframeImage = document.getElementById('wireframeImage');
const wireframeTitle = document.getElementById('wireframeTitle');
const wireframeDescription = document.getElementById('wireframeDescription');
const prevWireframe = document.getElementById('prevWireframe');
const nextWireframe = document.getElementById('nextWireframe');

// Only initialize if wireframe elements exist on the page
if (wireframeImage && wireframeTitle && wireframeDescription) {
    
    // Detect which project page we're on and load appropriate data
    let wireframeData = [];
    
    // Check the page URL or a data attribute to determine which project
    const pageUrl = window.location.pathname;
    
    if (pageUrl.includes('nana.html')) {
        wireframeData = [
            {
                image: "nana/Home-Page-Mockup.jpg",
                title: "Home Page",
                description: `
                    <p>The Home Page was designed to immediately engage users with personalized recommendations and relevant offers. At the top, three call-to-action sections (CTAs) provide quick access to curated content:</p>
                    <ul>
                        <li><strong>Today's New Pick:</strong> A daily title recommendation based on the user's wishlist, ratings, or past purchases.</li>
                        <li><strong>Keep Reading:</strong> Suggests the next volume in an ongoing series.</li>
                        <li><strong>Similar Titles:</strong> Shows related manga based on the user's history.</li>
                    </ul>
                    <p>Below these CTAs, the Sales & Deals section highlights manga currently on discount, ensuring users never miss limited-time offers. Finally, the Bestsellers section displays the top ten most purchased and highest-rated titles on the platform, reinforcing trust and helping new users explore popular reads.</p>
                `
            },
            {
                image: "nana/User-Page-Mockup.jpg",
                title: "User Page",
                description: `
                    <p>The User Page gives each user a personalized hub for managing their activity.</p>
                    <p>At the top, Past Orders displays previously purchased manga, sorted from newest to oldest, showing each title's cover for quick recognition.</p>
                    <p>The Titles to Finish section lists ongoing series based on purchase history, showing the user's current volume and how many remain. Each title includes a CTA linking directly to its next available volume.</p>
                    <p>Below, users can access account and support options such as "Your Orders," "Payments," and "Payment Methods." A dedicated Customer Service button connects users to a live agent when assistance is needed.</p>
                `
            },
            {
                image: "nana/Wishlist-Page-Mockup.jpg",
                title: "Wishlist Page",
                description: `
                    <p>The Wishlist Page serves as a personalized space for users to organize the titles they plan to buy. By default, the list displays saved items from oldest to newest, but users can easily adjust the sorting method or search for specific titles by name.</p>
                    <p>Each entry can represent either a single volume or an entire series. When a specific volume is selected, the app clearly indicates it, ensuring users know exactly what they've saved.</p>
                    <p>Every card includes the title, cover image (showing the selected volume or the first volume by default), rating, price, and an "Add to Cart" button — allowing users to move seamlessly from planning to purchasing.</p>
                `
            },
            {
                image: "nana/Product-Page.jpg",
                title: "Product Page",
                description: `
                    <p>The Product Page focuses on presenting all essential information about each manga title in a clean and visually engaging layout. It displays the cover, title, price, rating, release date, author, and volume number, allowing users to quickly evaluate the product before purchasing.</p>
                    <p>Users can view both the front and back covers for a more complete look at the item. A heart icon lets them easily add or remove the title from their wishlist directly from this page.</p>
                    <p>A fixed "Add to Bag" button remains visible at the bottom of the screen, allowing users to add the product to their cart and choose the desired quantity with a single tap. An "X" button serves as a simple return option, taking the user back to the previous screen without breaking the browsing flow.</p>
                `
            }
        ];
    } else if (pageUrl.includes('notebox.html')) {
        // NoteBox wireframe data will go here
        wireframeData = [
            {
                image: "notebox/NoteBox Wireframes.jpg",
                title: "Home Page",
                description: `
                    <p>The Home Page was designed to immediately draw users into the NoteBox experience by blending social interaction and progress tracking.</p>
                    <p>The first section, “What your friends are listening to,” highlights real-time activity across the user’s network, displaying which albums or artists their friends are currently enjoying, complete with friend tags for easy recognition. This feature encourages engagement and discovery through shared listening habits.</p>
                    <p>The second section, “Your Challenges,” focuses on gamified engagement. It displays the user’s active challenges and progress in percentage form, while also suggesting new challenges based on their listening history and behavioral data. Whether users are exploring a new genre or completing a themed badge, this area keeps them motivated to interact with the platform consistently.</p>
                `
            },
            {
                image: "notebox/NoteBox Wireframes (1).jpg",
                title: "User Page",
                description: `
                    <p>The User Page gives each user the freedom to personalize their profile and showcase their music journey within the app.</p>
                    <p>At the top, users can view key stats such as their total number of reviews, followers, and following count, giving a quick overview of their community presence.</p>
                    <p>Beneath that, the Top 9 section displays the user’s favorite albums, complete with album titles and artist names — a personalized snapshot of their current taste. This page also features the Monthly Listening Stats area, where users can explore how many minutes they’ve listened to each month. Selecting the current month provides live, up-to-date data synced with their listening history.</p>
                    <p>At the bottom, users can view their earned badges and ongoing or completed challenges, giving them a clear visual of their achievements and progress. This section reinforces NoteBox’s gamified identity by celebrating consistency and engagement.</p>
                `
            },
            {
                image: "notebox/NoteBox Wireframes (2).jpg",
                title: "Album Page",
                description: `
                    <p>The Album Page serves as a central hub for exploring and reviewing a selected album, combining critical details, community insights, and personalized discovery.</p>
                    <p>At the top, users can access essential album information such as the cover art, artist name, release date, and rating. They can also read or write their own album reviews directly on this page, making it the core space for sharing opinions and experiences.</p>
                    <p>A social feature highlights whether friends or followers have reviewed or saved the album, working similarly to how users can see mutual connections on social media. This creates an interactive layer that encourages conversation and shared discovery.</p>
                    <p>Finally, the Related Albums section expands user engagement by recommending not only other works from the same artist but also albums from similar genres or styles, helping users dive deeper into their musical interests.</p>
                `
            },
            {
                image: "notebox/NoteBox Wireframes (3).jpg",
                title: "Friends/Challenges Page",
                description: `
                    <p>The Friends & Challenges Page is where the social and gamified aspects of NoteBox truly come to life.</p>
                    <p>At the top, the “Monthly Rank” section displays a leaderboard showcasing each friend’s total listening minutes for the current month. The user with the highest count sits at the top, turning everyday listening into friendly competition. During private sessions or friend groups, top-ranked users can earn badges or experience points, reinforcing NoteBox’s gaming-inspired reward system.</p>
                    <p>Below, the “Ongoing Challenges” section highlights current themed events, whether monthly or seasonal, inspired by trends like top artists, genres, or special events. These challenges rotate periodically, allowing users to complete them at their own pace before they expire. Once a challenge ends, its badges become exclusive collectibles, adding a sense of rarity and achievement to active participation.</p>
                `
            }
        ];
    }
    // Add more projects as needed
    
    let currentWireframeIndex = 0;
    
    function updateWireframe() {
        if (wireframeData.length === 0) return;
        
        const current = wireframeData[currentWireframeIndex];
        wireframeImage.src = current.image;
        wireframeImage.alt = current.title;
        wireframeTitle.textContent = current.title;
        wireframeDescription.innerHTML = current.description;
    }
    
    function nextWireframeFunc() {
        currentWireframeIndex = (currentWireframeIndex + 1) % wireframeData.length;
        updateWireframe();
    }
    
    function prevWireframeFunc() {
        currentWireframeIndex = (currentWireframeIndex - 1 + wireframeData.length) % wireframeData.length;
        updateWireframe();
    }
    
    if (nextWireframe) nextWireframe.addEventListener('click', nextWireframeFunc);
    if (prevWireframe) prevWireframe.addEventListener('click', prevWireframeFunc);
    
    // Mobile: Flip card on tap
    const wireframeImageContainer = document.querySelector('.wireframe-image');
    if (wireframeImageContainer && window.innerWidth <= 768) {
        wireframeImageContainer.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }
    
    // Initialize
    updateWireframe();
}

// ========================================
// GALLERY TOGGLE - PAPER/DIGITAL
// ========================================

const paperBtn = document.getElementById('paperBtn');
const digitalBtn = document.getElementById('digitalBtn');
const paperGallery = document.getElementById('paperGallery');
const digitalGallery = document.getElementById('digitalGallery');

if (paperBtn && digitalBtn && paperGallery && digitalGallery) {
    paperBtn.addEventListener('click', () => {
        paperBtn.classList.add('active');
        digitalBtn.classList.remove('active');
        paperGallery.classList.add('active');
        digitalGallery.classList.remove('active');
    });
    
    digitalBtn.addEventListener('click', () => {
        digitalBtn.classList.add('active');
        paperBtn.classList.remove('active');
        digitalGallery.classList.add('active');
        paperGallery.classList.remove('active');
    });
}

// ========================================
// CHARACTER DESIGN SLIDERS
// ========================================

// Initialize all character sliders
document.querySelectorAll('.slider-track').forEach(track => {
    const characterName = track.getAttribute('data-character');
    const prevBtn = document.querySelector(`.slider-btn.prev[data-character="${characterName}"]`);
    const nextBtn = document.querySelector(`.slider-btn.next[data-character="${characterName}"]`);
    const slides = track.querySelectorAll('.slide');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function updateSlider() {
        const offset = -currentIndex * (100 + 2); // 100% width + gap
        track.style.transform = `translateX(${offset}%)`;
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        }
        
        if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    }, { passive: true });
});

// ========================================
// CONTACT FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const sendAnotherBtn = document.getElementById('sendAnother');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check honeypot (spam protection)
        const honeypot = document.getElementById('honeypot').value;
        if (honeypot) {
            console.log('Spam detected');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Message length validation (prevent spam)
        if (formData.message.length < 10) {
            alert('Please enter a message with at least 10 characters.');
            return;
        }
        
        if (formData.message.length > 5000) {
            alert('Message is too long. Please keep it under 5000 characters.');
            return;
        }
        
        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual email service)
        try {
            // Here you would normally send the email using a service like:
            // - EmailJS
            // - FormSpree
            // - Netlify Forms
            // - Your own backend API
            
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Example using EmailJS (you'd need to set this up):
            /*
            await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                {
                    to_email: 'kimttora@gmail.com',
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }
            );
            */
            
            // Hide form and show success message
            contactForm.style.display = 'none';
            successMessage.classList.add('active');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('There was an error sending your message. Please try again or email me directly at kimttora@gmail.com');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    // Send another message button
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            contactForm.style.display = 'flex';
            successMessage.classList.remove('active');
        });
    }
}