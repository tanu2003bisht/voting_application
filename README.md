# Voting Application

A backend application for a voting system built with Node.js, Express.js and MongoDB. Users can vote for candidates with JWT authentication.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)

## Setup

1. Clone the repo

2. Install dependencies

3. Create a `.env` file

4. Run the server

## Features
- User signup and login with Aadhar Card Number and password
- View list of candidates
- Vote for a candidate (only once)
- Admin can manage candidates
- Admin cannot vote

## Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login a user |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | Get all candidates |
| POST | `/candidates` | Add a candidate (Admin only) |
| PUT | `/candidates/:id` | Update a candidate (Admin only) |
| DELETE | `/candidates/:id` | Delete a candidate (Admin only) |

### Voting
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates/vote/count` | Get vote count |
| POST | `/candidates/vote/:id` | Vote for a candidate (User only) |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile/password` | Change password |