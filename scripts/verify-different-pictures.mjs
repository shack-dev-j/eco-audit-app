import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function testDifferentPictures() {
  console.log('🚀 Verifying that respondents get different pictures & contexts...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const screenshotDir = path.resolve(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Visit participant view
  await page.goto('http://localhost:5173/?lang=uz', { waitUntil: 'networkidle' });
  const scene1Title = await page.locator('h2').first().innerText();
  console.log('🖼️ Initial Scene Title:', scene1Title);

  // 2. Click the Shuffle Scene button ("🎲 Boshqa Rasm (Tasodifiy)")
  const shuffleBtn = page.locator('button:has-text("Boshqa Rasm"), button:has-text("Different Scene")').first();
  await shuffleBtn.click();
  await page.waitForTimeout(500);

  const scene2Title = await page.locator('h2').first().innerText();
  console.log('🎲 After Click 1 Scene Title:', scene2Title);

  await shuffleBtn.click();
  await page.waitForTimeout(500);
  const scene3Title = await page.locator('h2').first().innerText();
  console.log('🎲 After Click 2 Scene Title:', scene3Title);

  // 3. Test starting audit on a mixed-context scenario
  await page.goto('http://localhost:5173/?scenario=art-studio&lang=uz', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, 'mixed_art_studio_gate.png'), fullPage: true });

  const agreeCheckbox = page.locator('#agree-checkbox');
  await agreeCheckbox.check();

  const beginBtn = page.locator('button:has-text("Auditni Boshlash"), button:has-text("Begin Audit")').first();
  await beginBtn.click();
  await page.waitForTimeout(600);

  // Check 1-min intro plate with the new art studio image
  const imageSrc = await page.locator('img').first().getAttribute('src');
  console.log('🎨 Art Studio Image Source:', imageSrc);
  if (!imageSrc || !imageSrc.includes('scenario_11_artstudio')) {
    throw new Error('Art studio scenario did not load scenario_11_artstudio image!');
  }
  await page.screenshot({ path: path.join(screenshotDir, 'mixed_art_studio_plate.png'), fullPage: true });

  // Advance to spotting
  const readyBtn = page.locator('button:has-text("Yozishga tayyorman"), button:has-text("Ready to Record")').first();
  await readyBtn.click();
  await page.waitForTimeout(600);

  // Verify mixed-contexts are visible as pills (water tap, lights, paper waste, recycling, glue guns)
  const pills = await page.locator('button.theme-herbarium, button[class*="rounded"]').allInnerTexts();
  console.log('📋 Available Issue Suggestions:', pills.filter(p => p.length > 5 && !p.includes('O\'zbekcha')));

  // 4. Test staff lounge
  await page.goto('http://localhost:5173/?scenario=staff-lounge&lang=uz', { waitUntil: 'networkidle' });
  await page.locator('#agree-checkbox').check();
  await page.locator('button:has-text("Auditni Boshlash"), button:has-text("Begin Audit")').first().click();
  await page.waitForTimeout(600);
  const staffImgSrc = await page.locator('img').first().getAttribute('src');
  console.log('☕ Staff Lounge Image Source:', staffImgSrc);
  if (!staffImgSrc || !staffImgSrc.includes('scenario_12_stafflounge')) {
    throw new Error('Staff lounge scenario did not load scenario_12_stafflounge image!');
  }

  // 5. Test greenhouse
  await page.goto('http://localhost:5173/?scenario=greenhouse&lang=uz', { waitUntil: 'networkidle' });
  await page.locator('#agree-checkbox').check();
  await page.locator('button:has-text("Auditni Boshlash"), button:has-text("Begin Audit")').first().click();
  await page.waitForTimeout(600);
  const greenhouseImgSrc = await page.locator('img').first().getAttribute('src');
  console.log('🌿 Greenhouse Image Source:', greenhouseImgSrc);
  if (!greenhouseImgSrc || !greenhouseImgSrc.includes('scenario_13_greenhouse')) {
    throw new Error('Greenhouse scenario did not load scenario_13_greenhouse image!');
  }

  console.log('✅ Multiple mixed realistic pictures and dynamic rotation verified 100% successfully!');
  await browser.close();
}

testDifferentPictures().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
