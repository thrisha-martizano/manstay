window.onload = function () {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");

    if (!loggedInUserEmail) {
        window.location.href = "index.html";
        return;
    }

    const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
    if (document.getElementById('nav-user-name')) {
        document.getElementById('nav-user-name').innerText = userData.name || " ";
    }
};

// --- Sa Search Bar place/name acc ---
function filterPlaces() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.getElementsByClassName('accomm-card');

    for (let i = 0; i < cards.length; i++) {
        const title    = cards[i].querySelector('h3').innerText.toLowerCase();
        const location = cards[i].querySelector('.loc').innerText.toLowerCase();
        cards[i].style.display = (title.includes(input) || location.includes(input)) ? "" : "none";
    }
}

// --- Open / Close Details View ---
function openDetails(name, price, image, location, description) {
    document.getElementById('accomm-list-view').style.display    = 'none';
    document.getElementById('property-details-view').style.display = 'block';

    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-price').innerHTML = `${price} <small>/ night</small>`;
    document.getElementById('detail-main-img').src    = image;

    document.querySelector('.sub-info').innerHTML  = `⭐ 4.8 | <i class='bx bx-location-plus'></i> ${location}`;
    document.querySelector('.long-desc').innerText = description;

    // Pre-fill guest info from logged-in user profile
    const currentUser = localStorage.getItem("loggedInUser");
    if (currentUser) {
        const userData = JSON.parse(localStorage.getItem(currentUser));
        if (document.getElementById('guest-name'))  document.getElementById('guest-name').value  = userData.name  || '';
        if (document.getElementById('guest-email')) document.getElementById('guest-email').value = userData.email || '';
        if (document.getElementById('guest-phone')) document.getElementById('guest-phone').value = userData.phone !== 'not set' ? userData.phone : '';
    }

    window.scrollTo(0, 0);
}

function closeDetails() {
    document.getElementById('accomm-list-view').style.display    = 'block';
    document.getElementById('property-details-view').style.display = 'none';
}

// --- Confirm Booking (FIXED: now saves BOTH booking AND payment) ---
function confirmBooking() {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) {
        alert("Please log in first.");
        window.location.href = "index.html";
        return;
    }

    const guestName = document.getElementById('guest-name')?.value?.trim();
    if (!guestName) {
        alert("Please enter your Full Name to book.");
        return;
    }

    const accommodation = document.getElementById('detail-title')?.innerText || "Unknown Property";
    const priceText     = document.getElementById('detail-price')?.innerText || "0";
    const pricePerNight = parseFloat(priceText.replace(/[₱,\/nightsmall\s]/g, '').trim()) || 0;
    const mainImg       = document.getElementById('detail-main-img')?.src || "";

    const dateInputs = document.querySelectorAll('#property-details-view input[type="date"]');
    const checkin    = dateInputs[0]?.value;
    const checkout   = dateInputs[1]?.value;

    if (!checkin || !checkout) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    // Calculate total based on nights
    const start     = new Date(checkin);
    const end       = new Date(checkout);
    const nights    = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * pricePerNight;
    const formattedTotal = `₱${totalAmount.toLocaleString()}`;

    const guestSelect = document.querySelector('#property-details-view select');
    const guests = guestSelect ? guestSelect.value : "1";

    const sharedID = Date.now();
    const today    = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    // --- NEW BOOKING OBJECT ---
    const newBooking = {
        id:            sharedID,
        accommodation: accommodation,
        dates:         `${checkin} - ${checkout}`,
        guests:        guests,
        amount:        formattedTotal,   // stored as "₱2,500"
        status:        'pending',
        image:         mainImg
    };

    // --- NEW PAYMENT OBJECT ---
    const newPayment = {
        id:          sharedID,
        bookingName: accommodation,
        date:        today,
        amount:      formattedTotal,   // stored as "₱2,500" — consistent with booking
        method:      'GCash',
        status:      'paid'            // lowercase — consistent with dash.js filter
    };

    // --- SAVE with user-specific keys (FIXED) ---
    const bookingKey = `userBookings_${currentUser}`;
    const paymentKey = `userPayments_${currentUser}`;

    let myBookings = JSON.parse(localStorage.getItem(bookingKey)) || [];
    let myPayments = JSON.parse(localStorage.getItem(paymentKey)) || [];

    myBookings.push(newBooking);
    myPayments.push(newPayment);

    localStorage.setItem(bookingKey, JSON.stringify(myBookings));
    localStorage.setItem(paymentKey, JSON.stringify(myPayments));

    // alert(`Booking Confirmed!\n\n${accommodation}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nNights: ${nights}\nTotal: ${formattedTotal}`);

    closeDetails();
}