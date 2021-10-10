import type { FilingBrowser } from './normal'
import { MESSAGE_TYPE } from '../constants'

// @ts-ignore
const FILING_WORKER_CODE = $$FILING_WORKER_CODE$$;


const blob = new Blob([FILING_WORKER_CODE], { type: 'text/javascript' });
const workerUrl = URL.createObjectURL(blob)
const worker = new Worker(workerUrl)

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })
}

export class FilingBrowserWorker implements Pick<FilingBrowser, 'extract'> {
    constructor(options: ConstructorParameters<typeof FilingBrowser>[0]) {
        worker.postMessage({
            type: MESSAGE_TYPE.INIT_REQUEST,
            payload: options,
        })
    }

    extract: FilingBrowser['extract'] = (file, options) => {
        return new Promise((resolve) => {
            const requestId = uuid()
            const messageEvent = (e: WorkerEventMap['message']) => {
                const { payload, type, id: responseId } = e.data
                if (type === MESSAGE_TYPE.EXTRACT_RESPONSE && requestId == responseId) {
                    worker.removeEventListener('message', messageEvent)
                    resolve(payload)
                }
            }
            worker.addEventListener('message', messageEvent)
            worker.postMessage({
                type: MESSAGE_TYPE.EXTRACT_REQUEST,
                payload: {
                    file,
                    options,
                },
                id: requestId,
            })
        })
    }
}