export function isElectron() {
  return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent.includes('Electron');
}

export function openInVlc(url) {
  try {
    window.open(`vlc://${url}`, '_self');
    return true;
  } catch (error) {
    console.error('Failed to open VLC:', error);
    return false;
  }
}

export function openInMxPlayer(url) {
  try {
    const intentUrl = `intent:${url}#Intent;package=com.mxtech.videoplayer.ad;S.title=Stream;end`;
    window.open(intentUrl, '_self');
    return true;
  } catch (error) {
    console.error('Failed to open MX Player:', error);
    return false;
  }
}

export async function copyStreamUrl(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function openExternalStream(url, playerName) {
  if (!url) return false;

  switch (playerName?.toLowerCase()) {
    case 'vlc':
      return openInVlc(url);
    case 'mxplayer':
      return openInMxPlayer(url);
    case 'clipboard':
      copyStreamUrl(url);
      return true;
    default:
      if (isElectron()) {
        console.log('Sending to electron main process for external playback');
        // If we had electron IPC, we'd send it here
      }
      return false;
  }
}
