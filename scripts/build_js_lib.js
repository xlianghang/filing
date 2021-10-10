const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { info, loading } = require('prettycli');

const WORKER_ENTRY = 'worker/index.js'
const WORKER_WRAPPRER_ENTRY = 'browser/worker.js'
const WORKER_CODE_PLACEHOLDER = '$$FILING_WORKER_CODE$$'
// const WORKER_IIFE_PATH = 'dist/.temp/worker.js'
const WORKER_IIFE_MIN_PATH = 'dist/.temp/worker.min.js'
const cwd = process.cwd()

function injectWorkerCodeToLibCode(libType) {
    const workerWrapperPath = path.join(cwd, `./dist/${libType}/${WORKER_WRAPPRER_ENTRY}`)
    const workerMinJsPath = path.join(cwd, WORKER_IIFE_MIN_PATH)

    const rawWrapperCode = fs.readFileSync(workerWrapperPath, 'utf8')
    const workerMinCode = fs.readFileSync(workerMinJsPath, 'utf8')

    const finalWrapperCode = rawWrapperCode.replace(WORKER_CODE_PLACEHOLDER, JSON.stringify(workerMinCode))

    fs.writeFileSync(workerWrapperPath, finalWrapperCode)
}

function copyBirdgeDTS(libType) {
    const sourceBridgeDTSPath = path.join(cwd, './src/wasm/archive.d.ts')
    const outputBridgeDTSPath = path.join(cwd, `./dist/${libType}/wasm/archive.d.ts`)
    const sourceBridgeDTSCode = fs.readFileSync(sourceBridgeDTSPath, 'utf8')
    fs.writeFileSync(outputBridgeDTSPath, sourceBridgeDTSCode, 'utf8')
}

loading('Clear', 'Clearing files...')
execSync('rm -rf ./dist')
info('Clear', 'Done!')

loading('ES2015', 'Building es2015...')
execSync('npx tsc --module es2015 --target es2015 --outDir dist/es2015')
execSync('cp src/wasm/archive.wasm dist/es2015/wasm/archive.wasm')
info('ES2015', 'Done!')

loading('ESM', 'Building esm...')
execSync('npx tsc --module es2015 --target es5 --outDir dist/esm')
execSync('cp src/wasm/archive.wasm dist/esm/wasm/archive.wasm')
info('ESM', 'Done!')

loading('CJS', 'Building cjs...')
execSync('npx tsc --module commonjs --target es5 --outDir dist/cjs')
execSync('cp src/wasm/archive.wasm dist/cjs/wasm/archive.wasm')
info('CSJ', 'Done!')

loading('UMD', 'Building umd...')
execSync('mkdir ./dist/umd')
execSync('npx rollup --input dist/esm/browser/index.js --format umd --name filing --sourceMap --file dist/umd/filing.browser.js -p @rollup/plugin-node-resolve')
execSync('npx rollup --input dist/esm/browser/index.js --format umd --name filing --file dist/umd/filing.browser.min.js -p @rollup/plugin-node-resolve -p rollup-plugin-terser && gzip ./dist/umd/filing.browser.min.js -c > ./dist/umd/filing.browser.min.js.gz')
info('UMD', 'Done!')

loading('Worker', 'Building web worker...')
execSync('mkdir dist/.temp')
execSync(`npx rollup --input dist/esm/${WORKER_ENTRY} --format iife --file ${WORKER_IIFE_MIN_PATH} -p @rollup/plugin-node-resolve -p rollup-plugin-terser`)
;['es2015', 'esm', 'cjs'].forEach(injectWorkerCodeToLibCode)
execSync(`npx rollup --input dist/esm/${WORKER_WRAPPRER_ENTRY} --format umd --name filing --file dist/umd/filing.browser.worker.js -p @rollup/plugin-node-resolve`)
execSync(`npx rollup --input dist/esm/${WORKER_WRAPPRER_ENTRY} --format umd --name filing --file dist/umd/filing.browser.worker.min.js -p @rollup/plugin-node-resolve -p rollup-plugin-terser && gzip ./dist/umd/filing.browser.worker.min.js -c > ./dist/umd/filing.browser.worker.min.js.gz`)
// execSync('rm -rf ./dist/.temp')
info('Worker', 'Done!')

loading('Copy', 'Copying archive.d.ts...')
;['es2015', 'esm', 'cjs'].forEach(copyBirdgeDTS)
info('Copy', 'Done!')

info('Success', 'All done!')