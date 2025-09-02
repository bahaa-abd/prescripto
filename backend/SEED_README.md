# Database Seeding

This directory contains a seed file to populate the database with sample doctor data.

## How to Run the Seed

### Prerequisites

1. Make sure your MongoDB database is running
2. Ensure your `.env` file has the correct `MONGODB_URI` configured
3. Install dependencies: `npm install`

### Running the Seed

From the backend directory, run:

```bash
npm run seed
```

This will:

- Connect to your MongoDB database
- Clear all existing doctors from the database
- Add 15 sample doctors with hashed passwords
- Close the database connection

### What Gets Seeded

The seed file adds 15 doctors with the following specialties:

- General physician (4 doctors)
- Gynecologist (3 doctors)
- Dermatologist (3 doctors)
- Pediatricians (2 doctors)
- Neurologist (3 doctors)

Each doctor includes:

- Name and email
- Hashed password (default: "test1234")
- Professional image (using local assets from frontend/src/assets/)
- Speciality, degree, and experience
- About section
- Consultation fees
- Address information

### Default Login Credentials

All seeded doctors use the password: `test1234`

You can log in with any of the seeded doctor emails, for example:

- `richard.james@prescripto.com`
- `emily.larson@prescripto.com`
- etc.

### Customization

To modify the seed data:

1. Edit the `doctors` array in `seed.js`
2. Run `npm run seed` again to update the database

### Notes

- The seed file will clear all existing doctors before adding new ones
- Images are sourced from local assets in `frontend/src/assets/` (doc1.png through doc15.png)
- All passwords are properly hashed using bcrypt
- The seed file can be run multiple times safely
