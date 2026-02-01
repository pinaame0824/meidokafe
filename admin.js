// Store password basically (In real app, use token)
let currentPassword = "";

// Check Login
function checkLogin() {
    const password = document.getElementById('adminPassword').value;
    currentPassword = password;

    // Try to simple load data to verify password
    fetch(`http://localhost:8000/api/admin/data?password=${password}`)
        .then(response => {
            if (response.ok) {
                document.getElementById('loginScreen').style.display = 'none';
                return response.json();
            } else {
                throw new Error('Unauthorized');
            }
        })
        .then(data => {
            renderData(data);
        })
        .catch(error => {
            alert('ログインできません。パスワードが違うか、サーバーが起動していません。');
        });
}

// Logout
function logout() {
    location.reload();
}

// Switch Tabs
function switchTab(tabName) {
    // Hide all tables
    document.querySelectorAll('.data-table-container').forEach(el => {
        el.classList.remove('active');
    });
    // Show selected table
    document.getElementById(tabName).classList.add('active');

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Add active to clicked button (simple way)
    event.currentTarget.classList.add('active');
}

// Load and Render Data
function loadData() {
    if (!currentPassword) return;

    fetch(`http://localhost:8000/api/admin/data?password=${currentPassword}`)
        .then(response => response.json())
        .then(data => {
            renderData(data);
        })
        .catch(error => console.error('Error:', error));
}

function renderData(data) {
    // --- Inquiries ---
    const inquiries = data.inquiries;
    const inquiriesBody = document.getElementById('inquiriesBody');

    if (inquiries.length === 0) {
        inquiriesBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">データがありません</td></tr>';
    } else {
        inquiriesBody.innerHTML = inquiries.map(item => `
            <tr>
                <td>${item.created_at}</td>
                <td style="font-weight:bold;">${item.name}</td>
                <td>${item.email}<br><small>${item.phone || ''}</small></td>
                <td><span class="status-badge status-new">${item.subject}</span></td>
                <td>${item.message}</td>
                <td>未対応</td>
            </tr>
        `).join('');
    }

    // --- Applications ---
    const applications = data.applications;
    const applicationsBody = document.getElementById('applicationsBody');

    if (applications.length === 0) {
        applicationsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">データがありません</td></tr>';
    } else {
        applicationsBody.innerHTML = applications.map(item => `
            <tr>
                <td>${item.created_at}</td>
                <td style="font-weight:bold;">${item.name}</td>
                <td>${item.age}歳</td>
                <td>${item.email}<br><small>${item.phone}</small></td>
                <td>${getExperienceLabel(item.experience)}</td>
                <td>${item.message}</td>
            </tr>
        `).join('');
    }
}

// Helper for labels
function getExperienceLabel(key) {
    const map = {
        'none': '未経験',
        'cafe': 'カフェ経験あり',
        'maid': 'メイドカフェ経験あり',
        'other': 'その他接客'
    };
    return map[key] || key;
}

// Set Date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
