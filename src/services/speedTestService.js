export function getQualityLabel(speedMbps) {
  if (speedMbps > 20) return 'Excelente';
  if (speedMbps > 5) return 'Boa';
  if (speedMbps > 1) return 'Regular';
  return 'Ruim';
}

export async function testConnectionSpeed(dns) {
  if (!dns) throw new Error('DNS URL required for speed test');
  
  try {
    const startTime = performance.now();
    // Use a tiny payload or simple ping if possible. We mock a short delay here for demonstration
    // if actual DNS fetch is not allowed due to CORS, but try real fetch if possible.
    
    // We'll append a timestamp to avoid cache
    const testUrl = new URL(dns);
    testUrl.pathname = '/player_api.php'; // usually lightweight
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch(testUrl.toString(), { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeoutId);
    
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);
    
    // Mock speed calculation based on latency for the sake of the test
    let mockSpeed = 50; 
    if (latencyMs > 100) mockSpeed = 25;
    if (latencyMs > 500) mockSpeed = 5;
    if (latencyMs > 2000) mockSpeed = 0.5;

    return {
      speed: `${mockSpeed.toFixed(1)} Mbps`,
      latency: `${latencyMs} ms`,
      quality: getQualityLabel(mockSpeed)
    };
  } catch (error) {
    return {
      speed: '0 Mbps',
      latency: 'Erro',
      quality: 'Ruim'
    };
  }
}
