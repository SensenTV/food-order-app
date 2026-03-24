#!/usr/bin/env node
import http from 'http';

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: json, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║    FOOD ORDER APP - API TEST SUITE     ║');
  console.log('╚════════════════════════════════════════╝\n');

  let passCount = 0;
  let failCount = 0;

  // TEST 1: Login
  console.log('TEST 1: Authentication');
  console.log('─'.repeat(40));
  try {
    const res = await request('POST', '/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });
    
    if (res.status === 200 && res.data.token) {
      token = res.data.token;
      console.log('✓ LOGIN successful');
      console.log(`  User: ${res.data.user.email}`);
      console.log(`  Token: ${token.substring(0, 30)}...`);
      passCount++;
    } else {
      console.log(`✗ LOGIN failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ LOGIN error - ${e.message}`);
    failCount++;
  }

  // TEST 2: Get all restaurants
  console.log('\nTEST 2: Get Restaurants');
  console.log('─'.repeat(40));
  try {
    const res = await request('GET', '/restaurants');
    
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✓ GET /restaurants success`);
      console.log(`  Found ${res.data.length} restaurants:`);
      res.data.forEach(r => {
        console.log(`    - ${r.name} (ID: ${r.id})`);
      });
      passCount++;
    } else {
      console.log(`✗ GET /restaurants failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ GET /restaurants error - ${e.message}`);
    failCount++;
  }

  // TEST 3: Get restaurant by ID
  console.log('\nTEST 3: Get Restaurant by ID');
  console.log('─'.repeat(40));
  try {
    const res = await request('GET', '/restaurants/1');
    
    if (res.status === 200 && res.data.id) {
      console.log(`✓ GET /restaurants/1 success`);
      console.log(`  Name: ${res.data.name}`);
      console.log(`  Description: ${res.data.description}`);
      passCount++;
    } else if (res.status === 404) {
      console.log(`⚠ GET /restaurants/1 - NOT FOUND (404)`);
      console.log(`  Note: /:id route might not be working`);
      failCount++;
    } else {
      console.log(`✗ GET /restaurants/1 failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ GET /restaurants/1 error - ${e.message}`);
    failCount++;
  }

  // TEST 4: Get menu for restaurant
  console.log('\nTEST 4: Get Menu by Restaurant');
  console.log('─'.repeat(40));
  try {
    const res = await request('GET', '/restaurants/1/menu');
    
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✓ GET /restaurants/1/menu success`);
      console.log(`  Found ${res.data.length} items:`);
      res.data.forEach(item => {
        console.log(`    - ${item.name} ($${item.price})`);
      });
      passCount++;
    } else {
      console.log(`✗ GET /restaurants/1/menu failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ GET /restaurants/1/menu error - ${e.message}`);
    failCount++;
  }

  // TEST 5: Create restaurant
  console.log('\nTEST 5: Create Restaurant (Protected)');
  console.log('─'.repeat(40));
  try {
    const res = await request('POST', '/restaurants', {
      name: 'Test Restaurant',
      description: 'A test restaurant'
    }, {
      'Authorization': `Bearer ${token}`
    });
    
    if (res.status === 201 && res.data.restaurant) {
      console.log(`✓ POST /restaurants success`);
      console.log(`  Created ID: ${res.data.restaurant.id}`);
      console.log(`  Name: ${res.data.restaurant.name}`);
      passCount++;
    } else if (res.status === 404) {
      console.log(`⚠ POST /restaurants - NOT FOUND (404)`);
      console.log(`  Note: Routes might not be properly registered`);
      failCount++;
    } else if (res.status === 401 || res.status === 403) {
      console.log(`✗ POST /restaurants - Auth failed (${res.status})`);
      failCount++;
    } else {
      console.log(`✗ POST /restaurants failed - Status: ${res.status}`);
      console.log(`  Response: ${JSON.stringify(res.data)}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ POST /restaurants error - ${e.message}`);
    failCount++;
  }

  // TEST 6: Register new user
  console.log('\nTEST 6: Register User');
  console.log('─'.repeat(40));
  try {
    const res = await request('POST', '/auth/register', {
      email: `user${Date.now()}@test.com`,
      password: 'password123',
      name: 'Test User'
    });
    
    if (res.status === 201 && res.data.user) {
      console.log(`✓ POST /auth/register success`);
      console.log(`  User ID: ${res.data.user.id}`);
      console.log(`  Email: ${res.data.user.email}`);
      passCount++;
    } else {
      console.log(`✗ POST /auth/register failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ POST /auth/register error - ${e.message}`);
    failCount++;
  }

  // TEST 7: Get profile
  console.log('\nTEST 7: Get Profile (Protected)');
  console.log('─'.repeat(40));
  try {
    const res = await request('GET', '/auth/profile', null, {
      'Authorization': `Bearer ${token}`
    });
    
    if (res.status === 200 && res.data.user) {
      console.log(`✓ GET /auth/profile success`);
      console.log(`  Name: ${res.data.user.name}`);
      console.log(`  Email: ${res.data.user.email}`);
      passCount++;
    } else {
      console.log(`✗ GET /auth/profile failed - Status: ${res.status}`);
      failCount++;
    }
  } catch (e) {
    console.log(`✗ GET /auth/profile error - ${e.message}`);
    failCount++;
  }

  // Summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║           TEST SUMMARY                 ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`✓ Passed: ${passCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total:   ${passCount + failCount}\n`);

  if (failCount === 0) {
    console.log('🎉 All tests passed!\n');
  } else {
    console.log('⚠️ Some tests failed - check implementation\n');
  }

  process.exit(failCount === 0 ? 0 : 1);
}

test().catch(console.error);
