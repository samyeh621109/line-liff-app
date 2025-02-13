export async function initializeLiff(liffId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liff = (window as any).liff
    await liff.init({ liffId })
    return liff
  } catch (_error) {
    console.error('LIFF 初始化錯誤:', _error)
    throw _error
  }
}
