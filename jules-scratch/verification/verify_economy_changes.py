from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Navigate to the game.
        page.goto("http://localhost:8000")

        # 2. Increase player's level and money.
        page.evaluate("() => { import('./src/modules/state.js').then(state => { state.player.level = 10; state.player.money = 100000; }); }")
        page.wait_for_timeout(500)

        # 3. Open the "Upgrades" tab in the store.
        page.get_by_role("button", name="Store").click()
        page.wait_for_selector(".modal-content")

        page.click('button[data-tab="upgrades"]')
        page.wait_for_timeout(500)

        # 4. Take a screenshot of the upgrades.
        page.screenshot(path="jules-scratch/verification/upgrades.png")

        # 5. Open the "Production" tab.
        page.click('button[data-tab="production"]')
        page.wait_for_timeout(500)

        # 6. Scroll down and take a screenshot of the production buildings.
        page.evaluate("() => document.querySelector('#production-items > div:last-child').scrollIntoView()")
        page.screenshot(path="jules-scratch/verification/production.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
