// Simple test script to verify authentication endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Signup
    console.log('2. Testing signup endpoint...');
    const signupData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User'
    };

    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupData)
    });

    const signupResult = await signupResponse.json();
    console.log('✅ Signup result:', signupResult);
    
    if (signupResult.success && signupResult.data.token) {
      const token = signupResult.data.token;
      console.log('');

      // Test 3: Login
      console.log('3. Testing login endpoint...');
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const loginResult = await loginResponse.json();
      console.log('✅ Login result:', loginResult);
      console.log('');

      // Test 4: Get current user
      console.log('4. Testing /me endpoint...');
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const meResult = await meResponse.json();
      console.log('✅ Me result:', meResult);
      console.log('');

      // Test 5: Logout
      console.log('5. Testing logout endpoint...');
      const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const logoutResult = await logoutResponse.json();
      console.log('✅ Logout result:', logoutResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAuthEndpoints();
