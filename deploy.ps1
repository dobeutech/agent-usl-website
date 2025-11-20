# Deploy to Netlify using CLI
$env:NETLIFY_AUTH_TOKEN = "nfp_L3GkfX5enG8XiWGyELjcR6wve1BP6hgX9e6d"
$env:NETLIFY_SITE_ID = "e8cf44e2-089c-4f4c-8b10-1998df378cf7"

Write-Host "Deploying to Netlify..."
npx netlify deploy --prod --dir=dist --message "Theme toggle fix deployment"

Write-Host ""
Write-Host "Deployment complete!"
Write-Host "Site URL: https://unique-staffing-professionals.netlify.app"
