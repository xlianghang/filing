import fs from 'fs'
import path from 'path'
import { FilingBasic, FilingBasicOptions } from '../common'
import type { ExtractOptions, FileData, NodeJSFileData } from '../types'

export class FilingNodeJS extends FilingBasic {
  constructor(options?: FilingBasicOptions<FilingNodeJS>) {
    const wasmPath = path.join(__dirname, '../wasm/archive.wasm');
    const wasmBinary = fs.readFileSync(wasmPath)
    super({
      ...options,
      wasmBinary
    })
  }

  protected _toNodeJSFileData(fileData: FileData): NodeJSFileData {
    const buffer = Buffer.from(fileData.data)
    return {
      ...fileData,
      buffer,
      children: fileData?.children?.map(this._toNodeJSFileData)
    }
  }

  public async extract(file: Buffer | string) {
    if (Buffer.isBuffer(file)) {
      return this.extractByBuffer(file)
    }

    if (typeof file === 'string') {
      return this.extractByFilePath(file)
    }

    throw "Argument must be a buffer or filepath."
  }

  public async extractByFilePath(filepath: string) {
    const buffer = await fs.readFileSync(filepath)
    return this.extractByBuffer(buffer)
  }

  public async extractByBuffer(buffer: Buffer, extractOptions?: ExtractOptions) {
    const int8Array = new Int8Array(buffer)
    const bridge = await this.bridgePromise
    return bridge.extract(int8Array, extractOptions).map(this._toNodeJSFileData)
  }
}