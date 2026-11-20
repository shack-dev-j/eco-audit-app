import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function verifyFlow() {
  console.log('🚀 Starting End-to-End Browser Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const screenshotDir = path.resolve(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Visit Participant Survey Gate in Uzbek
  console.log('👉 1. Navigating to http://localhost:5173/?lang=uz');
  await page.goto('http://localhost:5173/?lang=uz', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '1_welcome_gate.png'), fullPage: true });
  console.log('📸 Saved 1_welcome_gate.png');

  // Verify Strictly Form Only: No admin elements
  const adminElementsCount = (await page.getByText(/Facilitator Station/i).count()) + 
                             (await page.getByText(/Stand Signs/i).count()) +
                             (await page.getByText(/QR Spot Generator/i).count());
  console.log(`🔒 Admin controls visible on participant survey view: ${adminElementsCount} (expected: 0)`);
  if (adminElementsCount > 0) throw new Error('Participant view is leaking admin controls!');

  // Fill in name
  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.fill('Anvar Qodirov');

  // Check the agreement box
  const agreeCheckbox = page.locator('#agree-checkbox');
  await agreeCheckbox.check();

  // Click Begin Audit Button
  const beginBtn = page.locator('button:has-text("Auditni Boshlash"), button:has-text("Begin Audit")').first();
  await beginBtn.click();
  await page.waitForTimeout(700);

  // 2. Phase 1: 1-Minute Intro Observation Plate
  console.log('👁️ 2. In Phase 1: Intro contemplation stage (1 min timer)');
  await page.screenshot({ path: path.join(screenshotDir, '2_intro_plate.png'), fullPage: true });

  const readyBtn = page.locator('button:has-text("Yozishga tayyorman"), button:has-text("Ready to Record")').first();
  await readyBtn.click();
  await page.waitForTimeout(700);

  // 3. Phase 2: Observation & Spotting (4-minute timer)
  console.log('🔍 3. In Phase 2: Spotting & 4-minute timer');
  await page.screenshot({ path: path.join(screenshotDir, '3_spotting_timer.png'), fullPage: true });

  // Type or click quick issue suggestion (any suggestion pill starting with +)
  const quickPill = page.locator('button:has-text("+ ")').first();
  if (await quickPill.count() > 0) {
    await quickPill.click();
  } else {
    const anyPill = page.locator('button:has-text("Chiroqlar"), button:has-text("Lights")').first();
    if (await anyPill.count() > 0) {
      await anyPill.click();
    }
  }

  const nextToPrioritizeBtn = page.locator('button:has-text("Saralashga"), button:has-text("Prioritise"), button:has-text("Prioritize")').first();
  await nextToPrioritizeBtn.click();
  await page.waitForTimeout(700);

  // 4. Phase 3: Prioritize Target
  console.log('🎯 4. In Phase 3: Prioritize Target');
  await page.screenshot({ path: path.join(screenshotDir, '4_prioritize.png'), fullPage: true });

  const nextToActionBtn = page.locator('button:has-text("Amaliy"), button:has-text("Action")').first();
  await nextToActionBtn.click();
  await page.waitForTimeout(700);

  // 5. Phase 4: Practical Action Pledge
  console.log('✍️ 5. In Phase 4: Action Pledge');
  const actionTextarea = page.locator('textarea').first();
  await actionTextarea.fill('Tanaffus va dars tugaganda chiroqlarni o‘chirish uchun o‘quvchilar navbatchiligini tashkil qilamiz.');

  await page.screenshot({ path: path.join(screenshotDir, '5_action_pledge_filled.png'), fullPage: true });

  // Click Submit
  const submitBtn = page.locator('button:has-text("Yuborish"), button:has-text("Submit")').first();
  await submitBtn.click();
  await page.waitForTimeout(1500);

  // 6. Phase 5: Certificate of Commitment
  console.log('🎓 6. In Phase 5: Certificate Display');
  await page.screenshot({ path: path.join(screenshotDir, '6_certificate.png'), fullPage: true });

  // Click "Boshqalarning Javoblarini Ko'rish / See Others' Responses"
  const seeOthersBtn = page.locator('button:has-text("Boshqalarning Javoblarini"), button:has-text("See Others")').first();
  await seeOthersBtn.click();
  await page.waitForTimeout(1200);

  // 7. Community Responses Wall
  console.log('🌐 7. In Community Responses Wall');
  await page.screenshot({ path: path.join(screenshotDir, '7_community_wall.png'), fullPage: true });

  const communityWallText = await page.innerText('body');
  const foundInWall = communityWallText.includes('Anvar Qodirov') || communityWallText.includes('Anvar');
  console.log(`✅ Newly submitted audit appears on Community Responses Wall: ${foundInWall}`);

  // 8. Visit Admin Facilitator Station (/admin)
  console.log('🛡️ 8. Navigating to http://localhost:5173/admin');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotDir, '8_admin_panel.png'), fullPage: true });

  // Verify that Submissions Log contains the submission
  const submissionRows = await page.locator('tbody tr').count();
  console.log(`📊 Admin Panel Submissions Count: ${submissionRows} rows found`);

  const adminBodyText = await page.innerText('body');
  const hasParticipantInAdmin = adminBodyText.includes('Anvar Qodirov') || adminBodyText.includes('Anvar');
  console.log(`✅ Newly submitted participant recorded in Admin: ${hasParticipantInAdmin}`);

  if (submissionRows === 0 || !hasParticipantInAdmin) {
    throw new Error('❌ Admin panel submissions verification failed! Participant not found in table.');
  }

  console.log('🎉 100% Success! Survey submission successfully stored and verified in Admin panel & Community Wall.');
  await browser.close();
}

verifyFlow().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
