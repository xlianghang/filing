import 'emscripten'

export interface ArchiveEmscriptenModule extends EmscriptenModule {
    cwrap: typeof cwrap
    FS: typeof FS & {
        filesystems: {
            WORKERFS: Emscripten.FileSystemType
        }
    }
}

declare var archive: EmscriptenModuleFactory<ArchiveEmscriptenModule>

export default archive
