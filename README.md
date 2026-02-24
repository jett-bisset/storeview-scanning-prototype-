# StoreView Scanning Prototype

This is a fully functional HTML/CSS/JavaScript prototype implementing all requirements from the [WIP][DEMO] StoreView Scanning requirements document.

## Password Protection

This prototype is password protected. The default password is: **storeview2026**

To change the password, edit `auth.js` and update the `CORRECT_PASSWORD` value.

## How to Use

1. Open `index.html` in your web browser
2. Enter the password when prompted
3. Browse the home page showing recent scans
4. Click on any scan row to view detailed product information

## Features Implemented

### Home Page (index.html)
- ✅ **P0**: Table showing Day/Time and Number of unique UPCs detected
- ✅ **P1**: Scan source (shopper ID) and Category columns
- ✅ **P1**: Filters for Date/Time and Scan source
- ✅ Data limited to past ~2 days

### Scan Detail Page (scan-detail.html)
- ✅ **P0**: Product details (name, image placeholders)
- ✅ **P0**: Availability status (In-stock vs Out-of-stock badges)
- ✅ **P0**: View images functionality (opens modal with images)
- ✅ **P1**: Number of facings detected
- ✅ **P1**: Brand and In-stock vs OOS filters
- ✅ **P2**: Share of Shelf summary table showing:
  - Total unique products scanned
  - Total unique brands scanned
  - Brand-by-brand share of shelf percentages with visual bars

## Mock Data

The prototype includes realistic mock data:
- **7 scans** spread across the past ~2 days
- **Multiple shoppers** (IDs: 28451, 19203, 34782, 41209)
- **Various categories** (Beverages, Snacks, Condiments, Dairy, etc.)
- **Detailed product data** for Beverages and Snacks scans

## Customization

To modify the mock data:
- Edit `app.js` for scan-level data
- Edit `scan-detail.js` for product-level data

## Browser Compatibility

Works in all modern browsers (Chrome, Safari, Firefox, Edge).
