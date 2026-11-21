"""End-to-end check with a fake camera fed by the demo return photos."""
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
CHROME = os.environ.get('CHROME_PATH')  # Optional; defaults to Playwright's Chromium
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173/'
SHOTS = ROOT / 'test' / 'shots'
SHOTS.mkdir(parents=True, exist_ok=True)


def run(sample: str, label: str, item: str, slots: int):
    frames = str(ROOT / 'test' / 'frames' / f'{sample}-return.y4m')
    with sync_playwright() as p:
        launch_options = {
            'headless': True,
            'args': [
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                f'--use-file-for-fake-video-capture={frames}',
                '--autoplay-policy=no-user-gesture-required',
            ],
        }
        if CHROME:
            launch_options['executable_path'] = CHROME
        browser = p.chromium.launch(**launch_options)
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=2,
            permissions=['clipboard-read', 'clipboard-write'],
        )
        page = context.new_page()
        problems = []
        page.on('pageerror', lambda error: problems.append(str(error)))
        page.on('console', lambda msg: problems.append(msg.text) if msg.type == 'error' else None)

        def wait_for_camera():
            expect(page.locator('video')).to_be_visible()
            page.wait_for_function("document.querySelector('video').readyState >= 2", timeout=20000)

        def scan(slots):
            page.get_by_role('button', name=f'Scan {slots} slots').click()
            expect(page.locator('.result')).to_have_count(slots, timeout=25000)

        page.goto(BASE, wait_until='load')
        expect(page).to_have_title('Ghost Check')
        page.get_by_role('button', name=label).click()

        # Seal: blank names, an advisory to write your own, numbered slots.
        expect(page.locator('.slot-row')).to_have_count(slots)
        expect(page.locator('.nudge')).to_contain_text('Write your item in each one')
        expect(page.locator('.pin')).to_have_count(slots)
        page.locator('.slot-row').first.click()
        field = page.get_by_label('What is in it?')
        expect(field).to_have_attribute('placeholder', 'Write your item')
        field.fill(item)
        page.get_by_role('button', name='Done').click()
        expect(page.locator('.pin-name').first).to_have_text(item)
        page.screenshot(path=str(SHOTS / f'{sample}-seal.png'), full_page=True)

        page.get_by_role('button', name='Seal it and scan').click()
        wait_for_camera()
        scan(slots)

        # Verify: exactly the one missing item is flagged.
        expect(page.locator('.result-missing')).to_have_count(1)
        expect(page.locator('.result-present')).to_have_count(slots - 1)
        expect(page.locator('.verdict-count')).to_have_text('1')
        expect(page.locator('.result-missing .result-name')).to_contain_text(item)
        page.screenshot(path=str(SHOTS / f'{sample}-verify.png'), full_page=True)

        # Hand corrections still work: flip it to "still there", file, see the clear state.
        page.locator('.result-missing').click()
        expect(page.locator('.result-missing')).to_have_count(0)
        expect(page.get_by_role('button', name='File the report')).to_be_enabled()
        page.get_by_role('button', name='File the report').click()
        expect(page.locator('.missing-list li')).to_have_count(0)
        expect(page.locator('.title-sm')).to_have_text('Nothing missing.')

        # Scan again, file the real gap, copy the list.
        page.get_by_role('button', name='Scan again').click()
        wait_for_camera()
        scan(slots)
        expect(page.locator('.result-missing')).to_have_count(1)
        page.get_by_role('button', name='File the report').click()
        expect(page.locator('.missing-list li')).to_have_count(1)
        expect(page.locator('.missing-list li')).to_contain_text(item)
        page.screenshot(path=str(SHOTS / f'{sample}-summary.png'), full_page=True)
        page.get_by_role('button', name='Copy the list').click()
        expect(page.get_by_role('button', name='Copied')).to_be_visible()
        clipboard = page.evaluate('navigator.clipboard.readText()')
        assert 'Missing from the' in clipboard, clipboard
        assert f'- {item}' in clipboard, clipboard

        page.set_viewport_size({'width': 360, 'height': 780})
        width = page.evaluate('document.documentElement.scrollWidth')
        assert width <= 360, f'horizontal overflow at 360px: {width}'
        assert not problems, problems

        browser.close()
    print(f'{sample}: naming, camera scan, flags, re-scan, report, clipboard, 360px — PASS')


run('kit', 'Camera bag', 'Battery', 6)
run('parcel', 'Delivery parcel', 'Power bank', 5)
print('ALL PASS')
