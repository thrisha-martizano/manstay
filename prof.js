const SESSION_KEY = "loggedInUser";

window.onload = function () {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) {
        window.location.href = "index.html";
        return;
    }
    loadProfileData(email);
};

function loadProfileData(email) {
    const userData = JSON.parse(localStorage.getItem(email));
    if (!userData) return;

    // Top nav name
    if (document.getElementById('nav-user-name'))
        document.getElementById('nav-user-name').innerText = userData.name || "User";

    // Display fields
    if (document.getElementById('display-name'))    document.getElementById('display-name').innerText    = userData.name    || '—';
    if (document.getElementById('profileEmail'))    document.getElementById('profileEmail').innerText    = userData.email   || '—';
    if (document.getElementById('display-phone'))   document.getElementById('display-phone').innerText   = userData.phone   || '—';
    if (document.getElementById('display-dob'))     document.getElementById('display-dob').innerText     = userData.dob     || '—';
    if (document.getElementById('display-address')) document.getElementById('display-address').innerText = userData.address || '—';

    // Pre-fill edit modal inputs
    if (document.getElementById('edit-name'))    document.getElementById('edit-name').value    = userData.name    !== 'not set' ? userData.name    : '';
    if (document.getElementById('edit-phone'))   document.getElementById('edit-phone').value   = userData.phone   !== 'not set' ? userData.phone   : '';
    if (document.getElementById('edit-dob'))     document.getElementById('edit-dob').value     = userData.dob     !== 'not set' ? userData.dob     : '';
    if (document.getElementById('edit-address')) document.getElementById('edit-address').value = userData.address !== 'not set' ? userData.address : '';
}

function editProfile() {
    document.getElementById('edit-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function saveProfile() {
    const email    = localStorage.getItem(SESSION_KEY);
    const userData = JSON.parse(localStorage.getItem(email));

    userData.name    = document.getElementById('edit-name').value.trim()    || userData.name;
    userData.phone   = document.getElementById('edit-phone').value.trim()   || 'not set';
    userData.dob     = document.getElementById('edit-dob').value.trim()     || 'not set';
    userData.address = document.getElementById('edit-address').value.trim() || 'not set';

    localStorage.setItem(email, JSON.stringify(userData));
    loadProfileData(email);
    closeModal();
    alert("Profile updated successfully!");
}

function updatePassword() {
    const currPass    = document.getElementById('curr-pass').value;
    const newPass     = document.getElementById('new-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;

    if (!currPass || !newPass || !confirmPass) {
        alert("Please fill in all password fields.");
        return;
    }

    const email    = localStorage.getItem(SESSION_KEY);
    const userData = JSON.parse(localStorage.getItem(email));

    if (currPass !== userData.password) {
        alert("Current password is incorrect!");
        return;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match!");
        return;
    }

    if (newPass.length < 6) {
        alert("New password must be at least 6 characters.");
        return;
    }

    userData.password = newPass;
    localStorage.setItem(email, JSON.stringify(userData));

    // Clear fields
    document.getElementById('curr-pass').value    = '';
    document.getElementById('new-pass').value     = '';
    document.getElementById('confirm-pass').value = '';

    alert("Password updated successfully!");
}

function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    }
}