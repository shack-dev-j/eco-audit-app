import { chromium } from 'playwright';

async function testClear() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Visit admin
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Set dialog handler to accept confirm
  page.on('dialog', async dialog => {
    console.log('Dialog prompt:', dialog.message());
    await dialog.accept();
  });

  // Find and click Clear button
  const clearBtn = await page.$('button:has-text("Clear")');
  if (clearBtn) {
    console.log('Clicking Clear button...');
    await clearBtn.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('No Clear button visible (already 0).');
  }

  // Check count on page
  const text = await page.innerText('body');
  const hasZero = text.includes('No submissions recorded yet');
  console.log('Has empty message after clear:', hasZero);

  // Wait 6 seconds to verify polling loop does NOT resurrect sample submissions
  console.log('Waiting 6s to test auto-polling loop...');
  await page.waitForTimeout(6000);

  const textAfter6s = await page.innerText('body');
  const stillZero = textAfter6s.includes('No submissions recorded yet');
  console.log('Still empty after 6 seconds of polling:', stillZero);

  await browser.close();
  if (!stillZero) {
    console.error('FAILED: Sample submissions reappeared!');
    process.exit(1);
  }
  console.log('SUCCESS: Submissions stay cleared! Zero sample resurrection!');
}

testClear().catch(err => {
  console.error(err);
  process.exit(1);
});
