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

    loadBookings();
};

// --- Load bookings ---
function loadBookings() {
    const currentUser = localStorage.getItem("loggedInUser");
    const bookingKey  = `userBookings_${currentUser}`;
    const myBookings  = JSON.parse(localStorage.getItem(bookingKey)) || [];

    const bookingsBody = document.getElementById('bookings-body');
    bookingsBody.innerHTML = ''; 

    if (myBookings.length === 0) {
        bookingsBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 30px; color: #888;">
                    No bookings yet. <a href="dation.html">Browse accommodations →</a>
                </td>
            </tr>`;
        return;
    }

    myBookings.forEach((book, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-status', book.status);
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <td>
                <div class="acc-cell">
                    <img src="${book.image}" alt="" onerror="this.src='/image/AVA1.jpg'">
                    <span>${book.accommodation}</span>
                </div>
            </td>
            <td>${book.dates}</td>
            <td>${book.guests}</td>
            <td>${book.amount}</td>
            <td><span class="status-badge ${book.status}">${book.status.charAt(0).toUpperCase() + book.status.slice(1)}</span></td>
            <td><button class="action-btn" onclick="showDetails(this)">View Details</button></td>
        `;
        bookingsBody.appendChild(row);
    });
}

// --- Filter tabs ---
function filterBookings(status) {
    const rows    = document.querySelectorAll('#bookings-body tr');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        if (status === 'all' || rowStatus === status) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// --- View Details Modal ---
function showDetails(button) {
    const modal       = document.getElementById('detailsModal');
    const modalBody   = document.getElementById('modal-details-body');
    const modalActions = document.getElementById('modal-actions');
    const row         = button.closest('tr');
    const statusAttr  = row.getAttribute('data-status');

    const accommodation = row.cells[0].querySelector('span').innerText;
    const dates         = row.cells[1].innerText;
    const guests        = row.cells[2].innerText;
    const amount        = row.cells[3].innerText;
    const statusText    = row.cells[4].innerText;

    modalBody.innerHTML = `
        <p><strong>🏨 Accommodation:</strong> ${accommodation}</p>
        <p><strong>📅 Check-in/out:</strong> ${dates}</p>
        <p><strong>👥 Guests:</strong> ${guests}</p>
        <p><strong>💰 Total Amount:</strong> ${amount}</p>
        <p><strong>📌 Status:</strong> ${statusText}</p>
    `;

    modalActions.innerHTML = '';
    if (statusAttr === 'pending') {
        modalActions.innerHTML = `
            <button onclick="editBooking()" class="edit-btn">Edit Details</button>
            <button onclick="cancelBooking()" class="cancel-btn">Cancel Booking</button>
        `;
        modal.dataset.currentRowIndex = row.rowIndex;
    } else {
        modalActions.innerHTML = `<p style="font-size:12px; color:#888;"><i>This booking is ${statusAttr} and cannot be modified.</i></p>`;
    }

    // Reset to summary view in case edit was open
    document.getElementById('summary-view').style.display = 'block';
    document.getElementById('edit-view').style.display    = 'none';
    modal.style.display = 'block';
}

// --- Edit Booking ---
function editBooking() {
    const modal    = document.getElementById('detailsModal');
    const rowIndex = modal.dataset.currentRowIndex;
    const row      = document.querySelector('.bookings-table').rows[rowIndex];

    document.getElementById('edit-input-dates').value  = row.cells[1].innerText;
    document.getElementById('edit-input-guests').value = row.cells[2].innerText;

    document.getElementById('summary-view').style.display = 'none';
    document.getElementById('edit-view').style.display    = 'block';
}

function saveEdit() {
    const currentUser = localStorage.getItem("loggedInUser");
    const bookingKey  = `userBookings_${currentUser}`;  

    const modal     = document.getElementById('detailsModal');
    const rowIndex  = modal.dataset.currentRowIndex;
    const row       = document.querySelector('.bookings-table').rows[rowIndex];
    const dataIndex = parseInt(row.getAttribute('data-index'));

    const newDates  = document.getElementById('edit-input-dates').value;
    const newGuests = document.getElementById('edit-input-guests').value;

    if (!newDates) {
        alert("Please enter valid dates.");
        return;
    }

    // Update table row
    row.cells[1].innerText = newDates;
    row.cells[2].innerText = newGuests;

    // Update localStorage 
    let myBookings = JSON.parse(localStorage.getItem(bookingKey)) || [];
    if (myBookings[dataIndex]) {
        myBookings[dataIndex].dates  = newDates;
        myBookings[dataIndex].guests = newGuests;
        localStorage.setItem(bookingKey, JSON.stringify(myBookings));
    }

    alert("Booking updated successfully!");
    closeModal();
}

function cancelEdit() {
    document.getElementById('summary-view').style.display = 'block';
    document.getElementById('edit-view').style.display    = 'none';
}

// --- Cancel Booking ---
function cancelBooking() {
    if (!confirm("Are you sure you want to cancel this pending booking?")) return;

    const currentUser = localStorage.getItem("loggedInUser");
    const bookingKey  = `userBookings_${currentUser}`;  
    const paymentKey  = `userPayments_${currentUser}`;   

    const modal     = document.getElementById('detailsModal');
    const rowIndex  = modal.dataset.currentRowIndex;
    const row       = document.querySelector('.bookings-table').rows[rowIndex];
    const dataIndex = parseInt(row.getAttribute('data-index'));

    // Update booking status in localStorage
    let myBookings = JSON.parse(localStorage.getItem(bookingKey)) || [];
    if (myBookings[dataIndex]) {
        myBookings[dataIndex].status = 'cancelled';
        localStorage.setItem(bookingKey, JSON.stringify(myBookings));
    }

    // Mark matching payment as Refunded
    let myPayments = JSON.parse(localStorage.getItem(paymentKey)) || [];
    const bookingId = myBookings[dataIndex]?.id;
    myPayments = myPayments.map(pmt => {
        if (pmt.id === bookingId || pmt.bookingName === myBookings[dataIndex]?.accommodation) {
            return { ...pmt, status: 'refunded' };
        }
        return pmt;
    });
    localStorage.setItem(paymentKey, JSON.stringify(myPayments));

    // Update table row UI
    row.setAttribute('data-status', 'cancelled');
    row.cells[4].innerHTML = '<span class="status-badge cancelled">Cancelled</span>';
    row.cells[5].innerHTML = '';  

    alert("Booking cancelled. Payment marked as Refunded.");
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.style.display = 'none';
}