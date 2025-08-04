#!/usr/bin/env node

// Test script to verify API endpoints are working
const fetch = require('node-fetch');

async function testAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing API endpoints...\n');
  
  // Test 1: Test signup endpoint
  console.log('1. Testing signup endpoint...');
  try {
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Signup successful:', signupData.message);
    } else {
      const error = await signupResponse.json();
      console.log('❌ Signup failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Signup error:', error.message);
  }
  
  // Test 2: Test signin endpoint
  console.log('\n2. Testing signin endpoint...');
  try {
    const signinResponse = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    if (signinResponse.ok) {
      const signinData = await signinResponse.json();
      console.log('✅ Signin successful');
      console.log('   Token:', signinData.token);
      
      // Test 3: Test contacts endpoint with token
      console.log('\n3. Testing contacts endpoint...');
      try {
        const contactsResponse = await fetch(`${baseUrl}/api/contacts`, {
          headers: {
            'Authorization': `Bearer ${signinData.token}`,
          },
        });
        
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          console.log('✅ Contacts endpoint successful');
          console.log('   Contacts count:', contactsData.length);
        } else {
          console.log('❌ Contacts endpoint failed');
        }
      } catch (error) {
        console.log('❌ Contacts error:', error.message);
      }
      
      // Test 4: Test campaigns endpoint with token
      console.log('\n4. Testing campaigns endpoint...');
      try {
        const campaignsResponse = await fetch(`${baseUrl}/api/campaigns`, {
          headers: {
            'Authorization': `Bearer ${signinData.token}`,
          },
        });
        
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          console.log('✅ Campaigns endpoint successful');
          console.log('   Campaigns count:', campaignsData.length);
        } else {
          console.log('❌ Campaigns endpoint failed');
        }
      } catch (error) {
        console.log('❌ Campaigns error:', error.message);
      }
      
      // Test 5: Test sequences endpoint with token
      console.log('\n5. Testing sequences endpoint...');
      try {
        const sequencesResponse = await fetch(`${baseUrl}/api/sequences`, {
          headers: {
            'Authorization': `Bearer ${signinData.token}`,
          },
        });
        
        if (sequencesResponse.ok) {
          const sequencesData = await sequencesResponse.json();
          console.log('✅ Sequences endpoint successful');
          console.log('   Sequences count:', sequencesData.length);
        } else {
          console.log('❌ Sequences endpoint failed');
        }
      } catch (error) {
        console.log('❌ Sequences error:', error.message);
      }
      
    } else {
      const error = await signinResponse.json();
      console.log('❌ Signin failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Signin error:', error.message);
  }
  
  console.log('\nAPI testing complete!');
}

testAPI().catch(console.error);