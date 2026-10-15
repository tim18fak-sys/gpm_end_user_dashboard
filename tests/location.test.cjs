const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Test the real TypeScript boundary code without adding a test dependency.
function load(path, modules = {}, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const context = {
    module, exports: module.exports, Date, Number, Error, Promise, AbortController,
    require(name) {
      if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
      return modules[name];
    },
    ...globals,
  };
  vm.runInNewContext(code, context, { filename: path });
  return module.exports;
}

const types = load('src/types/location.types.ts');
const raw = { latitude: 6.6143785, longitude: 3.35776, accuracy_m: 0, captured_at: '2026-10-02T19:00:00.000Z' };
const point = { address: 'Ikeja City Mall, Lagos, Nigeria', latitude: raw.latitude, longitude: raw.longitude };

function service(handler) {
  return load('src/services/location.api.ts', {
    axios: { isAxiosError: (e) => e.isAxiosError, isCancel: (e) => e.code === 'ERR_CANCELED' },
    './api': { api: { request: handler } },
    '@/types/location.types': types,
  });
}

test('coordinates accept zero and reject strings, infinity and out-of-range values', () => {
  assert.equal(types.hasValidCoordinates({ latitude: 0, longitude: 0 }), true);
  for (const invalid of [
    { latitude: '0', longitude: 0 }, { latitude: NaN, longitude: 0 },
    { latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 },
    { latitude: 0, longitude: Infinity }, null,
  ]) assert.equal(types.hasValidCoordinates(invalid), false);
});

test('confirmation requires address, coordinates and an explicit source', () => {
  assert.equal(types.isCompleteLocation({ ...point, source: 'manual_geocode' }), true);
  assert.equal(types.isCompleteLocation({ ...point, address: '', source: 'manual_geocode' }), false);
  assert.equal(types.isCompleteLocation(point), false);
});

test('onboarding maps address, longitude and latitude from the same confirmed location', () => {
  const source = ts.createSourceFile(
    'OnboardingPage.tsx', fs.readFileSync('src/pages/OnboardingPage.tsx', 'utf8'),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX,
  );
  const calls = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'onboard') calls.push(node);
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.equal(calls.length, 1);
  const payload = calls[0].arguments[0];
  assert.ok(ts.isObjectLiteralExpression(payload));
  for (const field of ['address', 'longitude', 'latitude']) {
    const property = payload.properties.find((node) =>
      ts.isPropertyAssignment(node) && node.name.getText(source) === field);
    assert.ok(property, `Onboarding must send ${field}`);
    assert.equal(property.initializer.getText(source), `values.home_location.${field}`);
  }
});

test('onboarding API forwards the address and numeric coordinates in the POST body', async () => {
  let request;
  const { onboardingApi } = load('src/services/onboarding.api.ts', {
    './api': { api: { post: async (url, data) => {
      request = { url, data };
      return { data: { onboarding_id: 'test-onboarding' } };
    } } },
  });
  for (const coordinates of [
    { longitude: 3.35776, latitude: 6.6143785 },
    { longitude: 0, latitude: 0 },
  ]) {
    const payload = { address: point.address, ...coordinates };
    await onboardingApi.onboardUser(payload);
    assert.equal(request.url, '/v1/customer-onboarding');
    assert.equal(request.data, payload);
    assert.equal(request.data.address, point.address);
    assert.equal(request.data.longitude, coordinates.longitude);
    assert.equal(request.data.latitude, coordinates.latitude);
    assert.equal(typeof request.data.longitude, 'number');
    assert.equal(typeof request.data.latitude, 'number');
  }
});

test('manual search uses the documented GreenPower geocode envelope and request', async () => {
  let request;
  const { locationApi } = service(async (config) => {
    request = config;
    return { data: { results: [point] } };
  });
  const results = await locationApi.geocode('  Ikeja City Mall  ');
  assert.equal(results[0].address, point.address);
  assert.equal(request.url, '/v1/location/geocode');
  assert.equal(request.method, 'POST');
  assert.equal(request.data.address, 'Ikeja City Mall');
  assert.equal(request.timeout, 70000);
  assert.equal(request.headers, undefined);
});

test('empty results are distinct from a mismatched provider envelope', async () => {
  const empty = service(async () => ({ data: { results: [] } }));
  assert.equal((await empty.locationApi.geocode('Lagos')).length, 0);
  const malformed = service(async () => ({ data: { data: { results: [] } } }));
  await assert.rejects(malformed.locationApi.geocode('Lagos'), /response format/);
});

test('bad coordinates in provider results fail explicitly', async () => {
  const { locationApi } = service(async () => ({ data: { results: [{ ...point, latitude: '6' }] } }));
  await assert.rejects(locationApi.geocode('Lagos'), /unexpected result/);
});

test('normalization preserves capture time, zero accuracy, and authoritative coordinates', async () => {
  const { locationApi } = service(async () => ({
    data: { success: true, location: { ...point, ...raw, source: 'device_geolocation' } },
  }));
  const capture = await locationApi.normalize(raw);
  assert.equal(capture.latitude, raw.latitude);
  assert.equal(capture.longitude, raw.longitude);
  assert.equal(capture.accuracy_m, 0);
  assert.equal(capture.captured_at, raw.captured_at);
});

test('normalization rejects changed GPS coordinates and incomplete records', async () => {
  for (const response of [
    { success: true, location: { ...point, ...raw, latitude: 7, source: 'device_geolocation' } },
    { success: true, location: point },
    { success: false },
  ]) {
    const { locationApi } = service(async () => ({ data: response }));
    await assert.rejects(locationApi.normalize(raw));
  }
});

test('health requires providerConfigured, not just an HTTP 200', async () => {
  const { locationApi } = service(async () => ({ data: { ok: true, providerConfigured: false } }));
  await assert.rejects(locationApi.health(), /not ready/);
});

test('provider 401 is a service error rather than a request for user credentials', async () => {
  const { locationApi } = service(async () => {
    throw { isAxiosError: true, response: { status: 401, data: { message: 'private upstream detail' } } };
  });
  await assert.rejects(locationApi.geocode('Lagos'), (error) => {
    assert.equal(error.status, 401);
    assert.match(error.message, /administrator/);
    assert.doesNotMatch(error.message, /private upstream detail/);
    return true;
  });
});

test('rate limiting respects Retry-After and prevents another network call', async () => {
  let requests = 0;
  const { locationApi } = service(async () => {
    requests++;
    throw { isAxiosError: true, response: { status: 429, headers: { 'retry-after': '60' } } };
  });
  await assert.rejects(locationApi.geocode('Lagos'), (error) => error.retryAt > Date.now());
  await assert.rejects(locationApi.geocode('Abuja'), (error) => error.status === 429);
  assert.equal(requests, 1);
});

function captureFunction(globals) {
  return load('src/hooks/useLocationPicker.ts', {
    react: {}, '@tanstack/react-query': {},
    '@/services/location.api': {}, '@/types/location.types': types,
  }, globals).captureDevicePosition;
}

test('GPS is requested explicitly with fresh high-accuracy settings', async () => {
  let requests = 0;
  const capture = captureFunction({
    window: { isSecureContext: true },
    navigator: { geolocation: { getCurrentPosition(success, _error, options) {
      requests++;
      assert.equal(options.enableHighAccuracy, true);
      assert.equal(options.maximumAge, 0);
      assert.equal(options.timeout, 20000);
      success({ coords: { latitude: 0, longitude: 0, accuracy: 0 }, timestamp: 1790967600000 });
    } } },
  });
  assert.equal(requests, 0);
  const captured = await capture();
  assert.equal(requests, 1);
  assert.equal(captured.latitude, 0);
  assert.equal(captured.accuracy_m, 0);
  assert.equal(captured.captured_at, new Date(1790967600000).toISOString());
});

test('insecure context, unsupported GPS, denied permission, unavailable and timeout are actionable', async () => {
  await assert.rejects(captureFunction({ window: { isSecureContext: false }, navigator: {} })(), /HTTPS/);
  await assert.rejects(captureFunction({ window: { isSecureContext: true }, navigator: {} })(), /supported browser/);
  for (const [code, expected] of [[1, /denied/], [2, /determined/], [3, /timed out/]]) {
    const capture = captureFunction({
      window: { isSecureContext: true },
      navigator: { geolocation: { getCurrentPosition(_ok, fail) { fail({ code }); } } },
    });
    await assert.rejects(capture(), expected);
  }
});
