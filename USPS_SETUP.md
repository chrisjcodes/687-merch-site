# USPS Address Validation Setup

## Overview
The customer management system now includes USPS address validation and auto-completion features that provide:

- **ZIP Code Lookup**: Auto-fills city and state when you enter a ZIP code
- **Address Validation**: Validates complete addresses against USPS database
- **Address Correction**: Suggests corrected addresses when possible
- **Suite/Apartment Support**: Clean handling of secondary address lines

## Setup Instructions

### 1. Get USPS API Credentials
1. Visit [USPS Developer Portal](https://developer.usps.com/apis)
2. Sign up for a free account
3. Register for the **Address Validation API** and **City State Lookup API**
4. You'll receive a **User ID** (not an API key)

### 2. Add Environment Variable
Add to your `.env.local` file:
```bash
USPS_USER_ID=your_usps_user_id_here
```

### 3. Test the Integration
1. Restart your development server: `npm run dev`
2. Go to Admin → Customers → Add Customer
3. In the shipping address section:
   - Enter a ZIP code (e.g., "90210") - city/state should auto-fill
   - Fill in the street address
   - Click "Validate Address" to verify with USPS

## Features

### 🎯 ZIP Code Auto-Complete
- **Type ZIP code** → City and state automatically populate
- **Loading indicator** shows while looking up
- **Works with 5-digit ZIP codes**

### ✅ Address Validation
- **Validates complete addresses** against USPS database
- **Visual feedback** with success/warning/error states
- **Address correction** - updates form with USPS-validated format
- **Handles common errors** like invalid addresses

### 🏠 User Experience
- **Clean workflow**: ZIP first, then street, then optional suite/apartment
- **Smart placeholders** guide users
- **Optional validation** - doesn't block form submission
- **Error handling** - graceful fallback if service is unavailable

## API Endpoints Created

### Address Validation
- **POST** `/api/address/validate`
- Validates complete address against USPS
- Returns validated/corrected address format

### ZIP Code Lookup  
- **GET** `/api/address/lookup?zip=90210`
- Returns city and state for ZIP code
- Used for auto-completion

### Service Status
- **GET** `/api/address/validate`
- Check if USPS integration is configured and available

## Implementation Notes

### Security
- ✅ **Server-side only** - USPS API called from backend
- ✅ **Authentication required** - Users must be logged in
- ✅ **No API key exposure** - Credentials stay in environment variables

### Error Handling
- ✅ **Graceful degradation** - Form works without validation
- ✅ **Clear error messages** - Users understand what went wrong
- ✅ **Fallback behavior** - Manual address entry always possible

### Data Format
```typescript
interface ShippingAddress {
  street: string;        // "123 Main Street"
  street2?: string;      // "Apt 4B" (optional)
  city: string;          // "Beverly Hills"
  state: string;         // "CA"
  zipCode: string;       // "90210"
  country?: string;      // "United States"
}
```

## Testing Without USPS API

If you don't want to set up USPS API credentials:
1. The form still works - just no auto-completion or validation
2. Users can manually enter all address fields
3. No errors are shown, features are simply unavailable

## Future Enhancements

- **International address support** (currently US-only)
- **Real-time address suggestions** as user types
- **Delivery point validation** for more precise addresses
- **Bulk address validation** for importing customer lists

The integration provides a professional address entry experience while maintaining full functionality for users who prefer manual entry.