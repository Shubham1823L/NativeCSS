export const debugLogger = (payload: unknown) => {
    if (process.env.DEBUG_MODE != 'true' || process.env.NODE_ENV !== 'development') return
    console.log(payload)
}