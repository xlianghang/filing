export interface GenerateOptions {
  type: 'zip' | '7z' | 'rar'
}

export interface ExtractOptions {
  locale?: string
}

export type FileData = {
  filename: string
  pathname: string
  data: Int8Array
  type: string
  children?: FileData[]
}

export type BrowserFileData = FileData & {
  file: File
  children?: BrowserFileData[]
}


export type NodeJSFileData = FileData & {
  buffer: Buffer
  children?: NodeJSFileData[]
}