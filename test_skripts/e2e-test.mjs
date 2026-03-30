#!/usr/bin/env node

const API_BASE_URL = 'http://localhost:5000/api';

async function test(label, fn) {
  try {
    await fn();
    console.log(` ${label}`);
    return true;
  } catch (error) {
    console.error(` ${label}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n Starting E2E Tests for Food Order App\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test data
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testPassword123',
    name: 'Test User'
  };
  
  let token = '';
  let restaurantId = '';
  let menuItemId = '';
  let orderId = '';

  // 1. Test Registration
  if (await test('1. User Registration', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name
      })
    });
    
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.token) throw new Error('No token received');
    token = data.token;
  })) passed++; else failed++;

  // 2. Test Login
  if (await test('2. User Login', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.token) throw new Error('No token in login response');
  })) passed++; else failed++;

  // 3. Test Get Profile
  if (await test('3. Get User Profile (Protected Route)', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.user) throw new Error('No user data');
  })) passed++; else failed++;

  // 4. Test Get Restaurants
  if (await test('4. Get Restaurants List', async () => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'GET'
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
    if (data.length === 0) throw new Error('No restaurants found');
    restaurantId = data[0].id;
  })) passed++; else failed++;

  // 5. Test Get Restaurant by ID
  if (await test('5. Get Restaurant by ID', async () => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      method: 'GET'
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.id) throw new Error('No restaurant data');
  })) passed++; else failed++;

  // 6. Test Get Menu by Restaurant
  if (await test('6. Get Menu Items for Restaurant', async () => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, {
      method: 'GET'
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
    if (data.length === 0) throw new Error('No menu items found');
    menuItemId = data[0].id;
  })) passed++; else failed++;

  // 7. Test Get Menu Item by ID
  if (await test('7. Get Menu Item Details', async () => {
    const response = await fetch(`${API_BASE_URL}/menu/${menuItemId}`, {
      method: 'GET'
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.id) throw new Error('No menu item data');
  })) passed++; else failed++;

  // 8. Test Create Order
  if (await test('8. Create Order (Add Items to Cart & Order)', async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurantId: restaurantId,
        items: [
          { menuItemId: menuItemId, quantity: 2 }
        ]
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status ${response.status}: ${error.message}`);
    }
    const data = await response.json();
    if (!data.order || !data.order.id) throw new Error('No order created');
    orderId = data.order.id;
  })) passed++; else failed++;

  // 9. Test Get User Orders
  if (await test('9. Get User Orders History', async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
  })) passed++; else failed++;

  // 10. Test Get Order Details
  if (await test('10. Get Order Details', async () => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.id) throw new Error('No order data');
  })) passed++; else failed++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(` Passed: ${passed}`);
  console.log(` Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  console.log('='.repeat(50) + '\n');

  if (failed === 0) {
    console.log(' All tests passed! E2E flow is working correctly.\n');
    process.exit(0);
  } else {
    console.log('  Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
