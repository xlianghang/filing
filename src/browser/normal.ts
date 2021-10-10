import { FilingBasic, FilingBasicOptions, FilingRequiredOptions } from '../common'
import type { BrowserFileData, ExtractOptions, FileData} from '../types'

export class FilingBrowser extends FilingBasic {
  constructor(options: FilingBasicOptions<FilingBrowser> & Pick<FilingRequiredOptions, 'wasmUrl'>) {
    super(options)
  }

  protected blobToBuffer(file: File | Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsArrayBuffer(file);
    });
  }

  protected _toBrowserFileData(fileData: FileData): BrowserFileData {
    return {
      ...fileData,
      file: new File(
        [fileData.data],
        fileData.filename,
        { type: 'application/octet-stream' }
      ),
      children: fileData.children?.map(this._toBrowserFileData)
    }
  }

  public async extract(file: File | Blob, extractOptions?: ExtractOptions): Promise<BrowserFileData[]> {
    const arrayBuffer = await this.blobToBuffer(file)
    const int8Array = new Int8Array(arrayBuffer)
    const bridge = await this.bridgePromise
    const fileDataList = bridge.extract(int8Array, extractOptions)
    return fileDataList.map(this._toBrowserFileData);
  }
}