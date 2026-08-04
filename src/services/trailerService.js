export function formatTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\[.*?\]/g, '') // Remove tags like [HD], [4K]
    .replace(/\(.*?\)/g, '') // Remove tags like (DUB), (LEG)
    .replace(/\|.*$/g, '') // Remove trailing info after pipe
    .trim();
}

export async function searchTrailerYoutube(title) {
  const cleanTitle = formatTitle(title);
  const query = encodeURIComponent(`${cleanTitle} trailer oficial dublado`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

export async function getMovieInfo(title) {
  const cleanTitle = formatTitle(title);
  // Mock API response since TMDB requires an API key
  return {
    title: cleanTitle,
    year: new Date().getFullYear(),
    rating: (Math.random() * 5 + 5).toFixed(1), // Random rating between 5.0 and 10.0
    description: `Esta é uma sinopse gerada automaticamente para o filme/série "${cleanTitle}". Em um mundo cheio de aventuras e mistérios, os personagens embarcam em uma jornada inesquecível.`,
    trailerUrl: await searchTrailerYoutube(title)
  };
}
