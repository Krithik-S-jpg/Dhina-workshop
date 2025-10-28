from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/")

        # Log in as admin
        page.get_by_role("button", name="Admin Login").click()

        # Wait for the login page to load
        page.wait_for_selector("h2:text('Admin Login')")
        page.wait_for_timeout(1000) # 1 second delay

        # Fill in the login form
        page.get_by_placeholder("Enter username").fill("admin")
        page.get_by_placeholder("Enter password").fill("admin123")
        page.get_by_role("button", name="Login").click()

        # Wait for the admin panel to load
        page.wait_for_selector("h1:text('Admin Panel - Management')")

        # Navigate to Service Management
        page.get_by_role("button", name="Service Management").click()

        # Take a screenshot of the service management page
        page.screenshot(path="jules-scratch/verification/service_management.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)