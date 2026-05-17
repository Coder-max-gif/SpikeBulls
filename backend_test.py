#!/usr/bin/env python3
"""
SpikeBulls Backend API End-to-End Test Suite
Tests all backend endpoints with real data and proper authentication flow.
"""
import os
import sys
import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "https://elite-trading-fx.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "admin@spikebulls.com"
ADMIN_PASSWORD = "XX2glTGwSfA0oVMI"

# Test state
test_state = {
    "admin_token": None,
    "user1_token": None,
    "user1_email": None,
    "user1_id": None,
    "user2_token": None,
    "user2_email": None,
    "product_id": None,
    "order_id": None,
    "license_id": None,
    "contact_id": None,
    "created_product_id": None,
    "testimonial_id": None,
}

# Test results
results = {
    "passed": [],
    "failed": [],
    "total": 0,
}


def log(msg: str, level: str = "INFO"):
    """Log test messages"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] [{level}] {msg}")


def test(name: str):
    """Decorator for test functions"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            results["total"] += 1
            log(f"Testing: {name}", "TEST")
            try:
                func(*args, **kwargs)
                results["passed"].append(name)
                log(f"✅ PASSED: {name}", "PASS")
            except AssertionError as e:
                results["failed"].append({"test": name, "error": str(e)})
                log(f"❌ FAILED: {name} - {e}", "FAIL")
            except Exception as e:
                results["failed"].append({"test": name, "error": f"Exception: {str(e)}"})
                log(f"❌ ERROR: {name} - {e}", "ERROR")
        return wrapper
    return decorator


def assert_status(response: requests.Response, expected: int, msg: str = ""):
    """Assert HTTP status code"""
    if response.status_code != expected:
        error_detail = ""
        try:
            error_detail = f" | Response: {response.json()}"
        except:
            error_detail = f" | Response: {response.text[:200]}"
        raise AssertionError(
            f"Expected status {expected}, got {response.status_code}{msg}{error_detail}"
        )


def assert_field(data: Dict, field: str, msg: str = ""):
    """Assert field exists in response"""
    if field not in data:
        raise AssertionError(f"Missing field '{field}' in response{msg}. Got: {list(data.keys())}")


def assert_value(actual: Any, expected: Any, msg: str = ""):
    """Assert value equals expected"""
    if actual != expected:
        raise AssertionError(f"Expected {expected}, got {actual}{msg}")


# ============================================================================
# 1. PUBLIC HEALTH & CATALOG TESTS
# ============================================================================

@test("GET /api/ - Health check")
def test_health():
    resp = requests.get(f"{BASE_URL}/")
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "app")
    assert_field(data, "status")
    assert_field(data, "stripe_enabled")
    assert_field(data, "email_provider")
    assert_value(data["status"], "ok")


@test("GET /api/products - List all products")
def test_list_products():
    resp = requests.get(f"{BASE_URL}/products")
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of products"
    assert len(data) >= 6, f"Expected at least 6 seeded products, got {len(data)}"
    # Store first product ID for later tests
    if data:
        test_state["product_id"] = data[0]["id"]
        log(f"Stored product_id: {test_state['product_id']}")


@test("GET /api/products?category=signals - Filter by category")
def test_filter_products_by_category():
    resp = requests.get(f"{BASE_URL}/products?category=signals")
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of products"
    # Verify all returned products have category=signals
    for prod in data:
        assert_value(prod.get("category"), "signals", f" for product {prod.get('slug')}")


@test("GET /api/products/forex-signals-pro - Get single product")
def test_get_product_by_slug():
    resp = requests.get(f"{BASE_URL}/products/forex-signals-pro")
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "id")
    assert_field(data, "name")
    assert_field(data, "slug")
    assert_value(data["slug"], "forex-signals-pro")


@test("GET /api/products/does-not-exist - 404 for invalid product")
def test_get_invalid_product():
    resp = requests.get(f"{BASE_URL}/products/does-not-exist")
    assert_status(resp, 404)


@test("GET /api/testimonials - List testimonials")
def test_list_testimonials():
    resp = requests.get(f"{BASE_URL}/testimonials")
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of testimonials"
    assert len(data) >= 4, f"Expected at least 4 seeded testimonials, got {len(data)}"


# ============================================================================
# 2. AUTH LIFECYCLE (NEW USER)
# ============================================================================

@test("POST /api/auth/register - Register new user")
def test_register_user():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    email = f"testuser{timestamp}@example.com"
    payload = {
        "name": "Test User",
        "email": email,
        "password": "SecurePass123!"
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "access_token")
    assert_field(data, "refresh_token")
    assert_field(data, "user")
    assert_value(data["user"]["role"], "user")
    # Store tokens and email
    test_state["user1_token"] = data["access_token"]
    test_state["user1_email"] = email
    test_state["user1_id"] = data["user"]["id"]
    log(f"Registered user: {email}")


@test("POST /api/auth/login - Login with registered user")
def test_login_user():
    payload = {
        "email": test_state["user1_email"],
        "password": "SecurePass123!"
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=payload)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "access_token")
    assert_field(data, "refresh_token")
    # Update token
    test_state["user1_token"] = data["access_token"]


@test("POST /api/auth/refresh - Refresh token")
def test_refresh_token():
    # First login to get refresh token
    payload = {
        "email": test_state["user1_email"],
        "password": "SecurePass123!"
    }
    login_resp = requests.post(f"{BASE_URL}/auth/login", json=payload)
    refresh_token = login_resp.json()["refresh_token"]
    
    # Now refresh
    resp = requests.post(f"{BASE_URL}/auth/refresh", json={"refresh_token": refresh_token})
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "access_token")
    assert_field(data, "refresh_token")


@test("GET /api/auth/me - Get current user profile")
def test_get_me():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "id")
    assert_field(data, "email")
    assert_field(data, "name")
    assert_value(data["email"], test_state["user1_email"])


@test("PATCH /api/auth/me - Update profile")
def test_update_profile():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    payload = {"name": "Updated Test User"}
    resp = requests.patch(f"{BASE_URL}/auth/me", json=payload, headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_value(data["name"], "Updated Test User")


@test("POST /api/auth/forgot-password - Forgot password")
def test_forgot_password():
    payload = {"email": test_state["user1_email"]}
    resp = requests.post(f"{BASE_URL}/auth/forgot-password", json=payload)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("POST /api/auth/register - Duplicate email returns 400")
def test_register_duplicate_email():
    payload = {
        "name": "Duplicate User",
        "email": test_state["user1_email"],
        "password": "AnotherPass123!"
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert_status(resp, 400)


# ============================================================================
# 3. CONTACT FORM
# ============================================================================

@test("POST /api/contact - Submit contact form")
def test_contact_form():
    payload = {
        "name": "John Trader",
        "email": "john.trader@example.com",
        "topic": "general",
        "message": "I'm interested in your forex signals service. Can you provide more details?"
    }
    resp = requests.post(f"{BASE_URL}/contact", json=payload)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")
    assert_field(data, "id")
    test_state["contact_id"] = data["id"]


# ============================================================================
# 4. CHECKOUT (SIMULATED MODE)
# ============================================================================

@test("POST /api/checkout - Create simulated checkout")
def test_create_checkout():
    if not test_state["product_id"]:
        raise AssertionError("No product_id available for checkout test")
    
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    payload = {"product_ids": [test_state["product_id"]]}
    resp = requests.post(f"{BASE_URL}/checkout", json=payload, headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "mode")
    assert_field(data, "order_id")
    assert_field(data, "checkout_url")
    assert_value(data["mode"], "simulated")
    test_state["order_id"] = data["order_id"]
    log(f"Created order: {test_state['order_id']}")


@test("GET /api/checkout/orders/{order_id} - Get order as owner")
def test_get_order_as_owner():
    if not test_state["order_id"]:
        raise AssertionError("No order_id available")
    
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/checkout/orders/{test_state['order_id']}", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "order")
    assert_field(data, "licenses")
    assert_value(data["order"]["status"], "paid")
    assert len(data["licenses"]) >= 1, "Expected at least 1 license"
    # Store license ID
    if data["licenses"]:
        test_state["license_id"] = data["licenses"][0]["id"]
        license_key = data["licenses"][0]["key"]
        assert license_key.startswith("SPB-"), f"License key should start with 'SPB-', got {license_key}"


@test("GET /api/checkout/orders/{order_id} - 403 for different user")
def test_get_order_as_different_user():
    if not test_state["order_id"]:
        raise AssertionError("No order_id available")
    
    # Register a second user
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    email = f"testuser2_{timestamp}@example.com"
    payload = {
        "name": "Test User 2",
        "email": email,
        "password": "SecurePass456!"
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert_status(resp, 200)
    user2_token = resp.json()["access_token"]
    test_state["user2_token"] = user2_token
    test_state["user2_email"] = email
    
    # Try to access user1's order
    headers = {"Authorization": f"Bearer {user2_token}"}
    resp = requests.get(f"{BASE_URL}/checkout/orders/{test_state['order_id']}", headers=headers)
    assert_status(resp, 403)


# ============================================================================
# 5. USER DASHBOARD
# ============================================================================

@test("GET /api/me/orders - Get user orders")
def test_get_user_orders():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/me/orders", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of orders"
    assert len(data) >= 1, "Expected at least 1 order"


@test("GET /api/me/licenses - Get user licenses")
def test_get_user_licenses():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/me/licenses", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of licenses"
    assert len(data) >= 1, "Expected at least 1 license"
    # Verify license key format
    if data:
        assert data[0]["key"].startswith("SPB-"), f"License key should start with 'SPB-'"


@test("GET /api/me/summary - Get user summary")
def test_get_user_summary():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/me/summary", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "orders")
    assert_field(data, "active_licenses")
    assert data["orders"] >= 1, "Expected at least 1 order"
    assert data["active_licenses"] >= 1, "Expected at least 1 active license"


# ============================================================================
# 6. ADMIN ENDPOINTS
# ============================================================================

@test("POST /api/auth/login - Login as admin")
def test_login_admin():
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=payload)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "access_token")
    assert_value(data["user"]["role"], "admin")
    test_state["admin_token"] = data["access_token"]
    log("Admin login successful")


@test("GET /api/admin/summary - Admin dashboard summary")
def test_admin_summary():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/summary", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "users")
    assert_field(data, "products")
    assert_field(data, "paid_orders")
    assert_field(data, "revenue")
    assert_field(data, "leads")
    assert_field(data, "active_licenses")


@test("GET /api/admin/products - List all products (admin)")
def test_admin_list_products():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/products", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of products"
    assert len(data) >= 6, f"Expected at least 6 products"


@test("POST /api/admin/products - Create new product")
def test_admin_create_product():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    payload = {
        "name": f"Test Product {timestamp}",
        "slug": f"test-product-{timestamp}",
        "category": "signals",
        "price": 99.99,
        "short_description": "A short test description",
        "description": "A test product created during API testing",
        "features": ["Feature 1", "Feature 2"],
        "status": "active"
    }
    resp = requests.post(f"{BASE_URL}/admin/products", json=payload, headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "id")
    assert_value(data["slug"], payload["slug"])
    test_state["created_product_id"] = data["id"]
    log(f"Created product: {data['id']}")


@test("PATCH /api/admin/products/{id} - Update product")
def test_admin_update_product():
    if not test_state["created_product_id"]:
        raise AssertionError("No created_product_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    payload = {"price": 123.45}
    resp = requests.patch(
        f"{BASE_URL}/admin/products/{test_state['created_product_id']}",
        json=payload,
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_value(data["price"], 123.45)


@test("DELETE /api/admin/products/{id} - Delete product")
def test_admin_delete_product():
    if not test_state["created_product_id"]:
        raise AssertionError("No created_product_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.delete(
        f"{BASE_URL}/admin/products/{test_state['created_product_id']}",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("GET /api/admin/orders - List all orders")
def test_admin_list_orders():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of orders"
    # Should contain the simulated order we created
    order_ids = [o["id"] for o in data]
    assert test_state["order_id"] in order_ids, "Simulated order not found in admin orders list"


@test("GET /api/admin/users - List all users")
def test_admin_list_users():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/users", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of users"
    # Should contain admin and test users
    emails = [u["email"] for u in data]
    assert ADMIN_EMAIL in emails, "Admin user not found"
    assert test_state["user1_email"] in emails, "Test user 1 not found"


@test("PATCH /api/admin/users/{id}/role - Change user role to admin")
def test_admin_change_user_role_to_admin():
    if not test_state["user1_id"]:
        raise AssertionError("No user1_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.patch(
        f"{BASE_URL}/admin/users/{test_state['user1_id']}/role?role=admin",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("PATCH /api/admin/users/{id}/role - Revert user role to user")
def test_admin_change_user_role_to_user():
    if not test_state["user1_id"]:
        raise AssertionError("No user1_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.patch(
        f"{BASE_URL}/admin/users/{test_state['user1_id']}/role?role=user",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("GET /api/admin/leads - List contact submissions")
def test_admin_list_leads():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/leads", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of leads"
    # Should contain our contact submission
    if test_state["contact_id"]:
        lead_ids = [l["id"] for l in data]
        assert test_state["contact_id"] in lead_ids, "Contact submission not found in leads"


@test("PATCH /api/admin/leads/{id} - Update lead status")
def test_admin_update_lead_status():
    if not test_state["contact_id"]:
        raise AssertionError("No contact_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.patch(
        f"{BASE_URL}/admin/leads/{test_state['contact_id']}?status=in_progress",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("GET /api/admin/licenses - List all licenses")
def test_admin_list_licenses():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/licenses", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of licenses"
    # Should contain our issued license
    if test_state["license_id"]:
        license_ids = [l["id"] for l in data]
        assert test_state["license_id"] in license_ids, "Issued license not found"


@test("POST /api/admin/licenses/{id}/regenerate - Regenerate license key")
def test_admin_regenerate_license():
    if not test_state["license_id"]:
        raise AssertionError("No license_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.post(
        f"{BASE_URL}/admin/licenses/{test_state['license_id']}/regenerate",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")
    assert_field(data, "key")
    assert data["key"].startswith("SPB-"), f"Regenerated key should start with 'SPB-'"


@test("POST /api/admin/licenses/{id}/revoke - Revoke license")
def test_admin_revoke_license():
    if not test_state["license_id"]:
        raise AssertionError("No license_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.post(
        f"{BASE_URL}/admin/licenses/{test_state['license_id']}/revoke",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


@test("POST /api/admin/testimonials - Create testimonial")
def test_admin_create_testimonial():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    payload = {
        "name": "Sarah Johnson",
        "role": "Professional Trader",
        "quote": "SpikeBulls signals have transformed my trading strategy. Highly recommended!",
        "rating": 5
    }
    resp = requests.post(f"{BASE_URL}/admin/testimonials", json=payload, headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "id")
    test_state["testimonial_id"] = data["id"]


@test("GET /api/admin/testimonials - List all testimonials (admin)")
def test_admin_list_testimonials():
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/testimonials", headers=headers)
    assert_status(resp, 200)
    data = resp.json()
    assert isinstance(data, list), "Expected list of testimonials"
    # Should contain our created testimonial
    if test_state["testimonial_id"]:
        testimonial_ids = [t["id"] for t in data]
        assert test_state["testimonial_id"] in testimonial_ids, "Created testimonial not found"


@test("DELETE /api/admin/testimonials/{id} - Delete testimonial")
def test_admin_delete_testimonial():
    if not test_state["testimonial_id"]:
        raise AssertionError("No testimonial_id available")
    
    headers = {"Authorization": f"Bearer {test_state['admin_token']}"}
    resp = requests.delete(
        f"{BASE_URL}/admin/testimonials/{test_state['testimonial_id']}",
        headers=headers
    )
    assert_status(resp, 200)
    data = resp.json()
    assert_field(data, "ok")


# ============================================================================
# 7. ROLE ENFORCEMENT
# ============================================================================

@test("GET /api/admin/summary - 403 for regular user")
def test_admin_endpoint_forbidden_for_user():
    headers = {"Authorization": f"Bearer {test_state['user1_token']}"}
    resp = requests.get(f"{BASE_URL}/admin/summary", headers=headers)
    assert_status(resp, 403)


@test("GET /api/me/orders - 401 without token")
def test_user_endpoint_unauthorized_without_token():
    resp = requests.get(f"{BASE_URL}/me/orders")
    assert_status(resp, 401)


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    log("=" * 80)
    log("SpikeBulls Backend API Test Suite")
    log(f"Base URL: {BASE_URL}")
    log("=" * 80)
    
    # Run all tests in order
    log("\n1. PUBLIC HEALTH & CATALOG TESTS", "SECTION")
    test_health()
    test_list_products()
    test_filter_products_by_category()
    test_get_product_by_slug()
    test_get_invalid_product()
    test_list_testimonials()
    
    log("\n2. AUTH LIFECYCLE TESTS", "SECTION")
    test_register_user()
    test_login_user()
    test_refresh_token()
    test_get_me()
    test_update_profile()
    test_forgot_password()
    test_register_duplicate_email()
    
    log("\n3. CONTACT FORM TESTS", "SECTION")
    test_contact_form()
    
    log("\n4. CHECKOUT (SIMULATED) TESTS", "SECTION")
    test_create_checkout()
    test_get_order_as_owner()
    test_get_order_as_different_user()
    
    log("\n5. USER DASHBOARD TESTS", "SECTION")
    test_get_user_orders()
    test_get_user_licenses()
    test_get_user_summary()
    
    log("\n6. ADMIN ENDPOINTS TESTS", "SECTION")
    test_login_admin()
    test_admin_summary()
    test_admin_list_products()
    test_admin_create_product()
    test_admin_update_product()
    test_admin_delete_product()
    test_admin_list_orders()
    test_admin_list_users()
    test_admin_change_user_role_to_admin()
    test_admin_change_user_role_to_user()
    test_admin_list_leads()
    test_admin_update_lead_status()
    test_admin_list_licenses()
    test_admin_regenerate_license()
    test_admin_revoke_license()
    test_admin_create_testimonial()
    test_admin_list_testimonials()
    test_admin_delete_testimonial()
    
    log("\n7. ROLE ENFORCEMENT TESTS", "SECTION")
    test_admin_endpoint_forbidden_for_user()
    test_user_endpoint_unauthorized_without_token()
    
    # Print summary
    log("\n" + "=" * 80)
    log("TEST SUMMARY")
    log("=" * 80)
    log(f"Total tests: {results['total']}")
    log(f"Passed: {len(results['passed'])}")
    log(f"Failed: {len(results['failed'])}")
    
    if results["failed"]:
        log("\nFAILED TESTS:", "ERROR")
        for failure in results["failed"]:
            log(f"  ❌ {failure['test']}", "ERROR")
            log(f"     {failure['error']}", "ERROR")
    
    log("=" * 80)
    
    # Exit with appropriate code
    sys.exit(0 if len(results["failed"]) == 0 else 1)


if __name__ == "__main__":
    main()
