# 🚀 Quick Start Guide

Get your CI/CD pipeline up and running in 10 minutes!

## ⚡ Prerequisites

- GitHub repository with code pushed
- Netlify account connected to your repository
- Admin access to GitHub repository

## 📝 Setup Checklist

### Step 1: Add GitHub Secrets (5 minutes)

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

#### Required Secrets

| Secret Name | How to Get It |
|-------------|---------------|
| `NETLIFY_AUTH_TOKEN` | 1. Go to [Netlify](https://app.netlify.com/)<br>2. Click your profile → **User settings**<br>3. **Applications** → **New access token**<br>4. Copy the token |
| `NETLIFY_SITE_ID` | 1. Go to your site in Netlify<br>2. **Site settings**<br>3. Copy the **API ID** |

### Step 2: Update Configuration (2 minutes)

#### Edit `.github/CODEOWNERS`
```bash
# Replace @your-github-username with your actual GitHub username
# Example: * @jswil
```

#### Edit `ai-code-review.yml` (Optional - for SonarCloud)
If using SonarCloud, update:
```yaml
-Dsonar.projectKey=your-project-key
-Dsonar.organization=your-org-name
```

### Step 3: Enable Branch Protection (2 minutes)

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Check these boxes:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
5. Click **Create**

### Step 4: Enable Dependabot (1 minute)

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Dependabot version updates

### Step 5: Push and Test! (1 minute)

```bash
# If you haven't already pushed the .github folder
git add .github/
git commit -m "ci: add GitHub Actions workflows"
git push origin main

# Create a test branch
git checkout -b test/ci-setup
echo "# Testing CI" >> README.md
git add README.md
git commit -m "test: verify CI pipeline"
git push origin test/ci-setup
```

Then go to GitHub and create a Pull Request from `test/ci-setup` to `main`.

## ✅ Verification

You should see these workflows running:

- ✅ CI Pipeline
- ✅ Code Quality & Linting
- ✅ Security Audit
- ✅ AI Code Review (may take longer)

## 🎉 You're Done!

Your CI/CD pipeline is now active! Every time you:

- **Create a PR**: All checks run automatically
- **Push to main**: Deploys to production
- **Monday mornings**: Dependabot checks for updates
- **Every day at 2 AM**: Security scans run

## 🔧 Optional Enhancements

### Add Claude AI Code Review

1. Sign up at https://console.anthropic.com/
2. Create API key
3. Add as `ANTHROPIC_API_KEY` secret
4. Cost: ~$0.01-0.05 per review

### Add SonarCloud

1. Sign up at https://sonarcloud.io/
2. Import your repository
3. Get token from **My Account** → **Security**
4. Add as `SONAR_TOKEN` secret
5. Update project key in `ai-code-review.yml`

### Add Snyk

1. Sign up at https://snyk.io/
2. Connect GitHub
3. Get token from **Account Settings**
4. Add as `SNYK_TOKEN` secret

## 🆘 Troubleshooting

### "Workflow not running"
- Check `.github/workflows/` folder exists
- Verify YAML syntax is correct
- Ensure Actions are enabled in Settings → Actions

### "Netlify deployment failed"
- Verify secrets are correct (no extra spaces)
- Check Netlify site ID matches your site
- Review Netlify build logs

### "Tests failing"
- Normal if you have linting errors
- Fix errors shown in the workflow logs
- Commit fixes and push again

## 📚 Learn More

- [Full Setup Guide](.github/SETUP_GUIDE.md) - Detailed configuration
- [CI/CD Overview](.github/CICD_OVERVIEW.md) - Architecture and workflows
- [Workflow README](.github/workflows/README.md) - Individual workflow details

## 🎯 Next Steps

1. Review and merge the test PR
2. Watch your first production deployment
3. Set up optional AI tools for better code review
4. Configure branch protection rules for `develop` branch
5. Add status badges to your README

---

**Need Help?** Check the [Setup Guide](.github/SETUP_GUIDE.md) or create an issue.

