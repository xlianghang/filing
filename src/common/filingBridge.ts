import type { FileData, ExtractOptions } from '../types'
import type { ArchiveEmscriptenModule } from '../wasm/archive'


export interface CreateOptions {
    wasmUrl: string
}


const TYPE_MAP = {
    32768: 'FILE',
    16384: 'DIR',
    40960: 'SYMBOLIC_LINK',
    49152: 'SOCKET',
    8192:  'CHARACTER_DEVICE',
    24576: 'BLOCK_DEVICE',
    4096:  'NAMED_PIPE',
} as const;

const DEFAULT_LOCALE = 'zh_CN.GB2312'

export class FilingBridge {
    protected cApi = {
        extract: this.archiveModule.cwrap('extract', 'number', [
            'number',
            'number',
            'string'
          ]),
          getNextEntry: this.archiveModule.cwrap('get_next_entry', 'number', ['number']) as (arg1: number) => number,
          getEntryPathname: this.archiveModule.cwrap('archive_entry_pathname_utf8', 'string', ['number']),
          getEntrySize: this.archiveModule.cwrap('archive_entry_size', 'number', ['number']),
          getEntryType: this.archiveModule.cwrap('archive_entry_filetype', 'number', ['number']),
          getFileData: this.archiveModule.cwrap('get_filedata', 'number', ['number','number']),
    }
    constructor(
        protected archiveModule: ArchiveEmscriptenModule,
    ) {
    }

    public malloc(size: number): number {
        const pointer = this.archiveModule._malloc(size)
        return pointer
    }

    public free(pointer: number): void {
        this.archiveModule._free(pointer)
    }

    public extract(int8Array: Int8Array, options?: ExtractOptions) {
        const { locale = DEFAULT_LOCALE } = options || {}
        const dataLength = int8Array.length
        const pointer = this.malloc(dataLength)
        this.archiveModule.HEAP8.set(int8Array, pointer)
        const archivePointer = this.cApi.extract(pointer, dataLength, locale)
        return this.iterate(archivePointer)
    }

    protected iterate(archivePointer: number): FileData[] {
        const result: FileData[] = []
        while (true) {
            const nextEntryPointer = this.cApi.getNextEntry(archivePointer)
            if (!nextEntryPointer) {
                break;
            }
            const pathname = this.cApi.getEntryPathname(nextEntryPointer)
            const size = this.cApi.getEntrySize(nextEntryPointer)
            const ptr = this.cApi.getFileData(archivePointer, size)
            const rawType = this.cApi.getEntryType(nextEntryPointer)
            // @ts-ignore
            const type = TYPE_MAP[rawType]
            const data = this.archiveModule.HEAP8.slice(ptr, ptr + size);
            result.push({
                pathname,
                data,
                type,
                filename: pathname,
            })
        }
        return result
    }

}