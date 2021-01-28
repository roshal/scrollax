
const concurrent = require('nps-utils').concurrent.nps

const series = require('nps-utils').series.nps

const nps = {}

exports.scripts = nps

nps.develop = concurrent('watch.develop', 'serve.develop')
nps.produce = concurrent('watch.produce', 'serve.produce')

nps.release = series('clean', 'build.produce')

nps.clean = 'rimraf public/*'

nps.lint = concurrent('eslint', 'stylelint')
nps.test = series('jest')

nps.build = {
	develop: 'rollup --config',
	produce: 'rollup --config',
}

nps.watch = {
	develop: 'rollup --config --watch',
	produce: 'rollup --config --watch',
}

nps.nodemon = 'nodemon -e js -w webpack -x webpack-dev-server --hot --develop'

nps.stylelint = {
	default: 'stylelint source/**/*.ss',
	fix: 'stylelint --fix source/**/*.ss',
}

nps.eslint = {
	default: 'eslint source webpack',
	fix: 'eslint --fix source webpack',
}
