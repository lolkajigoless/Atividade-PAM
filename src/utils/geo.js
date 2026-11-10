const R = 6371000; // raio da Terra em metros
const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

/** Distância em metros entre dois pontos (fórmula de Haversine). */
export function haversine(a, b) {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Direção (0–360°, a partir do norte) para ir de a até b. */
export function bearing(a, b) {
  const p1 = toRad(a.latitude);
  const p2 = toRad(b.latitude);
  const dl = toRad(b.longitude - a.longitude);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Heading do celular (0–360°, norte = 0) a partir do magnetômetro, com o aparelho na horizontal. */
export function magnetometerHeading({ x, y }) {
  return (toDeg(Math.atan2(-x, y)) + 360) % 360;
}

/** Menor diferença angular (-180..180) de "from" até "to". */
export function shortestAngle(from, to) {
  return ((to - from + 540) % 360) - 180;
}

export function cardinal(deg) {
  const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
