const { readFile } = require('fs').promises
const path = require('path')

const pathResolver = async (f) => {
  const filename = path.isAbsolute(f) ? f : path.resolve(process.cwd(), f)
  const pattern = /require\s*\(\s*(".*"|'.*')\s*\)/g
  const requires = new Set()
  let content = await readFile(filename, 'utf8')
  let result

  while (result = pattern.exec(content)) { // eslint-disable-line
    requires.add(result[1].slice(1, result[1].length - 1))
  }

  for (const value of requires.values()) {
    if (value[0] === '.') {
      const dirname = path.dirname(filename)
      const relative = path.relative(dirname, path.resolve(dirname, value))

      content = content.replace(
        new RegExp(value, 'g'),
        relative[0] === '.' ? relative : `./${relative}`
      )
    }
  }

  return content
}

module.exports = pathResolver

if (require.main === module) {
  const inputs = process.argv.slice(2)

  if (inputs.length) {
    Promise.all(inputs.map(pathResolver))
      .then(contents => {
        console.log(contents.join('\n'))
      })
      .catch(error => {
        console.error(error)
        process.exit(1)
      })
  }
}
