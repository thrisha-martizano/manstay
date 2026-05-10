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

    loadPaymentTable();
};

function loadPaymentTable() {
    const currentUser = localStorage.getItem("loggedInUser");
    const paymentKey  = `userPayments_${currentUser}`;  

    const paymentsBody = document.getElementById('payments-body');
    const myPayments   = JSON.parse(localStorage.getItem(paymentKey)) || [];

    paymentsBody.innerHTML = ''; 

    if (myPayments.length === 0) {
        paymentsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#888;">No payment records yet.</td></tr>';
        return;
    }

    myPayments.forEach(pmt => {
        const row         = document.createElement('tr');
        const statusClass = pmt.status.toLowerCase();
        const statusLabel = pmt.status.charAt(0).toUpperCase() + pmt.status.slice(1);

        row.innerHTML = `
            <td>${pmt.bookingName}</td>
            <td>${pmt.date}</td>
            <td>${pmt.amount}</td>
            <td>${pmt.method}</td>
            <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        `;
        paymentsBody.appendChild(row);
    });

    updatePaymentStats(myPayments);
}


function updatePaymentStats(myPayments) {
    let totalPaid     = 0;
    let pendingAmount = 0;
    let pendingCount  = 0;
    let dates         = [];

    myPayments.forEach(pmt => {
        const amount = parseFloat(String(pmt.amount).replace(/[₱,]/g, '')) || 0;
        const status = pmt.status.toLowerCase();

        if (status === 'paid') {
            totalPaid += amount;
        } else if (status === 'pending') {
            pendingAmount += amount;
            pendingCount++;
        }

        if (pmt.date) dates.push(new Date(pmt.date));
    });

    document.getElementById('stat-total-paid').innerText      = `₱${totalPaid.toLocaleString()}`;
    document.getElementById('stat-pending-amount').innerText   = `₱${pendingAmount.toLocaleString()}`;
    document.getElementById('stat-pending-count').innerText    = `${pendingCount} payment${pendingCount !== 1 ? 's' : ''}`;

    if (dates.length > 0) {
        const latestDate = new Date(Math.max(...dates));
        document.getElementById('stat-last-date').innerText = latestDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }
}