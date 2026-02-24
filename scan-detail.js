// Mock scan data
const mockScanDetails = {
    1: {
        id: 1,
        datetime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        category: 'Beverages',
        products: [
            { id: 'P166356', name: 'Coca-Cola Classic', brand: 'Coca-Cola', availability: 'in-stock', facings: 19, images: 3 },
            { id: 'P183421', name: 'Pepsi Cola', brand: 'Pepsi', availability: 'in-stock', facings: 15, images: 2 },
            { id: 'P192847', name: 'Sprite Lemon-Lime', brand: 'Coca-Cola', availability: 'in-stock', facings: 12, images: 2 },
            { id: 'P201984', name: 'Mountain Dew', brand: 'Pepsi', availability: 'in-stock', facings: 10, images: 2 },
            { id: 'P215673', name: 'Dr Pepper', brand: 'Dr Pepper', availability: 'in-stock', facings: 8, images: 2 },
            { id: 'P224891', name: 'Fanta Orange', brand: 'Coca-Cola', availability: 'out-of-stock', facings: 0, images: 1 },
            { id: 'P238421', name: 'Sprite Zero Sugar', brand: 'Coca-Cola', availability: 'in-stock', facings: 7, images: 2 },
            { id: 'P245692', name: 'Diet Coke', brand: 'Coca-Cola', availability: 'in-stock', facings: 14, images: 2 },
            { id: 'P259384', name: 'Pepsi Zero Sugar', brand: 'Pepsi', availability: 'in-stock', facings: 9, images: 2 },
            { id: 'P267821', name: '7UP Lemon-Lime', brand: 'Dr Pepper', availability: 'in-stock', facings: 6, images: 1 },
            { id: 'P274938', name: 'A&W Root Beer', brand: 'Dr Pepper', availability: 'out-of-stock', facings: 0, images: 1 },
            { id: 'P283746', name: 'Schweppes Ginger Ale', brand: 'Dr Pepper', availability: 'in-stock', facings: 5, images: 1 }
        ]
    },
    2: {
        id: 2,
        datetime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        category: 'Snacks',
        products: [
            { id: 'P301234', name: 'Lay\'s Classic Potato Chips', brand: 'Lay\'s', availability: 'in-stock', facings: 22, images: 3 },
            { id: 'P315678', name: 'Doritos Nacho Cheese', brand: 'Doritos', availability: 'in-stock', facings: 18, images: 2 },
            { id: 'P329876', name: 'Cheetos Crunchy', brand: 'Cheetos', availability: 'in-stock', facings: 16, images: 2 },
            { id: 'P334521', name: 'Pringles Original', brand: 'Pringles', availability: 'in-stock', facings: 12, images: 2 },
            { id: 'P348923', name: 'Ruffles Cheddar & Sour Cream', brand: 'Ruffles', availability: 'out-of-stock', facings: 0, images: 1 },
            { id: 'P356743', name: 'Tostitos Tortilla Chips', brand: 'Tostitos', availability: 'in-stock', facings: 14, images: 2 }
        ]
    }
};

// Add mock data for other scan IDs
for (let i = 3; i <= 7; i++) {
    mockScanDetails[i] = {
        id: i,
        datetime: new Date(Date.now() - (i * 8) * 60 * 60 * 1000),
        category: 'Sample Category',
        products: [
            { id: `P${i}00001`, name: 'Sample Product 1', brand: 'Brand A', availability: 'in-stock', facings: 10, images: 2 },
            { id: `P${i}00002`, name: 'Sample Product 2', brand: 'Brand B', availability: 'in-stock', facings: 8, images: 2 },
            { id: `P${i}00003`, name: 'Sample Product 3', brand: 'Brand A', availability: 'out-of-stock', facings: 0, images: 1 },
        ]
    };
}

let currentScan = null;
let filteredProducts = [];

// Get scan ID from URL
function getScanIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

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

// Calculate Share of Shelf by brand
function calculateShareOfShelf(products) {
    const brandCounts = {};
    let totalFacings = 0;

    products.forEach(product => {
        if (product.availability === 'in-stock') {
            brandCounts[product.brand] = (brandCounts[product.brand] || 0) + product.facings;
            totalFacings += product.facings;
        }
    });

    const brandShares = Object.entries(brandCounts).map(([brand, facings]) => ({
        brand,
        facings,
        percentage: totalFacings > 0 ? ((facings / totalFacings) * 100).toFixed(1) : 0
    }));

    // Sort by percentage descending
    brandShares.sort((a, b) => b.percentage - a.percentage);

    return { brandShares, totalFacings };
}

// Render Share of Shelf summary (P2)
function renderShareOfShelf(products) {
    const uniqueProducts = products.length;
    const uniqueBrands = [...new Set(products.map(p => p.brand))].length;

    document.getElementById('totalProducts').textContent = uniqueProducts;
    document.getElementById('totalBrands').textContent = uniqueBrands;

    const { brandShares } = calculateShareOfShelf(products);
    const brandBreakdown = document.getElementById('brandBreakdown');

    brandBreakdown.innerHTML = brandShares.map(({ brand, percentage }) => `
        <div class="brand-item">
            <div class="brand-name">${brand}</div>
            <div class="brand-bar-container">
                <div class="brand-bar" style="width: ${percentage}%">
                    <span class="brand-percentage">${percentage}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Populate brand filter
function populateBrandFilter(products) {
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const brandFilter = document.getElementById('brandFilter');

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// Render products table
function renderProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    const noResults = document.getElementById('noResults');

    if (products.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <div class="product-image">
                        <span class="product-placeholder">📦</span>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-id">${product.id}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge status-${product.availability}">
                    ${product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <span class="facings-count">${product.facings}</span>
            </td>
            <td>
                <a href="#" class="view-images-link" onclick="openImageModal('${product.id}', '${product.name}', ${product.images}); return false;">
                    View Images →
                </a>
            </td>
        </tr>
    `).join('');
}

// Apply filters
function applyFilters() {
    const brandFilter = document.getElementById('brandFilter').value;
    const availabilityFilter = document.getElementById('availabilityFilter').value;

    filteredProducts = currentScan.products.filter(product => {
        const matchesBrand = !brandFilter || product.brand === brandFilter;
        const matchesAvailability = !availabilityFilter || product.availability === availabilityFilter;

        return matchesBrand && matchesAvailability;
    });

    renderProducts(filteredProducts);
}

// Clear filters
function clearFilters() {
    document.getElementById('brandFilter').value = '';
    document.getElementById('availabilityFilter').value = '';
    filteredProducts = [...currentScan.products];
    renderProducts(filteredProducts);
}

// Open image modal
function openImageModal(productId, productName, imageCount) {
    const modal = document.getElementById('imageModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalImages = document.getElementById('modalImages');

    modalProductName.textContent = productName;

    // Generate placeholder images
    modalImages.innerHTML = Array.from({ length: imageCount }, (_, i) => `
        <div class="modal-image">
            <div class="image-placeholder">
                <div style="font-size: 48px; margin-bottom: 8px;">📸</div>
                <div>Image ${i + 1}</div>
                <div style="font-size: 12px; color: #999; margin-top: 4px;">${productId}</div>
            </div>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const scanId = getScanIdFromURL();
    currentScan = mockScanDetails[scanId];

    if (!currentScan) {
        alert('Scan not found');
        window.location.href = 'index.html';
        return;
    }

    // Update header
    document.getElementById('scanTitle').textContent = `${currentScan.category} - Aisle Scan`;
    document.getElementById('scanSubtitle').textContent = formatDateTime(currentScan.datetime);

    // Render all data
    renderShareOfShelf(currentScan.products);
    populateBrandFilter(currentScan.products);

    filteredProducts = [...currentScan.products];
    renderProducts(filteredProducts);

    // Add event listeners
    document.getElementById('brandFilter').addEventListener('change', applyFilters);
    document.getElementById('availabilityFilter').addEventListener('change', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

    // Modal close listeners
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('imageModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') {
            closeModal();
        }
    });
});

// Make functions available globally
window.openImageModal = openImageModal;
window.closeModal = closeModal;
