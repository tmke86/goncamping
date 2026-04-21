document.addEventListener('DOMContentLoaded', function() {

    // ---------- FANESTYRING ----------
    const sections = {
        home: document.getElementById('page-home'),
        leie: document.getElementById('page-leie'),
        fasiliteter: document.getElementById('page-fasiliteter'),
        omoss: document.getElementById('page-omoss'),
        nyheter: document.getElementById('page-nyheter')
    };

    function showPage(pageId) {
        Object.values(sections).forEach(section => {
            if (section) section.classList.remove('active-section');
        });
        if (sections[pageId]) sections[pageId].classList.add('active-section');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        history.pushState(null, '', '#' + pageId);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page && sections[page]) {
                showPage(page);
                document.getElementById('navLinks').classList.remove('show');
            }
        });
    });

    function handleHash() {
        const hash = window.location.hash.substring(1);
        if (hash && sections[hash]) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();

    // ---------- FORMSPREE SKJEMAER ----------
    // ⚠️ BYTT UT DISSE URLENE MED DINE EGNE FRA FORMSPREE ⚠️
    const FORMSPREE_BOOKING_URL = "https://formspree.io/f/DIN_BOOKING_ID";
    const FORMSPREE_CONTACT_URL = "https://formspree.io/f/DIN_KONTAKT_ID";

    async function submitToFormspree(url, formData, statusElementId, successMsg, errorMsg) {
        const statusDiv = document.getElementById(statusElementId);
        statusDiv.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sender...';
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                statusDiv.innerHTML = `<span style="color:green;">✅ ${successMsg}</span>`;
                // Tilbakestill skjemaet
                const form = document.querySelector(`#${statusElementId === 'bookingStatus' ? 'bookingForm' : 'contactForm'}`);
                if (form) form.reset();
                setTimeout(() => statusDiv.innerHTML = '', 5000);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            statusDiv.innerHTML = `<span style="color:red;">❌ ${errorMsg} Prøv igjen senere.</span>`;
            console.error(error);
        }
    }

    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            await submitToFormspree(FORMSPREE_BOOKING_URL, formData, 'bookingStatus',
                'Bookingforespørsel er sendt! Du hører fra oss innen 24 timer.',
                'Noe gikk galt med bookingforespørselen.');
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            await submitToFormspree(FORMSPREE_CONTACT_URL, formData, 'contactStatus',
                'Meldingen er sendt! Vi svarer så snart som mulig.',
                'Kunne ikke sende melding. Vennligst prøv igjen.');
        });
    }

    // ---------- LIGHTBOX (forstørr bilder) ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.getAttribute('data-img') || img.src;
            lightbox.style.display = 'flex';
        });
    });
    
    document.querySelector('.close-lightbox')?.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    // ---------- MOBILMENY ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
});