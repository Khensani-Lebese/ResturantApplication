# Restaurant Reservation System - Client Application

Backend Server - https://github.com/J3ZZ3/Restaurant_Server.git

## Overview
A comprehensive React Native mobile application for restaurant reservations, built with Expo. The application allows users to browse restaurants, make reservations, manage their bookings, and handle payments.

## Features
- User Authentication (Login/Register)
- Restaurant Browsing & Filtering
- Reservation Management
- Real-time Payment Processing
- Profile Management
- Interactive UI Components
- Responsive Design
- Security Features

## Tech Stack
- React Native
- Expo Router
- Axios
- AsyncStorage
- React Native Paper
- Expo Vector Icons
- Linear Gradient
- React Native Calendars
- WebView
- Expo AV (Audio/Video)

## Project Structure

### Core Components
- `CustomText` - Standardized text component
- `CustomButton` - Reusable button component
- `CustomInput` - Form input component
- `CustomAlert` - Custom alert modal
- `CustomNumberPicker` - Number selection component
- `AnimatedTitle` - Animated text component
- `Navbar` - Navigation bar component
- `ReservationForm` - Reservation creation form
- `ReservationCard` - Reservation display card
- `RestaurantCard` - Restaurant display card

### Screens
- `Login.js` - User authentication
- `Register.js` - New user registration
- `Restaurants.js` - Restaurant listing
- `RestaurantDetail.js` - Individual restaurant view
- `Reservation.js` - Reservation creation
- `ReservationDetail.js` - Individual reservation view
- `Profile.js` - User profile management
- `Settings.js` - Application settings
- `Payment.js` - Payment processing

### Services
- `api.js` - API integration and endpoints

## Setup & Installation

1. Clone the repository

```bash
git clone https://github.com/Khensani-Lebese/ResturantApplication.git
```

2. Install dependencies
```bash
cd ResturantApplication
npm install
```

3. Configure environment variables
Create a `.env` file with:
```
EXPO_PUBLIC_API_URL=your-api-url
```

4. Start the development server
```bash
npx expo start
```

## API Integration
The application connects to a backend server through `api.js`. Key endpoints include:
- Authentication (/auth)
- Restaurants (/restaurants)
- Reservations (/reservations)
- User Profile (/users)
- Payments (/payments)

## Key Features Implementation

### Authentication
- JWT-based authentication
- Secure token storage using AsyncStorage
- Auto-login functionality
- Session management

### Reservation System
- Date and time selection
- Party size specification
- Special requests handling
- Real-time availability checking
- Payment integration

### User Profile
- Profile image upload
- Personal information management
- Reservation history
- Preferences settings

### Restaurant Features
- Detailed restaurant information
- Menu preview
- Location integration
- Rating system
- Cuisine filtering

## UI/UX Features
- Custom animations
- Interactive components
- Loading states
- Error handling
- Form validation
- Responsive design
- Dark/Light theme support

## Security Features
- Secure password handling
- Token-based authentication
- Input validation
- Secure storage
- API error handling

## Authors
Khensani
Jesse
Arthur 


## Acknowledgments
- Expo Team
- React Native Community
