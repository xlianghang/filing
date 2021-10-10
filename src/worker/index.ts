import { MessageData, MESSAGE_TYPE } from '../constants'
import { FilingBrowser } from '../browser/normal'

let initFlag = false

const filingPromiseHelper = {
    resolve: (filing: FilingBrowser) => {},
    reject: () => {}
}

const filingPromise: Promise<FilingBrowser> = new Promise((resolve, reject) => {
    filingPromiseHelper.resolve = resolve
    filingPromiseHelper.reject = reject
})

self.addEventListener('message', async (e: MessageEvent<MessageData>) => {
    const { type, id, payload } = e.data
    switch (type) {
        case MESSAGE_TYPE.INIT_REQUEST: {
            !initFlag && new FilingBrowser({
                ...payload,
                onInitialized(ins) {
                    payload?.onInitialized?.(ins)
                    // 只有初始化成功，执行 resolve
                    initFlag = true
                    filingPromiseHelper.resolve(ins)
                }
            })
            break;
        }

        case MESSAGE_TYPE.EXTRACT_REQUEST: {
            const filingBrowser = await filingPromise
            const { file, options } = payload
            const fileDataList = await filingBrowser.extract(file, options)
            self.postMessage({
                id,
                type: MESSAGE_TYPE.EXTRACT_RESPONSE,
                payload: fileDataList
            })
            break;
        }

        default:
            break;

    }
})
