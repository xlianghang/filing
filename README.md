# Filing

## Examples
### Browser
```javascript
import { FilingBrowser } from 'filing'
const filing = new FilingBrowser({
    wasmUrl: 'https://unpkg.com/filing/dist/esm/wasm/archive.wasm'
})

filing.extract(file).then((list) => {
    console.log('list', list)
})
```

### Browser Web Worker(Recommend)
```javascript
import { FilingBrowserWorker } from 'filing'
const filing = new FilingBrowserWorker({
    wasmUrl: 'https://unpkg.com/filing/dist/esm/wasm/archive.wasm'
})

filing.extract(file).then((list) => {
    console.log('list', list)
})
```

### NodeJS
```javascript
import { FilingNodeJS } from 'filing'
const filing = new FilingNodeJS()

filing.extract(file).then((list) => {
    console.log('list', list)
})
```
