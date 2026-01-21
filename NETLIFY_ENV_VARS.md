# Netlify Environment Variables

This document lists all environment variables required for successful Netlify builds and deployment.

## Required Environment Variables

These variables **must** be set in Netlify for the application to function properly:

### 1. `VITE_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Format**: `https://[project-ref].supabase.co`
- **Example**: `https://ynedsbgiveycubmusjzf.supabase.co`
- **Where to find**: Supabase Dashboard → Settings → API → Project URL
- **Required**: ✅ Yes

### 2. `VITE_SUPABASE_ANON_KEY`
- **Description**: Your Supabase anonymous/public key (safe for client-side use)
- **Format**: Long alphanumeric string starting with `eyJ...`
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Required**: ✅ Yes

## Optional Environment Variables

These variables enhance functionality but are not required for basic operation:

### 3. `VITE_GOOGLE_MAPS_API_KEY`
- **Description**: Google Maps API key for embedded maps and location features
- **Format**: Alphanumeric string
- **Example**: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Where to find**: Google Cloud Console → APIs & Services → Credentials
- **Required**: ❌ No (Google Maps features will be disabled if not set)
- **Note**: If not provided, the app will work but Google Maps embeds will not function

### 4. `VITE_FORCE_DEMO_MODE`
- **Description**: Force the application to run in demo mode (uses mock data instead of Supabase)
- **Format**: `"true"` or `"false"` (string)
- **Example**: `true`
- **Required**: ❌ No
- **Note**: Only set to `"true"` for testing/demo purposes. In production, leave unset or set to `"false"`.

## Where to Store Environment Variables: Netlify vs GitHub

### For This Project: **Netlify Only** ✅

Since this project:
- Uses Netlify for builds and deployment
- Has no GitHub Actions workflows
- Uses client-side environment variables (`VITE_*`)

**Store all environment variables in Netlify only.**

### When to Use GitHub Secrets

GitHub Secrets are only needed if you have:
- **GitHub Actions workflows** that need these values
- **CI/CD pipelines** running on GitHub
- **Automated testing** that requires these variables
- **Pre-deployment scripts** that run in GitHub Actions

### Best Practice Summary

| Scenario | Store In | Why |
|----------|----------|-----|
| **Netlify deployment only** (this project) | **Netlify** | Variables are used during Netlify builds and available to the deployed app |
| **GitHub Actions workflows** | **GitHub Secrets** | Workflows need access during CI/CD runs |
| **Both Netlify + GitHub Actions** | **Both** | Keep them in sync - Netlify for builds, GitHub for workflows |

### ⚠️ Important Security Notes

1. **Never commit secrets to Git** - Don't add `.env` files with real values to your repository
2. **GitHub Secrets ≠ Netlify Variables** - They are separate systems and don't automatically sync
3. **Client-side variables** (`VITE_*`) are bundled into your build - they're visible in the browser, so only use public keys
4. **Service role keys** should NEVER be in client-side code - only use `anon` keys for `VITE_SUPABASE_ANON_KEY`

## How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Enter the variable name (e.g., `VITE_SUPABASE_URL`)
5. Enter the variable value
6. Select the scope:
   - **All scopes** (default) - applies to all contexts
   - **Production** - only for production builds
   - **Deploy previews** - only for PR previews
   - **Branch deploys** - only for branch deployments
7. Click **Save**
8. Repeat for each variable

### Method 2: Netlify CLI

```bash
# Set for all contexts
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"

# Set for production only
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co" --context production

# Set optional variables
netlify env:set VITE_GOOGLE_MAPS_API_KEY "your-google-maps-key"
```

### Method 3: `netlify.toml` (Not Recommended for Secrets)

⚠️ **Warning**: Do not commit secrets to `netlify.toml`. Use this only for non-sensitive configuration.

```toml
[build.environment]
  VITE_FORCE_DEMO_MODE = "false"
  # DO NOT add VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY here
```

## Verification

After setting environment variables:

1. **Trigger a new build** in Netlify (or push a commit)
2. **Check build logs** to ensure variables are loaded:
   - Look for: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in build output
   - If missing, you'll see warnings in the console
3. **Test the deployed site**:
   - Verify Supabase connection works
   - Check browser console for any missing variable warnings

## Troubleshooting

### Build Fails with "Missing Supabase environment variables"

- **Cause**: `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` not set
- **Solution**: Add both variables in Netlify dashboard and trigger a new build

### App Works but Shows Demo Mode

- **Cause**: Either variables are missing or `VITE_FORCE_DEMO_MODE` is set to `"true"`
- **Solution**: 
  1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
  2. Ensure `VITE_FORCE_DEMO_MODE` is not set or is set to `"false"`

### Google Maps Not Loading

- **Cause**: `VITE_GOOGLE_MAPS_API_KEY` not set or invalid
- **Solution**: 
  1. Add `VITE_GOOGLE_MAPS_API_KEY` in Netlify
  2. Verify the API key is valid and has Maps JavaScript API enabled

## Security Notes

- ✅ **Safe to expose**: `VITE_SUPABASE_ANON_KEY` (designed for client-side use)
- ✅ **Safe to expose**: `VITE_GOOGLE_MAPS_API_KEY` (can be restricted by domain)
- ❌ **Never expose**: Supabase service role key (server-side only)
- ❌ **Never commit**: Any `.env` files with actual secrets to git

## Quick Setup Checklist

- [ ] Set `VITE_SUPABASE_URL` in Netlify
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Netlify
- [ ] (Optional) Set `VITE_GOOGLE_MAPS_API_KEY` if using maps
- [ ] (Optional) Set `VITE_FORCE_DEMO_MODE` to `"false"` or leave unset
- [ ] Trigger a new build
- [ ] Verify build succeeds
- [ ] Test deployed site functionality

## Example Configuration

Here's what your Netlify environment variables should look like:

```
VITE_SUPABASE_URL=https://ynedsbgiveycubmusjzf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWRzYmdpdmV5Y3VibXVzempmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.example
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note**: Replace the example values with your actual credentials.
