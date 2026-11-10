import { useEffect, useRef, useState } from 'react';
import { Magnetometer } from 'expo-sensors';
import { magnetometerHeading, shortestAngle } from '../utils/geo';

/** Retorna o heading do celular (graus, 0 = norte) já suavizado. */
export function useCompass() {
  const [heading, setHeading] = useState(0);
  const smooth = useRef(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(200);
    const sub = Magnetometer.addListener((data) => {
      const raw = magnetometerHeading(data);
      // filtro passa-baixa circular para evitar tremedeira do sensor
      smooth.current =
        smooth.current === null
          ? raw
          : (smooth.current + shortestAngle(smooth.current, raw) * 0.25 + 360) % 360;
      setHeading(smooth.current);
    });
    return () => sub.remove();
  }, []);

  return heading;
}
