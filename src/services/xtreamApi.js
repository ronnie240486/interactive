export async function getLiveCategories(dns, user, pass) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_live_categories`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getLiveStreams(dns, user, pass, categoryId) {
  try {
    const catQuery = categoryId ? `&category_id=${categoryId}` : '';
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_live_streams${catQuery}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getVodCategories(dns, user, pass) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_vod_categories`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getVodStreams(dns, user, pass, categoryId) {
  try {
    const catQuery = categoryId ? `&category_id=${categoryId}` : '';
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_vod_streams${catQuery}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getSeriesCategories(dns, user, pass) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_series_categories`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getSeriesStreams(dns, user, pass, categoryId) {
  try {
    const catQuery = categoryId ? `&category_id=${categoryId}` : '';
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_series${catQuery}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return []; }
}

export async function getSeriesInfo(dns, user, pass, seriesId) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_series_info&series_id=${seriesId}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return null; }
}

export async function getEpg(dns, user, pass, streamId) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}&action=get_short_epg&stream_id=${streamId}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return null; }
}

export async function getUserInfo(dns, user, pass) {
  try {
    const res = await fetch(`${dns}/player_api.php?username=${user}&password=${pass}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return null; }
}

export function buildStreamUrl(dns, user, pass, streamId, ext = 'ts') {
  return `${dns}/live/${user}/${pass}/${streamId}.${ext}`;
}

export function buildVodUrl(dns, user, pass, streamId, ext = 'mp4') {
  return `${dns}/movie/${user}/${pass}/${streamId}.${ext}`;
}

export function buildSeriesUrl(dns, user, pass, episodeId, ext = 'mp4') {
  return `${dns}/series/${user}/${pass}/${episodeId}.${ext}`;
}