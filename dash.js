DASH.J
window.onload = function () {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");

    if (!loggedInUserEmail) {
        window.location.href = "index.html";
        return;
    }

    const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
    if (document.getElementById('nav-user-name')) {
        document.getElementById('nav-user-name').innerText = userData.name || "User";
    }

    updateDashboardStats();
};

function updateDashboardStats() {
    const currentUser = localStorage.getItem("loggedInUser");

    const bookingKey = `userBookings_${currentUser}`;
    const paymentKey = `userPayments_${currentUser}`;

    const bookings = JSON.parse(localStorage.getItem(bookingKey)) || [];
    const payments = JSON.parse(localStorage.getItem(paymentKey)) || [];

    // --- Stat Cards ---
    const totalBookings = bookings.length;

    // FIX: amount is stored as "₱2,500" — strip ₱ and commas to get number
    const totalSpent = payments
        .filter(p => p.status.toLowerCase() === 'paid')
        .reduce((sum, p) => sum + parseFloat(String(p.amount).replace(/[₱,]/g, '') || 0), 0);

    const upcoming  = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    document.getElementById('total-bookings-count').innerText  = totalBookings;
    document.getElementById('total-spent-amount').innerText    = `₱${totalSpent.toLocaleString()}`;
    document.getElementById('upcoming-bookings-count').innerText = upcoming;
    document.getElementById('completed-stays-count').innerText  = completed;

    // --- Recent Bookings (last 3) ---
    const recentList = document.getElementById('recent-bookings-list');
    const recentData = [...bookings].reverse().slice(0, 3);

    recentList.innerHTML = '<h3>Recent Accommodation Bookings</h3>';

    if (recentData.length === 0) {
        recentList.innerHTML += '<p style="padding: 15px; color: #888;">No bookings yet. <a href="dation.html">Browse accommodations →</a></p>';
    } else {
        recentData.forEach(book => {
            const div = document.createElement('div');
            div.className = 'booking-item';
            div.innerHTML = `
                <img src="${book.image}" alt="Stay" onerror="this.src='/image/AVA1.jpg'">
                <div class="details">
                    <h4>${book.accommodation}</h4>
                    <p>${book.dates}</p>
                </div>
                <span class="status ${book.status}">${book.status}</span>
            `;
            recentList.appendChild(div);
        });
    }

    recentList.innerHTML += '<a href="books.html" class="view-all">View all bookings →</a>';

    updateCharts(bookings, payments);
}

function updateCharts(bookings, payments) {
    const monthCounts   = new Array(6).fill(0);
    const monthlySpending = new Array(6).fill(0);

    bookings.forEach(b => {
        const datePart   = b.dates.split(' - ')[0];
        const monthIndex = new Date(datePart.replace(/-/g, '/')).getMonth();
        if (monthIndex >= 0 && monthIndex < 6) monthCounts[monthIndex]++;
    });

    payments.forEach(p => {
        if (p.status.toLowerCase() === 'paid') {
            const monthIndex = new Date(p.date).getMonth();
            if (monthIndex >= 0 && monthIndex < 6) {
                const amount = parseFloat(String(p.amount).replace(/[₱,]/g, '')) || 0;
                monthlySpending[monthIndex] += amount;
            }
        }
    });

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Bar Chart
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Bookings',
                data: monthCounts,
                backgroundColor: '#4495b6',
                borderRadius: 5
            }]
        }
    });

    // Line Chart
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Total Spent',
                data: monthlySpending,
                borderColor: '#0b0445',
                backgroundColor: 'rgba(24, 0, 59, 0.41)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: true } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => '₱' + v.toLocaleString() }
                }
            }
        }
    });

    // Doughnut Chart
    const accMap = {};
    bookings.forEach(b => {
        accMap[b.accommodation] = (accMap[b.accommodation] || 0) + 1;
    });

    new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels:   Object.keys(accMap).length   ? Object.keys(accMap)   : ['No Bookings Yet'],
            datasets: [{ data: Object.values(accMap).length ? Object.values(accMap) : [1],
                backgroundColor: ['#cab425', '#ba3bb6', '#3bb607', '#c23745', '#1c1ca0'] }]
        },
        options: { cutout: '60%' }
    });
}