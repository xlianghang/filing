# Filing

[![npm version](https://img.shields.io/npm/v/filing.svg)](https://www.npmjs.com/package/filing)
[![license](https://img.shields.io/npm/l/filing.svg)](https://github.com/xlianghang/filing/blob/master/LICENSE)

A lightweight library for extracting archive files (zip, 7z, rar) in the browser and Node.js, powered by [libarchive](https://www.libarchive.org/) compiled to WebAssembly.

## Features

- **Cross-platform** - Works in both Browser and Node.js environments
- **Multiple formats** - Supports zip, 7z, rar and more archive formats
- **Web Worker support** - Offload extraction to a worker thread for better performance
- **TypeScript** - Full TypeScript support with type definitions included
- **Lightweight** - Minimal dependencies, powered by WebAssembly

## Installation

```bash
# npm
npm install filing

# yarn
yarn add filing

# pnpm
pnpm add filing
```

## Usage

### Browser (Web Worker - Recommended)

Using Web Worker prevents blocking the main thread during extraction:

```javascript
import { FilingBrowserWorker } from 'filing'

const filing = new FilingBrowserWorker({
  wasmUrl: 'https://unpkg.com/filing/dist/esm/wasm/archive.wasm'
})

// Extract from File or Blob
const fileInput = document.getElementById('file')
fileInput.addEventListener('change', async (e) => {
  const [file] = e.target.files
  
  const files = await filing.extract(file)
  
  files.forEach((fileData) => {
    console.log(fileData.pathname) // File path in archive
    console.log(fileData.file)     // Extracted File object
  })
})
```

### Browser (Main Thread)

For simple use cases or when Web Worker is not available:

```javascript
import { FilingBrowser } from 'filing'

const filing = new FilingBrowser({
  wasmUrl: 'https://unpkg.com/filing/dist/esm/wasm/archive.wasm'
})

const files = await filing.extract(file)
console.log('Extracted files:', files)
```

### Node.js

```javascript
import { FilingNodeJS } from 'filing'
import fs from 'fs'

const filing = new FilingNodeJS()

// Extract from Buffer
const buffer = fs.readFileSync('./archive.zip')
const files = await filing.extract(buffer)

files.forEach((fileData) => {
  console.log(fileData.pathname) // File path in archive
  console.log(fileData.buffer)   // Extracted Buffer
})

// Or extract from file path directly
const files = await filing.extract('./archive.7z')
```

### CDN Usage

You can also use Filing directly in the browser via CDN:

```html
<script src="https://unpkg.com/filing/dist/umd/filing.min.js"></script>
<script>
  const { FilingBrowser } = window.filing
  
  const filing = new FilingBrowser({
    wasmUrl: 'https://unpkg.com/filing/dist/esm/wasm/archive.wasm'
  })
  
  // Use filing.extract() as shown above
</script>
```

## API Reference

### Constructor Options

#### Browser Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `wasmUrl` | `string` | Yes* | URL to the archive.wasm file |
| `wasmBinary` | `ArrayBuffer` | Yes* | Pre-loaded WASM binary |
| `onInitialized` | `(instance) => void` | No | Callback when WASM is loaded |
| `onInitialFailed` | `(error) => void` | No | Callback when loading fails |

*Either `wasmUrl` or `wasmBinary` is required.

#### Node.js Options

`FilingNodeJS` automatically loads the WASM file, no options required.

### Methods

#### `extract(file, options?)`

Extracts files from an archive.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `File \| Blob` (Browser) / `Buffer \| string` (Node.js) | Archive file to extract |
| `options.locale` | `string` | Locale for filename encoding (optional) |

**Returns:** `Promise<BrowserFileData[]>` or `Promise<NodeJSFileData[]>`

### Types

```typescript
// Browser file data
interface BrowserFileData {
  filename: string       // File name
  pathname: string       // Full path in archive
  data: Int8Array        // Raw file data
  type: string           // MIME type
  file: File             // Extracted File object
  children?: BrowserFileData[]
}

// Node.js file data
interface NodeJSFileData {
  filename: string       // File name
  pathname: string       // Full path in archive
  data: Int8Array        // Raw file data
  type: string           // MIME type
  buffer: Buffer         // Extracted Buffer
  children?: NodeJSFileData[]
}
```

## Supported Formats

Filing uses libarchive under the hood, supporting a wide range of archive formats:

- **ZIP** - .zip
- **7-Zip** - .7z
- **RAR** - .rar
- **TAR** - .tar, .tar.gz, .tar.bz2, .tar.xz
- **And more...**

## Examples

Check out the [examples](./examples) directory for complete working examples:

- [Browser Example](./examples/browser) - Using Web Worker in browser
- [Browser CDN Example](./examples/browser-cdn) - Using CDN in browser
- [Node.js Example](./examples/nodejs) - Using in Node.js

## License

[MIT](./LICENSE) © lianghang
