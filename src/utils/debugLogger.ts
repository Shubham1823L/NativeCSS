export const debugLogger = (payload: unknown) => {
    if (process.env.DEBUG_MODE != 'true') return
    console.log(payload)
}