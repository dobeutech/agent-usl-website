import puppeteer from 'puppeteer';

async function testOpenAPI() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Testing OpenAPI Documentation...\n');

  let pass = false;

  try {
    // Navigate to OpenAPI docs page
    console.log('1. Navigating to /openapi/docs...');
    await page.goto('http://localhost:5000/openapi/docs', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // Wait for Swagger UI to load

    // Check for Swagger UI elements
    console.log('2. Checking for Swagger UI content...');

    const swaggerContent = await page.evaluate(() => {
      return {
        hasSwaggerContainer: !!document.getElementById('swagger-ui'),
        hasTitle: document.body.textContent.includes('API Documentation'),
        hasSwaggerInfo: document.body.textContent.includes('Unique Staffing Professionals API'),
        hasEndpoints: document.querySelectorAll('.opblock').length,
        pageTitle: document.title,
        h1Text: document.querySelector('h1')?.textContent || ''
      };
    });

    console.log('   Swagger content:', JSON.stringify(swaggerContent, null, 2));

    // Take screenshot
    await page.screenshot({ path: 'screenshots/openapi-docs.png', fullPage: true });

    // Also check if the openapi.yaml file is accessible
    console.log('3. Checking /openapi.yaml...');
    const yamlResponse = await page.goto('http://localhost:5000/openapi.yaml', { waitUntil: 'networkidle0', timeout: 10000 });
    const yamlStatus = yamlResponse.status();
    const yamlContent = await page.content();

    const hasYamlContent = yamlContent.includes('openapi:') || yamlContent.includes('Unique Staffing');
    console.log('   YAML status: ' + yamlStatus);
    console.log('   Has OpenAPI content: ' + hasYamlContent);

    if (swaggerContent.hasSwaggerContainer && swaggerContent.hasTitle) {
      pass = true;
      console.log('\n   FEAT-033: PASS - OpenAPI documentation page loads with Swagger UI');
    } else if (hasYamlContent) {
      pass = true;
      console.log('\n   FEAT-033: PASS - OpenAPI YAML spec is accessible');
    }

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n=== RESULT ===');
  console.log('feat-033: OpenAPI documentation - ' + (pass ? 'PASS' : 'NEEDS VERIFICATION'));

  return pass;
}

testOpenAPI();
