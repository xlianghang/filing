import archive from '../wasm/archive'
import { FilingBridge } from './filingBridge'

export interface FilingRequiredOptions {
  wasmUrl: string
  wasmBinary: ArrayBuffer
}

export interface FilingBasicOptions<T> {
  onInitialized?(filingBrowser: T): void
  onInitialFailed?(err: Error): void
}


export abstract class FilingBasic {

    protected bridgePromise: Promise<FilingBridge>
  
    constructor(options: FilingBasicOptions<any> & Pick<FilingRequiredOptions, 'wasmUrl'>)

    constructor(options: FilingBasicOptions<any> & Pick<FilingRequiredOptions, 'wasmBinary'>)

    constructor(options: FilingBasicOptions<any> & FilingRequiredOptions) {
      const { wasmBinary, wasmUrl } = options || {}
      const wasmOptions: Parameters<typeof archive>[0] = {}
      if (wasmBinary) {
        wasmOptions.wasmBinary = wasmBinary
      } else if (wasmUrl) {
        wasmOptions.locateFile = () => wasmUrl
      }

      this.bridgePromise = new Promise(resolve => archive(wasmOptions).then(wasmModule => resolve(new FilingBridge(wasmModule))))
      this.bridgePromise.then(() => {
        options?.onInitialized?.(this)
      })
        .catch((rawErr) => {
          const error = rawErr instanceof Error ? rawErr : new Error(rawErr?.message || 'Load wasm failed.')
          options?.onInitialFailed?.(error)
          throw error
        })
    }
  
    // public abstract extract(file: File | Blob | Buffer | string, options?: ExtractOptions): Promise<BrowserFileData[]> | Promise<NodeJSFileData[]>
  
    // public abstract extract(file: Buffer | string, options?: ExtractOptions): Promise<NodeJSFileData[]>

    // public abstract extract(file: Buffer | string, options?: ExtractOptions): Promise<NodeJSFileData[]>
  }
  