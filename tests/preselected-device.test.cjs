const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const React = require('react')

function load(file, overrides = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    },
  }).outputText
  vm.runInNewContext(code, {
    module, exports: module.exports, setTimeout,
    require: (name) => name in overrides ? overrides[name] : require(name),
  }, { filename: file })
  return module.exports
}

const deviceEnums = load('src/enum/device.enum.ts')
const categoryEnums = load('src/types/deviceCategory.ts')
const category = {
  _id: 'linked-device', model: 'Linked Solar Model', description: 'A linked device',
  device_type: 'PAYGO', amount: 120000, currency: 'NGN',
  payment_option: ['OUTRIGHT', 'INSTALLMENT'],
  installment_initialization_percentage: 20, installment_interest_rate: 10,
  installment_duration_available: 6,
  allow_manual_calculation_for_installment_payment: false,
  installment_payment_durations_option: [
    { duration_option: 'WEEKLY', amount: 4400 },
    { duration_option: 'MONTHLY', amount: 17600 },
  ],
}

function nodes(element) {
  if (!element || typeof element !== 'object') return []
  return [element, ...React.Children.toArray(element.props?.children).flatMap(nodes)]
}
function text(element) {
  if (typeof element === 'string' || typeof element === 'number') return String(element)
  if (!element || typeof element !== 'object') return ''
  return React.Children.toArray(element.props?.children).map(text).join(' ')
}
function harness(preselectedCategory) {
  const state = []
  let cursor = 0
  const queries = []
  const selected = []
  let closes = 0
  const hooks = Object.fromEntries(
    ['useDeviceClass', 'useDeviceCategoryGroup', 'useDeviceCategoryByGroupId'].map((name) => [
      name, (options) => {
        queries.push({ name, ...options })
        return { data: { data: [] }, isLoading: false, isError: false }
      },
    ]),
  )
  const { default: Modal } = load('src/components/modals/DevicePickerModal.tsx', {
    react: {
      ...React, useState(initial) {
        const slot = cursor++
        if (!(slot in state)) state[slot] = typeof initial === 'function' ? initial() : initial
        return [state[slot], (value) => { state[slot] = typeof value === 'function' ? value(state[slot]) : value }]
      },
    },
    '@/hooks/useDeviceCategory': hooks,
    '@/enum/device.enum': deviceEnums,
    '@/types/deviceCategory': categoryEnums,
    '@/hooks/useDebounce': { useDebounce: (value) => value },
    '@/utils/device.category': { getTrueAmountFromDeviceCategory: (device) => device.amount.toLocaleString() },
  })
  const props = {
    open: true, preselectedCategory, onSelect: (value) => selected.push(value),
    onClose: () => { closes++ },
  }
  function render() { cursor = 0; return Modal(props) }
  function click(label) {
    const found = nodes(render()).find((node) =>
      (node.type === 'button' || node.props?.type === 'button') && text(node).includes(label))
    assert.ok(found, `Missing button: ${label}`)
    found.props.onClick()
  }
  return { render, click, queries, selected, get closes() { return closes } }
}

test('without a linked model the existing class browser remains the entry screen', () => {
  const ui = harness()
  const tree = ui.render()
  assert.match(text(tree), /Select Device Class/)
  assert.equal(ui.queries.find((q) => q.name === 'useDeviceClass').enabled, true)
})

test('linked modal starts at Device Details and never enables browsing queries', () => {
  const ui = harness(category)
  const tree = ui.render()
  assert.match(text(tree), /Device Details/)
  assert.match(text(tree), /Linked Solar Model/)
  assert.doesNotMatch(text(tree), /Select Device Class|Step 1 of 3|Step 2 of 3/)
  assert.ok(ui.queries.every((q) => q.enabled === false))
  const header = nodes(tree).find((node) => node.props?.className?.includes('px-4 py-3.5'))
  assert.equal(nodes(header).filter((node) => node.type === 'button').length, 1, 'Only close, not back, is available')
})

test('linked installment selection returns the linked category and real calculated prices', () => {
  const ui = harness(category)
  ui.click('Installment Plan')
  assert.match(text(ui.render()), /Payment Plan/)
  assert.match(text(ui.render()), /Choose how you'll pay/)
  ui.click('Weekly')
  ui.click('Confirm')
  assert.equal(ui.selected.length, 1)
  const selected = ui.selected[0]
  assert.equal(selected.id, category._id)
  assert.equal(selected.paymentOption, 'INSTALLMENT')
  assert.equal(selected.paymentDuration, 'WEEKLY')
  assert.equal(selected.initializationAmount, 24000)
  assert.equal(selected.installmentAmount, 4400)
  assert.equal(selected.installmentDurationMonths, 6)
  assert.equal(ui.closes, 1)
})

test('back from linked payment plan returns to details, not the browser', () => {
  const ui = harness(category)
  ui.click('Installment Plan')
  const tree = ui.render()
  const header = nodes(tree).find((node) => node.props?.className?.includes('px-4 py-3.5'))
  const buttons = nodes(header).filter((node) => node.type === 'button')
  assert.equal(buttons.length, 2)
  buttons[0].props.onClick()
  assert.match(text(ui.render()), /Device Details/)
  assert.doesNotMatch(text(ui.render()), /Select Device Class/)
  assert.ok(ui.queries.every((q) => q.enabled === false))
})

test('outright uses the linked model and categories show only supported payment options', () => {
  const ui = harness({ ...category, payment_option: ['OUTRIGHT'] })
  assert.doesNotMatch(text(ui.render()), /Installment Plan/)
  ui.click('Pay Outright')
  assert.equal(ui.selected[0].id, category._id)
  assert.equal(ui.selected[0].paymentOption, 'OUTRIGHT')
  assert.equal(ui.selected[0].amount, 120000)
})

test('shared form mapping clears old installment data when switching to outright', () => {
  const { deviceSelectionFields } = load('src/lib/onboardingDevice.ts', {
    '@/enum/device.enum': deviceEnums, '@/types/deviceCategory': categoryEnums,
  })
  const installment = deviceSelectionFields({
    id: category._id, name: category.model, deviceType: 'PAYGO', amount: 120000,
    paymentOption: 'INSTALLMENT', paymentDuration: 'MONTHLY',
    initializationAmount: 24000, installmentAmount: 17600, installmentDurationMonths: 6,
  })
  assert.equal(installment.paymentTimeline, '6_month')
  assert.equal(installment.interested_device_category_id, category._id)
  const outright = deviceSelectionFields({
    id: category._id, name: category.model, deviceType: 'PAYGO', amount: 120000,
    paymentOption: 'OUTRIGHT', initializationAmount: 0,
  })
  assert.equal(outright.paymentTimeline, 'outright')
  assert.equal(outright.device_payment_duration, '')
  assert.equal(outright.device_installment_amount, null)
  assert.equal(outright.device_installment_duration_months, null)
})

test('existing category-by-ID service uses the ID-specific endpoint', async () => {
  let url
  const { DeviceCategoryApi } = load('src/services/device.api.ts', { './api': { api: {} } })
  const api = new DeviceCategoryApi({ get: async (path) => {
    url = path
    return { data: { data: category } }
  } })
  const response = await api.getDeviceCategoryDetails(category._id)
  assert.equal(url, `/v1/device-category/customer/${category._id}/one`)
  assert.equal(response.data, category)
})
