document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        mobileBtn.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileBtn.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav a, .nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile menu
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    function highlightActiveSection() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial check



    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe Hero Elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Observe Section Titles and Cards specific animation
    // Add animation classes to elements as they scroll into view
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Apply initial styles for scroll animation to cards
    const animatedElements = document.querySelectorAll('.concept-card, .cast-card, .system-box, .access-content');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transitionDelay = `${index % 3 * 0.1}s`; // Stagger effect
        cardObserver.observe(el);
    });

    // Note: Cast images are now static files loaded in HTML

    // Form Submission Handlers
    const customerForm = document.getElementById('customerForm');
    const applicationForm = document.getElementById('applicationForm');

    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(customerForm);
            const data = Object.fromEntries(formData);

            // Here you would normally send data to a server
            console.log('Customer inquiry:', data);

            // Show success message
            alert('お問い合わせありがとうございます！\n内容を確認次第、ご連絡させていただきます。');

            // Reset form
            customerForm.reset();
        });
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData);

            // Here you would normally send data to a server
            console.log('Maid application:', data);

            // Show success message
            alert('ご応募ありがとうございます！\n書類選考の結果は1週間以内にご連絡いたします。\n一緒に働けることを楽しみにしています♪');

            // Reset form
            applicationForm.reset();
        });
    }
});
