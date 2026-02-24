// Mock data for scans (limited to past 2 days)
const mockScans = [
    {
        id: 1,
        datetime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        uniqueUPCs: 47,
        scanSource: 'Shopper #28451',
        category: 'Beverages'
    },
    {
        id: 2,
        datetime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        uniqueUPCs: 32,
        scanSource: 'Shopper #19203',
        category: 'Snacks'
    },
    {
        id: 3,
        datetime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        uniqueUPCs: 56,
        scanSource: 'Shopper #28451',
        category: 'Condiments & Sauces'
    },
    {
        id: 4,
        datetime: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
        uniqueUPCs: 41,
        scanSource: 'Shopper #34782',
        category: 'Dairy'
    },
    {
        id: 5,
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        uniqueUPCs: 38,
        scanSource: 'Shopper #19203',
        category: 'Frozen Foods'
    },
    {
        id: 6,
        datetime: new Date(Date.now() - 30 * 60 * 60 * 1000), // 1.25 days ago
        uniqueUPCs: 52,
        scanSource: 'Shopper #28451',
        category: 'Cereals'
    },
    {
        id: 7,
        datetime: new Date(Date.now() - 40 * 60 * 60 * 1000), // 1.67 days ago
        uniqueUPCs: 29,
        scanSource: 'Shopper #41209',
        category: 'Baking'
    }
];

let filteredScans = [...mockScans];

// Format date for display
function formatDateTime(date) {
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}

// Format date for comparison (YYYY-MM-DD)
function formatDateForComparison(date) {
    return date.toISOString().split('T')[0];
}

// Render scans table
function renderScans(scans) {
    const tbody = document.getElementById('scansTableBody');
    const noResults = document.getElementById('noResults');

    if (scans.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    tbody.innerHTML = scans.map(scan => `
        <tr onclick="viewScanDetail(${scan.id})">
            <td>${formatDateTime(scan.datetime)}</td>
            <td><strong>${scan.uniqueUPCs}</strong> UPCs</td>
            <td>${scan.scanSource}</td>
            <td>${scan.category}</td>
        </tr>
    `).join('');
}

// Navigate to scan detail
function viewScanDetail(scanId) {
    window.location.href = `scan-detail.html?id=${scanId}`;
}

// Filter scans
function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const sourceFilter = document.getElementById('sourceFilter').value.toLowerCase();

    filteredScans = mockScans.filter(scan => {
        const matchesDate = !dateFilter || formatDateForComparison(scan.datetime) === dateFilter;
        const matchesSource = !sourceFilter || scan.scanSource.toLowerCase().includes(sourceFilter);

        return matchesDate && matchesSource;
    });

    renderScans(filteredScans);
}

// Clear filters
function clearFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('sourceFilter').value = '';
    filteredScans = [...mockScans];
    renderScans(filteredScans);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderScans(mockScans);

    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('sourceFilter').addEventListener('input', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
});

// Make viewScanDetail available globally
window.viewScanDetail = viewScanDetail;
