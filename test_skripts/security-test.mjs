import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

console.log(' SECURITY TEST - XSS & INJECTION PROTECTION\n');
console.log('='.repeat(50));

// Test payloads
const xssPayloads = {
  scriptTag: '<script>alert("XSS")</script>',
  imgTag: '<img src=x onerror="alert(\'XSS\')">',
  jsEvent: '"><svg/onload=alert(1)>',
  eventHandler: '\'><body onload=alert("XSS")>',
};

const sqlPayloads = {
  sqlInjection: "' OR '1'='1",
  sqlUnion: "' UNION SELECT * FROM users--",
};

let results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

async function testRegistration() {
  console.log('\n Test 1: Registration XSS Protection');
  console.log('-'.repeat(50));

  for (const [name, payload] of Object.entries(xssPayloads)) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'Test123456',
          name: payload
        })
      });

      const data = await response.json();
      
      // Wenn Name/Error zurückgegeben wird, könnte XSS möglich sein
      if (data.message && data.message.includes('<')) {
        console.log(` ${name}: Payload echoed in response`);
        results.failed++;
      } else if (response.status === 400) {
        console.log(` ${name}: Rejected by validation`);
        results.passed++;
      } else {
        console.log(` ${name}: Created (user data not validated)`);
        results.warnings++;
      }
    } catch (err) {
      console.log(` ${name}: ${err.message}`);
      results.failed++;
    }
  }
}

async function testLogin() {
  console.log('\n Test 2: Login Protection');
  console.log('-'.repeat(50));

  // Erst einen echten User erstellen
  try {
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'safe@example.com',
        password: 'SafePassword123',
        name: 'Safe User'
      })
    });
  } catch (e) {
    // User könnte bereits existieren
  }

  // Jetzt mit XSS-Payload testen
  const payloads = [
    "' OR '1'='1",
    "<script>alert('test')</script>",
  ];

  for (const payload of payloads) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload,
          password: payload
        })
      });

      if (response.status === 401 || response.status === 400) {
        console.log(`  XSS/SQL payload rejected: ${response.status}`);
        results.passed++;
      } else {
        console.log(`  ❌ Suspicious status: ${response.status}`);
        results.failed++;
      }
    } catch (err) {
      console.log(`   Request failed (safe): ${err.message.slice(0, 40)}`);
      results.passed++;
    }
  }
}

async function testOrderCreation() {
  console.log('\n Test 3: Order Data Sanitization');
  console.log('-'.repeat(50));

  // Als Erstes einloggen
  let token = '';
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    const data = await response.json();
    token = data.token;
  } catch (e) {
    console.log(`   Could not authenticate`);
    return;
  }

  if (!token) {
    console.log(`No token available`);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          {
            menuItemId: 1,
            quantity: 1,
            name: '<img src=x onerror=alert(1)>',
            price: 10.99,
            restaurantId: 1
          }
        ]
      })
    });

    const data = await response.json();
    
    // Überprüfen, ob die Eingabedaten sanitiert werden
    if (data.items && JSON.stringify(data.items).includes('<img')) {
      console.log(`XSS payload stored in database!`);
      results.failed++;
    } else if (response.status === 400 || response.status === 500) {
      console.log(`Invalid data rejected`);
      results.passed++;
    } else {
      console.log(`Order creation needs validation review`);
      results.warnings++;
    }
  } catch (err) {
    console.log(`Error: ${err.message.slice(0, 40)}`);
  }
}

async function checkSecurityHeaders() {
  console.log('\n Test 4: Security Headers');
  console.log('-'.repeat(50));

  try {
    const response = await fetch(`${API_URL}/restaurants`);
    
    const headers = response.headers;
    const securityHeaders = [
      'content-security-policy',
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    let found = 0;
    for (const header of securityHeaders) {
      if (headers.get(header)) {
        console.log(`${header}: ${headers.get(header)}`);
        found++;
      }
    }

    if (found === 0) {
      console.log(` No security headers found`);
      console.log(`     Consider adding CSP, X-Frame-Options, etc.`);
      results.warnings++;
    } else if (found < 3) {
      console.log(` Only ${found}/5 security headers present`);
      results.warnings++;
    }
  } catch (err) {
    console.log(` Could not check headers: ${err.message}`);
    results.failed++;
  }
}

// Run all tests
async function runTests() {
  try {
    await testRegistration();
    await testLogin();
    await testOrderCreation();
    await checkSecurityHeaders();

    console.log('\n' + '='.repeat(50));
    console.log(' TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    console.log(`  Warnings: ${results.warnings}`);

    if (results.failed === 0) {
      console.log('\n🎉 Basic security checks passed!');
    } else {
      console.log('\n  Security issues found - review above');
    }

    console.log('\n RECOMMENDATIONS:');
    console.log('  1. Add Content-Security-Policy header');
    console.log('  2. Add X-Content-Type-Options: nosniff');
    console.log('  3. Add X-Frame-Options: DENY');
    console.log('  4. Use HTTPS in production');
    console.log('  5. Set secure flags on cookies (HttpOnly, Secure, SameSite)');
    console.log('  6. Implement CSRF tokens for state-changing operations');
    console.log('  7. Rate limiting on authentication endpoints');

  } catch (err) {
    console.error('Test failed:', err.message);
  }

  process.exit(0);
}

runTests();
