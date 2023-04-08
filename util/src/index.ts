export const parse_cookie = (cookie: string | null | undefined) => {
    let map = new Map<string, string>()
    if (cookie) {
        cookie.split(';').forEach((c) => {
            const [key, value] = c.trim().split('=')
            map.set(key, value)
        })
    }
    return map
}
