

document.addEventListener('DOMContentLoaded', function () {

    // ── DASHBOARD PAGES
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
    
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

    
        const contentHeader = document.querySelector('.content-header');
        if (contentHeader) {
            contentHeader.insertBefore(hamburger, contentHeader.firstChild);
        }

       
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scroll
        }

      
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
        hamburger.addEventListener('click', function () {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
        overlay.addEventListener('click', closeSidebar);

        
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeSidebar);
        });

      
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSidebar();
        });

      
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) closeSidebar();
        });
    }


    // ── LANDING 
    const navbar   = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    if (navbar && navLinks) {
        
        const navHamburger = document.createElement('button');
        navHamburger.className = 'hamburger-btn';
        navHamburger.setAttribute('aria-label', 'Toggle navigation');
        navHamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

      
        const logo = navbar.querySelector('.logo');
        if (logo && logo.nextSibling) {
            navbar.insertBefore(navHamburger, logo.nextSibling);
        } else {
            navbar.appendChild(navHamburger);
        }

        
        navHamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navHamburger.classList.toggle('active', isOpen);
        });


        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            });
        });

    
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            }
        });
    }

});