// --- Navbar scroll effect ---
window.addEventListener('scroll', function () {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'white';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
    }
});

// --- Explore button ---
document.querySelector('.explore-btn').addEventListener('click', () => {
    alert("Please login or sign up to explore accommodations.");
});

// --- Section Navigation ---
function showSection(sectionId) {
    const hero   = document.querySelector('.hero');
    const login  = document.getElementById('login-section');
    const signup = document.getElementById('signup-section');
    const nav    = document.querySelector('.navbar');

    hero.style.display   = 'none';
    login.style.display  = 'none';
    signup.style.display = 'none';

    if (sectionId === 'hero') {
        hero.style.display = 'flex';
        nav.style.display  = 'flex';
    } else if (sectionId === 'login') {
        login.style.display = 'flex';
        nav.style.display   = 'none';
    } else if (sectionId === 'signup') {
        signup.style.display = 'flex';
        nav.style.display    = 'none';
    }
}

// --- Login ---
function handleLogin(event) {
    event.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const stored   = localStorage.getItem(email);

    if (!stored) {
        alert("User not found! Please sign up first.");
        return;
    }

    const userData = JSON.parse(stored);
    if (userData.password === password) {
        localStorage.setItem("loggedInUser", email);
        window.location.href = "dash.html";
    } else {
        alert("Wrong password! Please try again.");
    }
}

// --- Signup ---
function handleSignup(event) {
    event.preventDefault();

    const name     = document.getElementById('signupName').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    // Prevent overwriting existing account
    if (localStorage.getItem(email)) {
        alert("An account with this email already exists. Please log in.");
        showSection('login');
        return;
    }

    const userData = {
        name:     name,
        email:    email,
        password: password,
        phone:    'not set',
        dob:      'not set',
        address:  'not set'
    };

    localStorage.setItem(email, JSON.stringify(userData));
    localStorage.setItem("loggedInUser", email);

    alert("Account created successfully! Welcome to ManoloStays!");
    window.location.href = "dash.html";
}