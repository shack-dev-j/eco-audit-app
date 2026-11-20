import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await context.newPage();

  // Test restroom modal
  await page.goto('http://localhost:5173/?scenario=restroom&lang=uz', { waitUntil: 'networkidle' });
  const agreementBtn = await page.$('button:has-text("Roziman va Boshlayman")');
  if (agreementBtn) await agreementBtn.click();
  await page.waitForTimeout(600);

  // During phase 1 (Intro plate), the photo is already on screen. Click "Joy rasmini ko'rish" in Phase 2:
  const startAuditBtn = await page.$('button:has-text("Auditni Boshlash")');
  if (startAuditBtn) {
    await startAuditBtn.click();
    await page.waitForTimeout(600);
  }

  const viewPhotoBtn = await page.$('button:has-text("Joy rasmini ko\'rish")');
  if (viewPhotoBtn) {
    await viewPhotoBtn.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: '/home/cyber/.gemini/antigravity/brain/3565510d-3086-4d0b-8439-4af3eeb4ef29/modal_restroom_view.png' });
  console.log('Saved modal_restroom_view.png');

  // Test garden modal
  await page.goto('http://localhost:5173/?scenario=garden&lang=uz', { waitUntil: 'networkidle' });
  const agreeBtn2 = await page.$('button:has-text("Roziman va Boshlayman")');
  if (agreeBtn2) await agreeBtn2.click();
  await page.waitForTimeout(600);

  const startAuditBtn2 = await page.$('button:has-text("Auditni Boshlash")');
  if (startAuditBtn2) {
    await startAuditBtn2.click();
    await page.waitForTimeout(600);
  }

  const viewPhotoBtn2 = await page.$('button:has-text("Joy rasmini ko\'rish")');
  if (viewPhotoBtn2) {
    await viewPhotoBtn2.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: '/home/cyber/.gemini/antigravity/brain/3565510d-3086-4d0b-8439-4af3eeb4ef29/modal_garden_view.png' });
  console.log('Saved modal_garden_view.png');

  await browser.close();
  console.log('Finished capturing modal views!');
}

main().catch(console.error);
