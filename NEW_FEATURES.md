# New Features Implementation

This document describes the two new features that have been implemented in the Prescripto application.

## 1. Notification System

### Backend Implementation

#### Models

- **Notification Model** (`backend/models/notificationModel.js`)
  - Fields: `userId`, `title`, `message`, `read`, `createdAt`
  - References user model for notifications

#### Controllers

- **Notification Controller** (`backend/controllers/notificationController.js`)
  - `createNotification` - Create a new notification
  - `getUserNotifications` - Get all notifications for a user with unread count
  - `markNotificationAsRead` - Mark a specific notification as read
  - `markAllNotificationsAsRead` - Mark all notifications as read for a user

#### Routes

- **Notification Routes** (`backend/routes/notificationRoute.js`)
  - `POST /api/notifications` - Create notification
  - `GET /api/notifications/:userId` - Get user notifications
  - `PATCH /api/notifications/:id/read` - Mark notification as read
  - `PATCH /api/notifications/mark-all-read` - Mark all as read

### Frontend Implementation

#### Components

- **NotificationDropdown** (`frontend/src/components/NotificationDropdown.jsx`)
  - Notification bell icon with unread count badge
  - Dropdown list showing latest notifications
  - Mark individual notifications as read
  - Mark all notifications as read
  - Auto-refresh every 30 seconds

#### Integration

- Added to Navbar component for logged-in users
- Real-time notification updates
- Responsive design with proper styling

### Automatic Notifications

The system automatically creates notifications for:

- Successful appointment booking
- Appointment cancellation
- Review submission

## 2. Review System for Doctors

### Backend Implementation

#### Models

- **Review Model** (`backend/models/reviewModel.js`)
  - Fields: `doctorId`, `userId`, `rating`, `comment`, `createdAt`
  - Unique constraint: one review per user per doctor
  - Rating validation: 1-5 stars

#### Controllers

- **Review Controller** (`backend/controllers/reviewController.js`)
  - `addReview` - Add a new review for a doctor
  - `getDoctorReviews` - Get all reviews for a doctor with average rating
  - `getUserReviewForDoctor` - Get user's review for a specific doctor

#### Routes

- **Review Routes** (`backend/routes/reviewRoute.js`)
  - `POST /api/reviews` - Add a review
  - `GET /api/reviews/doctor/:doctorId` - Get doctor reviews
  - `GET /api/reviews/user/:userId/doctor/:doctorId` - Get user's review

### Frontend Implementation

#### Components

- **DoctorReviews** (`frontend/src/components/DoctorReviews.jsx`)
  - Display average rating with star visualization
  - Show total review count
  - List all reviews with user names and dates
  - Review submission form for logged-in users
  - Star rating input (1-5 stars)
  - Comment textarea
  - Prevent duplicate reviews per user

#### Integration

- Added to Appointment page (doctor profile)
- Shows reviews below appointment booking section
- Responsive design with proper styling

## API Endpoints Summary

### Notifications

- `POST /api/notifications` - Create notification
- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read

### Reviews

- `POST /api/reviews` - Add review
- `GET /api/reviews/doctor/:doctorId` - Get doctor reviews
- `GET /api/reviews/user/:userId/doctor/:doctorId` - Get user review

## Features

### Notification System Features

- ✅ Real-time notification bell with unread count
- ✅ Dropdown notification list
- ✅ Mark individual notifications as read
- ✅ Mark all notifications as read
- ✅ Auto-refresh notifications
- ✅ Automatic notifications for key actions
- ✅ Responsive design

### Review System Features

- ✅ Star rating display (1-5 stars)
- ✅ Average rating calculation
- ✅ Review count display
- ✅ User review submission form
- ✅ Prevent duplicate reviews
- ✅ Review list with user names and dates
- ✅ Responsive design
- ✅ Integration with doctor profile page

## Usage

### For Users

1. **Notifications**: Click the bell icon in the navbar to view notifications
2. **Reviews**: Visit any doctor's profile page to view and submit reviews

### For Developers

1. **Creating Notifications**: Use the notification API to create notifications for users
2. **Review Management**: Use the review API to manage doctor reviews

## Database Schema

### Notifications Collection

```javascript
{
  userId: ObjectId, // Reference to user
  title: String,    // Notification title
  message: String,  // Notification message
  read: Boolean,    // Read status (default: false)
  createdAt: Date   // Creation timestamp
}
```

### Reviews Collection

```javascript
{
  doctorId: ObjectId, // Reference to doctor
  userId: ObjectId,   // Reference to user
  rating: Number,     // 1-5 star rating
  comment: String,    // Review comment
  createdAt: Date     // Creation timestamp
}
```

## Security

- All routes are protected with authentication middleware
- Users can only access their own notifications
- Users can only submit one review per doctor
- Input validation for all fields
