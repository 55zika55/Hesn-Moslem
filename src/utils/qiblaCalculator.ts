export interface QiblaResult {
  angle: number; // 0 to 360 degrees clockwise from True North
  distanceKm: number;
  directionNameAr: string;
  directionNameEn: string;
}

const MAKKAH_LAT = 21.422487;
const MAKKAH_LNG = 39.826206;

const d2r = (deg: number) => (deg * Math.PI) / 180;
const r2d = (rad: number) => (rad * 180) / Math.PI;

export function calculateQibla(userLat: number, userLng: number): QiblaResult {
  const phi1 = d2r(userLat);
  const phi2 = d2r(MAKKAH_LAT);
  const deltaLambda = d2r(MAKKAH_LNG - userLng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let qiblaBearing = r2d(Math.atan2(y, x));
  qiblaBearing = (qiblaBearing + 360) % 360;

  // Haversine distance
  const R = 6371; // Earth radius in km
  const deltaPhi = d2r(MAKKAH_LAT - userLat);
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Cardinal direction names in Arabic and English
  const directions = [
    { max: 22.5, ar: 'شمال', en: 'North' },
    { max: 67.5, ar: 'شمال شرق', en: 'North-East' },
    { max: 112.5, ar: 'شرق', en: 'East' },
    { max: 157.5, ar: 'جنوب شرق', en: 'South-East' },
    { max: 202.5, ar: 'جنوب', en: 'South' },
    { max: 247.5, ar: 'جنوب غرب', en: 'South-West' },
    { max: 292.5, ar: 'غرب', en: 'West' },
    { max: 337.5, ar: 'شمال غرب', en: 'North-West' },
    { max: 360.0, ar: 'شمال', en: 'North' }
  ];

  let directionNameAr = 'شمال';
  let directionNameEn = 'North';
  for (const dir of directions) {
    if (qiblaBearing <= dir.max) {
      directionNameAr = dir.ar;
      directionNameEn = dir.en;
      break;
    }
  }

  return {
    angle: Math.round(qiblaBearing * 10) / 10,
    distanceKm,
    directionNameAr,
    directionNameEn
  };
}
