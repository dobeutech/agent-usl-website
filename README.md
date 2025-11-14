# Unique Staffing Professionals - Website & Applicant System

A modern, professional staffing agency website with integrated applicant tracking system and admin dashboard.

## 🎯 Project Overview

This project delivers a complete website revamp for Unique Staffing Professionals Inc., including:

- **Modernized Website**: Professional UI with responsive design
- **Applicant System**: Public-facing application form with resume upload
- **Admin Dashboard**: Secure portal to manage applicants
- **Supabase Backend**: Scalable database, authentication, and file storage

## ✨ Features

### Public Website
- Professional hero section with clear CTAs
- Services showcase
- Industries served
- Why choose us section
- Client testimonials
- Contact form
- **NEW**: Job applicant submission form with resume upload

### Applicant Submission
- Personal information capture (name, email, phone)
- Position and experience details
- Resume/CV upload (PDF, DOC, DOCX up to 5MB)
- Optional cover letter
- Form validation and error handling
- Success notifications

### Admin Portal
- Secure authentication system
- Dashboard with real-time statistics
- View all applicants in sortable table
- Advanced filtering and search:
  - Search by name, email, or position
  - Filter by application status
  - Sort by date or name
- Applicant status management (New, Reviewing, Shortlisted, Rejected, Hired)
- Internal notes system
- Resume download functionality
- Detailed applicant view

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unique-staffing-prof
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Follow the complete setup guide in `SUPABASE_SETUP.md`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

6. **Build for production**
   ```bash
   npm run build
   ```

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase configuration guide
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Detailed project documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Phosphor Icons
- **Routing**: React Router DOM
- **Backend**: Supabase
  - PostgreSQL Database
  - Authentication
  - Storage
- **Notifications**: Sonner
- **Form Validation**: React Hook Form + Zod

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # UI component library
│   ├── ApplyForm.tsx    # Applicant submission form
│   ├── Navigation.tsx   # Site navigation
│   ├── Hero.tsx         # Hero section
│   └── ...
├── contexts/
│   └── AuthContext.tsx  # Authentication provider
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utilities
├── pages/
│   ├── Home.tsx         # Public homepage
│   ├── AdminLogin.tsx   # Admin authentication
│   └── AdminDashboard.tsx # Admin panel
└── App.tsx              # Main app with routing
```

## 🔐 Admin Access

### Creating Admin Users

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. Confirm the email address
6. Use these credentials to log in at `/admin/login`

## 🌐 Routes

- `/` - Public homepage with application form
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Public can only submit applications
- Authenticated users only can view/manage data
- Private storage for resumes
- Protected admin routes
- Secure session management

## 📊 Database Schema

### Applicants Table
```
- id (UUID, primary key)
- created_at (timestamp)
- updated_at (timestamp)
- full_name (text)
- email (text)
- phone (text)
- position_interested (text)
- experience_years (integer)
- resume_url (text, nullable)
- resume_filename (text, nullable)
- cover_letter (text, nullable)
- status (enum: new, reviewing, shortlisted, rejected, hired)
- notes (text, nullable)
```

## 🧪 Testing Locally

1. Start the dev server: `npm run dev`
2. Open [http://localhost:5173](http://localhost:5173)
3. Submit a test application
4. Log in to admin at [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
5. Verify the application appears in the dashboard

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Recommended hosting**: Vercel, Netlify, or AWS Amplify

Quick deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Colors
Colors are defined in `tailwind.config.js` using the project's brand colors:
- Primary: Deep professional blue
- Secondary: Light blue backgrounds
- Accent: Warm orange

### Content
Update content in the respective component files:
- Hero text: `src/components/Hero.tsx`
- Services: `src/components/Services.tsx`
- Contact info: `src/components/Contact.tsx`

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Issues
- Verify `.env` variables are correct
- Check Supabase project is active
- Ensure RLS policies are configured

### Admin Login Issues
- Verify admin user is created in Supabase
- Check email is confirmed
- Clear browser cache/cookies

## 📦 Optional Add-ons

These features can be added for additional development:
- Email notifications
- SMS alerts
- CSV export
- Multiple admin roles
- Employer portal
- Advanced search/filtering
- Interview scheduling
- Automated responses

## 📄 License

Proprietary - All rights reserved by Unique Staffing Professionals Inc.

## 🤝 Support

For technical support or questions:
- Review documentation files
- Check [Supabase docs](https://supabase.com/docs)
- Review component code comments

## ✅ Project Deliverables

- [x] Website UI revamp and modernization
- [x] Supabase backend setup
- [x] Applicant submission form with file uploads
- [x] Admin login system (Supabase Auth)
- [x] Admin dashboard with sorting, filtering, and status updates
- [x] Resume download functionality
- [x] Comprehensive documentation
- [x] Production-ready build
- [x] Mobile-responsive design
- [x] Security best practices

**Project Status**: ✅ Complete and ready for deployment

---

Built with ❤️ for Unique Staffing Professionals Inc.
