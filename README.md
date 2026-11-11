# Social-App

Backend API for a social app, built with Express, TypeScript and MongoDB (Mongoose), with Redis for caching.

## Features (so far)

**Auth module**
- User registration and email verification (OTP)
- Login with access token + refresh token (httpOnly cookies), with login attempts limit
- Token refreshing
- Password reset with OTP
- Google sign-in

## Tech

express, typescript, mongoose, redis (ioredis), zod, argon2, jsonwebtoken, nodemailer / mailjet, google-auth-library

## Getting started

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Other scripts: `npm run build`, `npm start`.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user and send a verification code |
| POST | `/api/auth/verify-account` | Verify the account with the code |
| POST | `/api/auth/login` | Login (sets `access_token` and `refresh_token` cookies) |
| POST | `/api/auth/send-otp` | Send a new OTP |
| POST | `/api/auth/reset-password` | Reset the password with an OTP |
| POST | `/api/auth/login-google` | Login with a Google ID token |
| POST | `/api/auth/refresh-token` | Get a new token pair |

## Postman

[Social-App API collection](https://go.postman.co/workspace/4ae48e01-46cd-4a98-8023-3fc41d6f346e)

The workspace contains the **Social-App API** collection and the **Social-App Local** environment (`baseUrl = http://localhost:3000`).

## Docs

- [requirements](docs/requirements.md)
- [db design](docs/db-design.md)
