# Amrutha BharatGas Management System

A robust, enterprise-grade full-stack solution built to manage gas agency operations, including inventory, bookings, deliveries, and real-time fleet tracking.

## 🚀 Key Features

* **Secure Authentication**: Passwordless login using real-time OTP verification (Fast2SMS integration).
* **Godown Inventory Management**: Live tracking of 14.2kg, 19kg, and 5kg cylinder stock with reorder alerts.
* **Fleet Telemetry**: Integration with SeTrack for real-time GPS monitoring of delivery vehicles.
* **Customer Booking Pipeline**: End-to-end booking flow with status updates and OTP-based delivery verification.
* **Admin Dashboard**: Analytical KPIs including revenue tracking and delivery metrics.
* **Staff Management**: Secure staff record maintenance with OTP-authorized phone number changes.

## 🛠 Tech Stack

* **Backend**: Laravel (PHP 8.x)
* **Frontend**: React (TypeScript) + Vite
* **Database**: SQLite (Migratable to MySQL/PostgreSQL)
* **Styling**: Tailwind CSS + Framer Motion
* **Authentication**: Laravel Sanctum

## 📦 Project Structure

```text
amrutha-bharatgas/
├── app/
│   ├── Http/Controllers/Api/  # Business logic & API endpoints
│   └── Models/               # Database Eloquent models
├── database/
│   ├── migrations/           # Database schema definitions
│   └── seeders/              # Initial test data
├── resources/
│   └── js/                   # React components, pages, & layout
├── routes/
│   ├── api.php               # Protected API routes
│   └── web.php               # SPA fallback route
└── .env                      # Environment configuration
```
## ⚙️ Installation

### Clone the repository:
```bash
git clone [https://github.com/your-username/BharatGas.git](https://github.com/your-username/BharatGas.git)
```

### Backend Setup:
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```
### Frontend Setup:
``` Bash
npm install
npm run dev 
```

## ⚙️ Environment Variables
Configure the following in your `.env` file:

* **FAST2SMS_API_KEY**: Your SMS API credentials.
* **SETRACK_COOKIE_STRING**: Cookie for fleet telemetry integration.

## 🛡 Security & Auth Flow

1. **Customer Registration**: New customers are created with `is_approved` set to `false`.
2. **Admin Approval**: Admins review customer details and toggle `is_approved` to `true` via the admin dashboard.
3. **Login**: Only approved customers can proceed with OTP verification.