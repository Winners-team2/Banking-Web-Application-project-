// ========== CHART ==========
const chart = document.querySelector("#chart").getContext('2d');

new Chart(chart, {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
        datasets: [
            {
                label: "BTC",
                data: [29374, 33537, 49631, 59095, 36684, 33572, 39974, 48847, 48116, 61004, 52000],
                borderColor: "red",
                borderWidth: 2
            },
            {
                label: "ETH",
                data: [31500, 41000, 28000, 26000, 46000, 32698, 50000, 30000, 18656, 36844, 42000],
                borderColor: "blue",
                borderWidth: 2
            }
        ]
    },
    options: {
        responsive: true
    }
});
// ========== SMART SEARCH ==========
const searchInput = document.querySelector(".search-bar input");

// Create dropdown menu
const searchDropdown = document.createElement("div");
searchDropdown.className = "search-dropdown";
searchDropdown.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 1000;
    display: none;
    max-height: 300px;
    overflow-y: auto;
`;

const searchBarContainer = document.querySelector(".search-bar");
searchBarContainer.style.position = "relative";
searchBarContainer.appendChild(searchDropdown);

// Define searchable items
const searchItems = [
    { name: "Dashboard", icon: "dashboard", url: "index.html" },
    { name: "Transfer Money", icon: "send", url: "transfer.html" },
    { name: "Transfer History", icon: "history", url: "transfer_his.html" },
    { name: "Beneficiaries", icon: "group", url: "Beneficiaries.HTML" },
    { name: "Bills Payment", icon: "payment", url: "bills.html" },
    { name: "Admin Panel", icon: "admin_panel_settings", url: "adminmonitor.html" },
    { name: "Settings & Security", icon: "settings", url: "settings.html" },
    { name: "Support", icon: "help_center", url: "support.html" },
    { name: "Change Password", icon: "vpn_key", url: "change.html" },
    { name: "Logout", icon: "logout", url: "logout.html" }
];

if (searchInput) {
    searchInput.addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === "") {
            searchDropdown.style.display = "none";
            return;
        }
        
        const filtered = searchItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        if (filtered.length === 0) {
            searchDropdown.innerHTML = `<div style="padding: 12px; color: #888;">No results found</div>`;
            searchDropdown.style.display = "block";
            return;
        }
        
        searchDropdown.innerHTML = filtered.map(item => `
            <div class="search-item" data-url="${item.url}" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.2s;
                border-bottom: 1px solid #eee;
            ">
                <span class="material-icons-sharp" style="color: #24086d;">${item.icon}</span>
                <span>${item.name}</span>
            </div>
        `).join('');
        
        searchDropdown.style.display = "block";
        
        // Add click events to search results
        document.querySelectorAll(".search-item").forEach(el => {
            el.addEventListener("click", function() {
                const url = this.getAttribute("data-url");
                window.location.href = url;
            });
            
            el.addEventListener("mouseenter", function() {
                this.style.background = "#f0eff5";
            });
            
            el.addEventListener("mouseleave", function() {
                this.style.background = "";
            });
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if (!searchBarContainer.contains(e.target)) {
            searchDropdown.style.display = "none";
        }
    });
}

// ========== DASHBOARD DATA FETCHING ==========
async function loadDashboardData() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://localhost:7079/api/Monitoring/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
            throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        updateDashboardUI(data);
        
    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

function updateDashboardUI(data) {
    const statCards = document.querySelectorAll(".stat-card");
    
    if (statCards.length >= 4) {
        if (data.totalUsers) statCards[0].querySelector("h3").textContent = data.totalUsers.toLocaleString();
        if (data.totalTransactions) statCards[1].querySelector("h3").textContent = data.totalTransactions.toLocaleString();
        if (data.totalVolume) statCards[2].querySelector("h3").textContent = "$" + data.totalVolume.toLocaleString();
        if (data.pendingReviews) statCards[3].querySelector("h3").textContent = data.pendingReviews;
    }
}

// ========== SIDEBAR ==========
const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');

if (menuBtn && closeBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        sidebar.style.left = '0';
    });

    closeBtn.addEventListener('click', () => {
        sidebar.style.left = '-100%';
    });
}

// ========== THEME TOGGLE ==========
const themeBtn = document.querySelector('.theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeBtn.querySelector('span:first-child').classList.toggle('active');
        themeBtn.querySelector('span:last-child').classList.toggle('active');
    });
}

// ========== LOAD DASHBOARD DATA ==========
document.addEventListener("DOMContentLoaded", loadDashboardData);