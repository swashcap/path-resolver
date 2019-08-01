const path = require('path')
const test = require('tape')

const pathResolver = require('../')

test('pathResolver', async (t) => {
  t.plan(3)

  t.equal(
    await pathResolver(path.join(__dirname, 'fixtures/a/alpha.js')),
    `/* eslint-disable no-unused-vars */
const beta = require('./b/beta')
const charlie = require('./b/c/charlie')
`
  )
  t.equal(
    await pathResolver('tests/fixtures/a/b/beta.js'),
    `/* eslint-disable no-unused-vars */
const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')

const charlie = require('./c/charlie')
`
  )
  t.equal(
    await pathResolver('tests/fixtures/a/b/c/charlie.js'),
    `/* eslint-disable no-unused-vars */
const util = require('util')

const beta = require('../beta.js')
const alpha = require('../../alpha')
`
  )
})
