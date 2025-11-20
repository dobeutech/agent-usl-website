# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the Unique Staffing Professionals project.

## 📋 Workflows Overview

### 1. CI Pipeline (`ci.yml`)
**Triggers**: Pull requests, pushes to develop
- ✅ Code quality checks and linting
- ✅ TypeScript type checking
- ✅ Security audits
- ✅ Build verification
- ✅ Dependency checks

### 2. AI Code Review (`ai-code-review.yml`)
**Triggers**: Pull requests
- 🤖 Claude AI code review
- 🤖 GitHub Copilot review
- 🔍 CodeQL security analysis
- 📊 SonarCloud quality analysis

### 3. Deploy to Production (`deploy-production.yml`)
**Triggers**: Push to main, manual dispatch
- 🔒 Pre-deployment security checks
- 🏗️ Production build
- 🚀 Netlify deployment
- ✅ Post-deployment verification
- 🔍 Lighthouse performance audit

### 4. Dependency Updates (`dependency-update.yml`)
**Triggers**: Weekly schedule (Mondays), manual dispatch
- 📦 Check for outdated dependencies
- 🔄 Auto-update patch versions
- 🔒 Security vulnerability scanning
- 📝 Automated PR creation for updates

### 5. Security Scanning (`security-scan.yml`)
**Triggers**: Daily schedule, push to main/develop, pull requests
- 🔒 NPM audit
- 🔍 Trivy vulnerability scanning
- 🕵️ Secret scanning (GitLeaks, TruffleHog)
- 🛡️ OWASP dependency check
- 📜 License compliance check

### 6. Code Quality (`code-quality.yml`)
**Triggers**: Pull requests, pushes to develop
- 📏 Code formatting checks
- 📘 TypeScript strict mode validation
- 📦 Bundle size analysis
- ♿ Accessibility checks
- ⚡ Performance anti-pattern detection

## 🔧 Setup Requirements

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

#### Deployment
```
NETLIFY_AUTH_TOKEN    - Netlify authentication token
NETLIFY_SITE_ID       - Netlify site ID
```

#### AI Code Review (Optional but Recommended)
```
ANTHROPIC_API_KEY     - Claude AI API key (for AI code review)
SONAR_TOKEN          - SonarCloud token (for code quality analysis)
SNYK_TOKEN           - Snyk token (for security scanning)
```

#### Other (Optional)
```
GITLEAKS_LICENSE     - GitLeaks Pro license (if using Pro features)
```

### How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

## 🚀 Getting Started

### 1. Enable Workflows

Workflows are automatically enabled when you push this `.github` directory to your repository.

### 2. Configure Dependabot

Dependabot is configured in `.github/dependabot.yml` and will automatically:
- Create PRs for dependency updates
- Group related updates together
- Keep your dependencies secure and up-to-date

### 3. Set Up Branch Protection

Recommended branch protection rules for `main`:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
     - Select: `CI Pipeline Complete`
     - Select: `CodeQL Security Analysis`
     - Select: `Build Application`
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

### 4. Configure Netlify

1. Get your Netlify site ID:
   ```bash
   netlify sites:list
   ```

2. Get your Netlify auth token:
   - Go to Netlify Dashboard → User Settings → Applications
   - Create a new personal access token

3. Add both to GitHub secrets

## 📊 Workflow Results

### CI Pipeline
- All checks must pass before merging
- Build artifacts are saved for 7 days
- Failed checks block PR merging

### AI Code Review
- Provides automated code review comments
- Identifies security issues and best practices
- Does not block merging (informational)

### Security Scanning
- Creates issues for critical vulnerabilities
- Uploads results to GitHub Security tab
- Daily scans keep your app secure

### Deployment
- Only triggers on main branch
- Requires all CI checks to pass
- Performs post-deployment verification

## 🔐 Security Best Practices

This workflow setup implements:

1. **Automated Security Scanning**
   - Daily vulnerability scans
   - Secret detection
   - License compliance

2. **Dependency Management**
   - Weekly dependency updates
   - Automated security patches
   - Grouped updates for easier review

3. **Code Quality**
   - AI-powered code review
   - TypeScript strict mode
   - Bundle size monitoring

4. **Deployment Safety**
   - Pre-deployment checks
   - Automated testing
   - Post-deployment verification

## 🐛 Troubleshooting

### Workflow Fails on First Run

Some workflows might fail initially because they require secrets or setup. Check:

1. All required secrets are configured
2. Branch protection rules are set
3. Netlify is properly configured

### AI Code Review Not Working

If Claude or Copilot reviews aren't working:

1. Verify API keys are correct
2. Check API rate limits
3. Ensure the action versions are up to date

### Dependabot PRs Not Appearing

1. Check Dependabot is enabled in repository settings
2. Verify dependabot.yml is in `.github/` directory
3. Check Security → Dependabot alerts

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [Netlify CI/CD](https://docs.netlify.com/configure-builds/continuous-deployment/)
- [Claude API Documentation](https://docs.anthropic.com/)

## 🤝 Contributing

When contributing to this project:

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all CI checks pass
4. Wait for AI code review
5. Request human review
6. Merge to `develop`, then to `main` for production

## 📝 Maintenance

### Monthly Tasks
- Review and merge Dependabot PRs
- Check security scan results
- Review and close old issues

### Quarterly Tasks
- Audit workflow performance
- Update action versions
- Review branch protection rules
- Update documentation

---

**Last Updated**: November 2025
**Maintained By**: DobeuTech Solutions

