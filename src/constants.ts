export const MESSAGE_TYPE = {
    INIT_REQUEST: 'FILING_INIT_REQUEST',
    INIT_RESPONSE: 'FILING_INIT_RESPONSE',
    EXTRACT_REQUEST: 'FILING_EXTRACT_REQUEST',
    EXTRACT_RESPONSE: 'FILING_EXTRACT_RESPONSE'
} as const

export interface MessageData<T = any> {
    id: string
    payload: T
    type: typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE]
}
