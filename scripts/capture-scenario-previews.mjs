import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await context.newPage();

  const scenarios = ['restroom', 'garden', 'cafeteria', 'staff-lounge', 'computer-lab', 'library', 'grounds'];
  for (const s of scenarios) {
    await page.goto(`http://localhost:5173/?scenario=${s}&lang=uz`, { waitUntil: 'networkidle' });
    const agreementBtn = await page.$('button:has-text("Roziman va Boshlayman")');
    if (agreementBtn) {
      await agreementBtn.click();
      await page.waitForTimeout(600);
    }
    await page.screenshot({ path: `/home/cyber/.gemini/antigravity/brain/3565510d-3086-4d0b-8439-4af3eeb4ef29/preview_${s}_screen.png` });
    console.log(`Captured preview_${s}_screen.png`);
  }
  await browser.close();
  console.log('All captures done!');
}

main().catch(console.error);
