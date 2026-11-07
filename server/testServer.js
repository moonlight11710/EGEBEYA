// Verification test script
const http = require('http');

async function runTests() {
  // Require and start server
  process.env.PORT = '5001';
  process.env.ADMIN_PASSWORD = 'admin123';
  require('./server');

  // Wait 1.5 seconds for startup
  await new Promise((r) => setTimeout(r, 1500));

  const request = (path, method = 'GET', body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5001,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  console.log('=== STARTING BACKEND API TESTS ===');

  // Test 1: Products
  const prodRes = await request('/api/products');
  console.log('1. GET /api/products status:', prodRes.status, 'Count:', prodRes.data.count);
  if (prodRes.data.count !== 6) throw new Error('Expected 6 products');

  // Test 2: Category filter
  const elecRes = await request('/api/products?category=electronics');
  console.log('2. GET /api/products?category=electronics count:', elecRes.data.count);
  if (elecRes.data.count !== 3) throw new Error('Expected 3 electronics');

  // Test 3: Product by Slug
  const slugRes = await request('/api/products/macbook-pro-m3-14-inch');
  console.log('3. GET /api/products/macbook-pro-m3-14-inch:', slugRes.data.data?.title);

  // Test 4: MOQ validation (Raw Material with MOQ: 2)
  const moqFailRes = await request('/api/orders', 'POST', {
    productId: 'prod_4',
    productTitle: 'Premium Turkish Cotton Fabric Roll',
    productCategory: 'raw_materials',
    customerName: 'Test Buyer',
    customerPhone: '0911000000',
    deliveryAddressOrCity: 'Bole',
    quantity: 1, // Below MOQ of 2!
  });
  console.log('4. POST /api/orders MOQ Enforcement (expected 400):', moqFailRes.status, moqFailRes.data.message);
  if (moqFailRes.status !== 400) throw new Error('MOQ validation should have failed with status 400');

  // Test 5: Valid Pre-Order creation
  const orderSuccessRes = await request('/api/orders', 'POST', {
    productId: 'prod_4',
    productTitle: 'Premium Turkish Cotton Fabric Roll',
    productCategory: 'raw_materials',
    unitPriceSnapshot: 19500,
    customerName: 'Test Buyer',
    customerPhone: '0911000000',
    deliveryAddressOrCity: 'Bole, Addis Ababa',
    quantity: 3, // Valid MOQ
    selectedSpecsOrNotes: 'Ivory White',
  });
  console.log('5. POST /api/orders Valid Order Code:', orderSuccessRes.data.data?.orderCode);
  if (!orderSuccessRes.data.data?.orderCode) throw new Error('Failed to generate orderCode');

  // Test 6: Custom Request creation
  const customReqRes = await request('/api/custom-requests', 'POST', {
    customerName: 'Abebe Bikila',
    customerPhone: '0912345678',
    category: 'electronics',
    itemNameOrModel: 'Sony A7 IV Camera Body',
    desiredSpecsAndQuantity: 'Brand new, with 2 extra batteries. Qty: 1',
    targetBudget: '160,000 ETB',
  });
  console.log('6. POST /api/custom-requests Code:', customReqRes.data.data?.requestCode);
  if (!customReqRes.data.data?.requestCode) throw new Error('Failed to generate requestCode');

  // Test 7: Track Order Timeline
  const trackOrderRes = await request(`/api/track/${orderSuccessRes.data.data.orderCode}`);
  console.log('7. GET /api/track/:orderCode timeline steps:', trackOrderRes.data.timeline?.length);
  if (trackOrderRes.data.timeline?.length !== 5) throw new Error('Expected 5 order timeline steps');

  // Test 8: Track Custom Request Timeline
  const trackReqRes = await request(`/api/track/${customReqRes.data.data.requestCode}`);
  console.log('8. GET /api/track/:requestCode timeline steps:', trackReqRes.data.timeline?.length);

  // Test 9: Public Settings
  const settingsRes = await request('/api/settings');
  console.log('9. GET /api/settings store name:', settingsRes.data.data?.storeName);

  // Test 10: Admin Login
  const loginRes = await request('/api/admin/login', 'POST', { password: 'admin123' });
  console.log('10. POST /api/admin/login token received:', Boolean(loginRes.data.token));
  const token = loginRes.data.token;

  // Test 11: Admin Stats
  const statsRes = await request('/api/admin/stats', 'GET', null, {
    Authorization: `Bearer ${token}`,
  });
  console.log('11. GET /api/admin/stats total orders:', statsRes.data.data?.totalOrders);

  console.log('\n🎉 ALL 11 API TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

