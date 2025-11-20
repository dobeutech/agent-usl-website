# GitHub Actions Setup Guide

Complete guide to setting up CI/CD workflows for Unique Staffing Professionals.

## 🚀 Quick Start (5 minutes)

### Step 1: Push to GitHub

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

### Step 2: Add Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

#### Essential Secrets (Required for Deployment)

| Secret Name | Where to Get It | Required |
|-------------|----------------|----------|
| `NETLIFY_AUTH_TOKEN` | [Netlify Dashboard](https://app.netlify.com/user/applications) → Personal Access Tokens | ✅ Yes |
| `NETLIFY_SITE_ID` | Netlify Site Settings → Site information → API ID | ✅ Yes |

#### Optional Secrets (Recommended for Full Features)

| Secret Name | Where to Get It | Purpose |
|-------------|----------------|---------|
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) | Claude AI code review |
| `SONAR_TOKEN` | [SonarCloud](https://sonarcloud.io/) → My Account → Security | Code quality analysis |
| `SNYK_TOKEN` | [Snyk Dashboard](https://app.snyk.io/) → Account Settings → API Token | Security scanning |

## 📋 Detailed Setup Instructions

### 1. Get Netlify Credentials

#### Netlify Site ID
```bash
# If you have Netlify CLI installed
netlify sites:list

# Or manually
# 1. Go to https://app.netlify.com/
# 2. Select your site
# 3. Go to Site settings
# 4. Find "API ID" under Site information
```

#### Netlify Auth Token
1. Visit https://app.netlify.com/user/applications
2. Click "New access token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token (you won't see it again!)

### 2. Set Up Claude AI Code Review (Optional)

1. Sign up at https://console.anthropic.com/
2. Create an API key
3. Add to GitHub secrets as `ANTHROPIC_API_KEY`

**Cost**: ~$0.01-0.05 per code review (based on Claude Sonnet 4 pricing)

### 3. Set Up SonarCloud (Optional)

1. Go to https://sonarcloud.io/
2. Sign in with GitHub
3. Import your repository
4. Go to My Account → Security
5. Generate token
6. Add to GitHub secrets as `SONAR_TOKEN`
7. Update the project key in `ai-code-review.yml`:
   ```yaml
   -Dsonar.projectKey=YOUR_PROJECT_KEY
   -Dsonar.organization=YOUR_ORG_NAME
   ```

**Cost**: Free for open source, paid for private repos

### 4. Set Up Snyk (Optional)

1. Sign up at https://snyk.io/
2. Connect your GitHub account
3. Go to Account Settings → API Token
4. Copy token
5. Add to GitHub secrets as `SNYK_TOKEN`

**Cost**: Free tier available

## 🔐 Branch Protection Rules

Protect your `main` branch:

### Navigate to Settings
1. Go to your repository
2. Click Settings → Branches
3. Click "Add rule" or edit existing rule

### Recommended Configuration

**Branch name pattern**: `main`

#### Protect matching branches
- ✅ Require a pull request before merging
  - Required approvals: 1
  - Dismiss stale pull request approvals when new commits are pushed
  - Require review from Code Owners (if you have a CODEOWNERS file)

#### Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- Required status checks:
  - `CI Pipeline Complete`
  - `Build Application`
  - `Code Quality & Linting`
  - `Security Audit`
  - `CodeQL Security Analysis`

#### Additional rules
- ✅ Require conversation resolution before merging
- ✅ Require signed commits (recommended for production)
- ✅ Include administrators (even admins must follow these rules)

## 🎯 Configure Dependabot

Dependabot is already configured in `.github/dependabot.yml`. To enable:

1. Go to Settings → Code security and analysis
2. Enable "Dependabot alerts"
3. Enable "Dependabot security updates"
4. Enable "Dependabot version updates"

### What Dependabot Does

- 📦 Weekly dependency updates (Mondays at 9 AM EST)
- 🔒 Immediate security updates
- 🎯 Groups related packages together
- 📝 Auto-creates PRs with changelogs

## 📊 Verify Setup

### Check Workflows are Running

1. Go to Actions tab in your repository
2. You should see workflows listed
3. Click on any workflow to see runs

### Test the Setup

Create a test pull request:

```bash
git checkout -b test/ci-setup
echo "# Test" >> README.md
git add README.md
git commit -m "test: verify CI pipeline"
git push origin test/ci-setup
```

Then create a PR and verify:
- ✅ CI Pipeline runs
- ✅ Code quality checks pass
- ✅ Security scan completes
- ✅ AI code review appears (if configured)

## 🔧 Workflow Configuration

### Customizing Workflows

#### Change Schedule Times

Edit the cron expressions in workflow files:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

Use [Crontab Guru](https://crontab.guru/) to create custom schedules.

#### Adjust Security Severity

In `security-scan.yml`, change severity levels:

```yaml
severity: 'CRITICAL,HIGH,MEDIUM'  # or just 'CRITICAL,HIGH'
```

#### Modify Dependabot Frequency

In `.github/dependabot.yml`:

```yaml
schedule:
  interval: "daily"  # or "weekly", "monthly"
```

## 🎨 Add Status Badges to README

Add these badges to your `README.md`:

```markdown
# Unique Staffing Professionals

[![CI Pipeline](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/ci.yml)
[![Security Scan](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/security-scan.yml/badge.svg)](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/security-scan.yml)
[![Deploy Production](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/YOUR_USERNAME/REPO_NAME/actions/workflows/deploy-production.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE/deploys)
```

Replace `YOUR_USERNAME`, `REPO_NAME`, and `YOUR_NETLIFY_SITE_ID` with your values.

## 🐛 Troubleshooting

### Workflow Not Running

**Problem**: Workflows don't trigger
**Solution**:
1. Check workflow files are in `.github/workflows/`
2. Verify YAML syntax (use a YAML validator)
3. Ensure you have push access to the repository
4. Check Actions are enabled (Settings → Actions → General)

### Deployment Fails

**Problem**: Netlify deployment fails
**Solution**:
1. Verify `NETLIFY_AUTH_TOKEN` is correct
2. Check `NETLIFY_SITE_ID` matches your site
3. Ensure build command in `netlify.toml` is correct
4. Check Netlify build logs for errors

### AI Code Review Not Working

**Problem**: Claude/Copilot reviews don't appear
**Solution**:
1. Verify API key is set correctly
2. Check API quota/limits
3. Ensure you have credits/access to the API
4. Check workflow logs for detailed errors

### Security Scan Creating Too Many Issues

**Problem**: Getting overwhelmed with security issues
**Solution**:
1. Adjust severity threshold in `security-scan.yml`
2. Add specific ignores to Dependabot config
3. Create a security triage process
4. Use `continue-on-error: true` for non-blocking scans

### Dependabot PRs Not Merging

**Problem**: Dependabot PRs fail checks
**Solution**:
1. Review the PR and fix compatibility issues
2. Update peer dependencies if needed
3. Add exemptions to dependabot.yml if necessary
4. Run `npm audit fix` locally and commit

## 📚 Best Practices

### 1. Review Dependabot PRs Regularly

- Don't let them pile up
- Review and merge weekly
- Test thoroughly before merging to main

### 2. Monitor Security Alerts

- Check GitHub Security tab regularly
- Address critical/high severity issues immediately
- Create a security response plan

### 3. Keep Workflows Updated

- Update action versions quarterly
- Test workflow changes in a branch first
- Document any customizations

### 4. Use Environments

For production deployments, create a GitHub Environment:

1. Go to Settings → Environments → New environment
2. Name it "production"
3. Add protection rules:
   - Required reviewers
   - Wait timer (optional)
   - Deployment branches (main only)

### 5. Review AI Suggestions

- Don't blindly accept AI code review suggestions
- Use them as a learning tool
- Discuss with team before major refactors

## 🔄 Maintenance Schedule

### Daily
- ✅ Check failed workflow runs
- ✅ Review security alerts

### Weekly
- ✅ Review and merge Dependabot PRs
- ✅ Check deployment status
- ✅ Review AI code review suggestions

### Monthly
- ✅ Audit workflow performance
- ✅ Update dependencies manually if needed
- ✅ Review security scan trends

### Quarterly
- ✅ Update GitHub Actions versions
- ✅ Review and update branch protection rules
- ✅ Audit secret rotation needs
- ✅ Update this documentation

## 📞 Support

### Need Help?

1. Check workflow logs in Actions tab
2. Review GitHub Actions documentation
3. Check individual action README files
4. Create an issue in the repository

### Useful Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Netlify CI/CD](https://docs.netlify.com/configure-builds/continuous-deployment/)
- [Dependabot Docs](https://docs.github.com/en/code-security/dependabot)
- [Security Best Practices](https://docs.github.com/en/code-security)

---

**Last Updated**: November 2025
**Version**: 1.0
**Maintained By**: DobeuTech Solutions

