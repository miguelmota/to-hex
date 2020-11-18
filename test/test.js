const test = require('tape')
const BN = require('bn.js')
const BigNumber = require('bignumber.js')
const Big = require('big.js')
const Decimal = require('decimal.js')
const { randomBytes } = require('crypto')
const toHex = require('../')

test('toHex', t => {
  t.plan(46)

  // invalid values
  t.equal(toHex(undefined), '')
  t.equal(toHex(null), '')
  t.equal(toHex({}), '')
  t.equal(toHex(), '')
  t.equal(toHex(''), '')

  // numbers
  t.equal(toHex(256), '100')
  t.equal(toHex(256.4), '100')
  t.equal(toHex(256.6), '100')

  // decimal strings
  t.equal(toHex('256.4'), '100')
  t.equal(toHex('256.6'), '100')
  t.equal(toHex('256'), '100')
  t.equal(toHex('1e3'), '3e8')

  // treat decimal strings as regular strings and not numbers
  t.equal(toHex('256', { autoDetectString: false }), '323536')

  // big number types
  t.equal(toHex(new BN(256)), '100')
  t.equal(toHex(new BN('100', 16)), '100')
  t.equal(toHex(new BigNumber(256)), '100')
  t.equal(toHex(new BigNumber('100', 16)), '100')
  // t.equal(toHex(new Big(256)), '100')
  t.equal(toHex(new Big('100', 16)), '100')
  // t.equal(toHex(new Decimal(256)), '100')
  t.equal(toHex(new Decimal('100', 16)), '100')
  t.equal(toHex(null, { addPrefix: true, evenLength: true, default: '0' }), '0x00')

  // big number strings
  t.equal(toHex('100000000000000000000'), '56bc75e2d63100000')
  t.equal(toHex('0x56BC75E2D63100000'), '56bc75e2d63100000')
  t.equal(toHex('10000000000000000000000000000000000000'), '785ee10d5da46d900f436a000000000')
  t.equal(toHex('0x785EE10D5DA46D900F436A000000000'), '785ee10d5da46d900f436a000000000')

  t.equal(toHex('112300000000000000000000000000000000000000000'), '5092409fb77fa03100f277a151e0000000000')
  t.equal(toHex('0x5092409FB77FA03100F277A151E0000000000'), '5092409fb77fa03100f277a151e0000000000')
  t.equal(toHex('1.123e+44'), '5092409fb77fa03100f277a151e0000000000')

  // hex strings
  t.equal(toHex('0x0100', { addPrefix: true }), '0x0100')
  t.equal(toHex('0x0100'), '0100')
  t.equal(toHex('abc'), '616263')
  t.equal(toHex('ABC'), '414243')

  // ascii string
  t.equal(toHex('Hello world', { addPrefix: true, evenLength: true, default: '0' }), '0x48656c6c6f20776f726c64')

  // bytes type
  const bytes = randomBytes(10)
  t.equal(toHex(bytes), bytes.toString('hex'))

  // min size
  t.equal(toHex(256, { size: 6 }).endsWith('100'), true)
  t.equal(toHex(256, { size: 6 }).length, 6)

  // with prefix
  t.equal(toHex(256, { addPrefix: true }), '0x100')
  t.equal(toHex(0, { addPrefix: true }), '0x0')
  t.equal(toHex('0', { addPrefix: true }), '0x0')

  // default value
  t.equal(toHex('', { addPrefix: true, default: '0' }), '0x0')
  t.equal(toHex('', { addPrefix: true, default: 0 }), '0x0')
  t.equal(toHex('0', { addPrefix: true, default: '0' }), '0x0')
  t.equal(toHex('0', { addPrefix: true, default: 0 }), '0x0')
  t.equal(toHex(undefined, { addPrefix: true, default: 0 }), '0x0')
  t.equal(toHex(null, { addPrefix: true, default: 0 }), '0x0')

  // even length
  t.equal(toHex(256, { evenLength: true }), '0100')

  // custom types
  const x = (n) => ({ toString: (r) => n.toString(16) })
  t.equal(toHex(x(65)), '41')
})
