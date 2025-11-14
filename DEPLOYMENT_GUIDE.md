# Deployment Guide - Unique Staffing Professionals

This guide will walk you through deploying your application to production.

## Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema created (see SUPABASE_SETUP.md)
- [ ] Storage bucket created
- [ ] Admin user created in Supabase Auth
- [ ] Environment variables ready
- [ ] Application tested locally
- [ ] Build tested successfully (`npm run build`)

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest option for deploying React applications with automatic deployments from Git.

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub, GitLab, or Bitbucket
2. Make sure `.env` is in `.gitignore` (already done)
3. Commit all changes

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "Add New Project"
4. Import your Git repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings:
1. Go to "Settings" > "Environment Variables"
2. Add the following:
   ```
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Make sure to add them for all environments (Production, Preview, Development)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to "Settings" > "Domains"
2. Add your custom domain (e.g., `www.uniquestaffingprofessionals.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Option 2: Deploy to Netlify

### Step 1: Prepare Your Repository

Same as Vercel - ensure code is in Git and pushed.

### Step 2: Deploy to Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up or log in
3. Click "Add new site" > "Import an existing project"
4. Connect to your Git provider
5. Select your repository

### Step 3: Configure Build Settings

```
Build command: npm run build
Publish directory: dist
```

### Step 4: Add Environment Variables

1. Go to "Site settings" > "Environment variables"
2. Add:
   ```
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Step 5: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at `https://your-site.netlify.app`

### Step 6: Custom Domain (Optional)

1. Go to "Domain settings" > "Add custom domain"
2. Follow DNS configuration instructions

## Option 3: Deploy to AWS Amplify

### Step 1: Setup AWS Account

1. Create an AWS account if you don't have one
2. Go to AWS Amplify console

### Step 2: Connect Repository

1. Click "Get Started" under "Amplify Hosting"
2. Connect your Git provider
3. Select repository and branch

### Step 3: Configure Build Settings

Amplify should auto-detect Vite. If not, use:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Add Environment Variables

1. In the app settings, go to "Environment variables"
2. Add your Supabase credentials

### Step 5: Deploy

Click "Save and deploy"

## Option 4: Traditional Hosting (cPanel, etc.)

If you have traditional web hosting:

### Step 1: Build Locally

```bash
npm run build
```

This creates a `dist` folder with all static files.

### Step 2: Upload Files

1. Upload the contents of the `dist` folder to your web server
2. If using cPanel, upload to `public_html` or `www`

### Step 3: Configure Routing

Create a `.htaccess` file in the root directory (for Apache):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

For nginx, add to your config:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Step 4: Environment Variables

Since you can't use environment variables easily with static hosting:

1. Create a `config.js` file in your `public` folder:
   ```javascript
   window.ENV = {
     VITE_SUPABASE_URL: 'your-project-url.supabase.co',
     VITE_SUPABASE_ANON_KEY: 'your-anon-key'
   };
   ```

2. Include it in `index.html`:
   ```html
   <script src="/config.js"></script>
   ```

3. Update `src/lib/supabase.ts` to use:
   ```typescript
   const supabaseUrl = window.ENV?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = window.ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
   ```

## Post-Deployment Steps

### 1. Test the Application

- [ ] Visit the homepage
- [ ] Submit a test application
- [ ] Check if the application appears in Supabase
- [ ] Log in to admin dashboard
- [ ] Verify you can see the test application
- [ ] Test filtering and sorting
- [ ] Download the test resume
- [ ] Update application status
- [ ] Test on mobile devices

### 2. Configure Supabase for Production

1. **Check RLS Policies**: Ensure Row Level Security is enabled
2. **Review Storage Policies**: Confirm resume bucket is private
3. **Set up backup**: Configure automatic backups in Supabase settings
4. **Monitor usage**: Set up usage alerts in Supabase dashboard

### 3. Set Up Monitoring

1. **Error Tracking**: Consider adding Sentry for error tracking
2. **Analytics**: Add Google Analytics or Plausible
3. **Uptime Monitoring**: Use UptimeRobot or similar

### 4. Security Review

- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] Environment variables not exposed in client code
- [ ] RLS policies active on Supabase
- [ ] Storage bucket is private
- [ ] Admin routes are protected

### 5. Performance Optimization

1. **Enable Compression**: Most hosts do this automatically
2. **CDN**: Vercel/Netlify provide this by default
3. **Image Optimization**: Consider optimizing images further
4. **Code Splitting**: For future optimization if needed

## Continuous Deployment

With Vercel or Netlify:

1. Any push to your main branch triggers automatic deployment
2. Pull requests create preview deployments
3. No manual steps needed after initial setup

## Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working

- Ensure they're prefixed with `VITE_`
- Restart the build after adding variables
- Check they're set for the correct environment

### 404 Errors on Refresh

- Configure routing (see Option 4 above)
- Vercel/Netlify handle this automatically

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project is not paused
- Verify API keys are correct

## Rollback Plan

If something goes wrong:

### Vercel/Netlify
1. Go to "Deployments"
2. Find the last working deployment
3. Click "Promote to Production"

### Manual Hosting
1. Keep a backup of the previous `dist` folder
2. Replace files with the backup

## Updating the Application

1. Make changes locally
2. Test thoroughly: `npm run dev` and `npm run build`
3. Commit and push to Git
4. Automatic deployment triggers (Vercel/Netlify)
5. Test the production site

## Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://www.netlify.com/support/

## Custom Domain SSL

All recommended hosting providers (Vercel, Netlify, Amplify) provide:
- Free SSL certificates
- Automatic renewal
- No configuration needed

For traditional hosting, you may need to:
1. Purchase an SSL certificate, or
2. Use Let's Encrypt (free) if supported by your host

## Final Checklist

Before going live:

- [ ] All tests pass
- [ ] Admin login works
- [ ] Application submission works
- [ ] Resume uploads work
- [ ] Email/phone numbers are correct in Contact section
- [ ] Privacy policy and terms of service links (if required)
- [ ] Google Analytics or tracking (if desired)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place
- [ ] Team members have admin access

## Going Live

1. Update DNS to point to your hosting provider
2. Wait for DNS propagation (15 minutes to 48 hours)
3. Test the live site thoroughly
4. Announce to stakeholders
5. Monitor for the first few days

Congratulations! Your site is now live. 🎉
