export const hasNewVersion = async () => {
  try {
    const res = await fetch('/version.json', { cache: 'no-store' });
    const serverVersion = await res.json();

    if (serverVersion.version !== __APP_VERSION__) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error('버전 체크 실패', e);
  }
};
