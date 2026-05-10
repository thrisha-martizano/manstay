/* =============================================
   SIDEBAR.JS — ManoloStays
   Add <script src="sidebar.js"></script>
   to ALL your HTML pages (before </body>)
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    // ── DASHBOARD PAGES: Sidebar hamburger ──────────────────
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        // 1. Create the dark overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        // 2. Create the hamburger button (3 lines icon)
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        // 3. Inject it as the FIRST item in the content header
        const contentHeader = document.querySelector('.content-header');
        if (contentHeader) {
            contentHeader.insertBefore(hamburger, contentHeader.firstChild);
        }

        // 4. Open sidebar
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scroll
        }

        // 5. Close sidebar
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 6. Toggle on hamburger click
        hamburger.addEventListener('click', function () {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });

        // 7. Close when overlay is tapped
        overlay.addEventListener('click', closeSidebar);

        // 8. Close automatically when a nav link is clicked (goes to new page)
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeSidebar);
        });

        // 9. Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSidebar();
        });

        // 10. Close sidebar if window is resized to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) closeSidebar();
        });
    }


    // ── LANDING / INDEX PAGE: Navbar hamburger ───────────────
    const navbar   = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    if (navbar && navLinks) {
        // 1. Create hamburger for navbar
        const navHamburger = document.createElement('button');
        navHamburger.className = 'hamburger-btn';
        navHamburger.setAttribute('aria-label', 'Toggle navigation');
        navHamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        // 2. Insert after the logo
        const logo = navbar.querySelector('.logo');
        if (logo && logo.nextSibling) {
            navbar.insertBefore(navHamburger, logo.nextSibling);
        } else {
            navbar.appendChild(navHamburger);
        }

        // 3. Toggle nav links on click
        navHamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navHamburger.classList.toggle('active', isOpen);
        });

        // 4. Close when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            });
        });

        // 5. Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            }
        });

        // 6. Close if resized to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('active');
            }
        });
    }

});