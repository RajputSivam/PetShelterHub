const { randomBytes } = require('crypto');
const pool = require('../db');

const apiBase = process.env.API_BASE_URL || 'http://localhost:3000/api';
const testEmail = `feature-test-${Date.now()}-${randomBytes(4).toString('hex')}@example.invalid`;
const testPassword = `Test-${randomBytes(16).toString('hex')}Aa1!`;
const testName = 'PetShelterHub Feature Test';
let loginCookie = null;
let petId = null;
let failures = 0;

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function expectStatus(result, expectedStatus) {
    const detail = result.body?.message ? `: ${result.body.message}` : '';
    assert(result.response.status === expectedStatus,
        `expected HTTP ${expectedStatus}, received ${result.response.status}${detail}`);
}

async function request(route, { method = 'GET', body, cookie } = {}) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (cookie) headers.Cookie = cookie;

    const response = await fetch(`${apiBase}${route}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : null;
    const setCookieHeaders = response.headers.getSetCookie?.() || [response.headers.get('set-cookie')].filter(Boolean);
    const sessionHeader = setCookieHeaders.find((value) => value.startsWith('PetShelterHub.sid='));

    return {
        response,
        body: payload,
        cookie: sessionHeader ? sessionHeader.split(';', 1)[0] : null,
        isJson: contentType.includes('application/json')
    };
}

async function runTest(name, check) {
    try {
        await check();
        console.log(`PASS ${name}`);
    } catch (error) {
        failures += 1;
        console.log(`FAIL ${name}: ${error.message}`);
    }
}

async function assertSaved(query, params, description) {
    const [rows] = await pool.execute(query, params);
    assert(rows.length > 0, `${description} was not found in MySQL`);
}

async function cleanup() {
    try {
        await pool.execute('DELETE FROM adoptions WHERE email = ?', [testEmail]);
        await pool.execute('DELETE FROM donations WHERE email = ?', [testEmail]);
        await pool.execute('DELETE FROM volunteers WHERE email = ?', [testEmail]);
        await pool.execute('DELETE FROM users WHERE email = ?', [testEmail]);
        console.log('PASS Cleanup of this run\'s test-email rows');
    } catch (error) {
        failures += 1;
        console.log(`FAIL Cleanup of this run's test-email rows: ${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
    } finally {
        await pool.end();
    }
}

async function main() {
    try {
        await runTest('Register a new user', async () => {
            const result = await request('/auth/register', {
                method: 'POST',
                body: { name: testName, email: testEmail, password: testPassword }
            });
            expectStatus(result, 201);
            assert(result.isJson && result.body?.user?.email === testEmail, 'expected a JSON user response');
        });

        await runTest('Reject duplicate registration clearly', async () => {
            const result = await request('/auth/register', {
                method: 'POST',
                body: { name: testName, email: testEmail, password: testPassword }
            });
            expectStatus(result, 409);
            assert(result.body?.message, 'expected a clear JSON error message');
        });

        await runTest('Reject registration with missing fields', async () => {
            const result = await request('/auth/register', { method: 'POST', body: { email: testEmail } });
            expectStatus(result, 400);
            assert(result.body?.message, 'expected a JSON validation message');
        });

        await runTest('Login with correct credentials', async () => {
            const result = await request('/auth/login', {
                method: 'POST',
                body: { email: testEmail, password: testPassword }
            });
            expectStatus(result, 200);
            assert(result.isJson && result.body?.user?.email === testEmail, 'expected the authenticated user in JSON');
            assert(result.cookie, 'login did not issue a session cookie');
            loginCookie = result.cookie;
        });

        await runTest('Reject login with a wrong password', async () => {
            const result = await request('/auth/login', {
                method: 'POST',
                body: { email: testEmail, password: `${testPassword}-wrong` }
            });
            expectStatus(result, 401);
            assert(result.body?.message, 'expected a JSON credential error');
        });

        await runTest('Logout invalidates the session', async () => {
            assert(loginCookie, 'cannot verify logout because login did not issue a session cookie');
            const logout = await request('/auth/logout', { method: 'POST', cookie: loginCookie });
            expectStatus(logout, 200);
            const current = await request('/auth/me', { cookie: loginCookie });
            expectStatus(current, 200);
            assert(current.body?.user === null, 'the session still identifies a user after logout');
        });

        await runTest('List pets as JSON', async () => {
            const result = await request('/pets');
            expectStatus(result, 200);
            assert(result.isJson && Array.isArray(result.body), 'expected a JSON array of pets');
            petId = result.body[0]?.id || null;
        });

        await runTest('Save adoption request in MySQL', async () => {
            assert(petId, 'no available pet was returned by GET /pets');
            const result = await request('/adoptions', {
                method: 'POST',
                body: { petId, name: testName, email: testEmail, phone: '555-0100', message: 'Automated feature test' }
            });
            expectStatus(result, 201);
            await assertSaved('SELECT id FROM adoptions WHERE email = ? AND applicant_name = ?', [testEmail, testName], 'adoption request');
        });

        await runTest('Save donation in MySQL', async () => {
            const result = await request('/donations', {
                method: 'POST',
                body: { name: testName, email: testEmail, amount: 1, message: 'Automated feature test' }
            });
            expectStatus(result, 201);
            await assertSaved('SELECT id FROM donations WHERE email = ? AND donor_name = ?', [testEmail, testName], 'donation');
        });

        await runTest('Save volunteer sign-up in MySQL', async () => {
            const result = await request('/volunteers', {
                method: 'POST',
                body: { name: testName, email: testEmail, phone: '555-0100', availability: 'Weekends', interests: 'Automated feature test' }
            });
            expectStatus(result, 201);
            await assertSaved('SELECT id FROM volunteers WHERE email = ? AND name = ?', [testEmail, testName], 'volunteer sign-up');
        });

        await runTest('Guest routes do not require login', async () => {
            for (const route of ['/adoptions', '/donations', '/volunteers']) {
                const result = await request(route, { method: 'POST', body: {} });
                expectStatus(result, 400);
                assert(result.body?.message, `${route} did not return a JSON validation message`);
            }
            const current = await request('/auth/me');
            expectStatus(current, 200);
            assert(current.body?.user === null, 'expected an anonymous session');
        });
    } catch (error) {
        failures += 1;
        console.error(`FAIL Feature test runner: ${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
    } finally {
        await cleanup();
    }

    process.exitCode = failures ? 1 : 0;
}

main();