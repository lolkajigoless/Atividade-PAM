import { useEffect, useMemo, useState } from 'react';
import {
  ROUTE, DESTINATION, TICK_MS, NEAR_RADIUS_M, DELIVERED_RADIUS_M, AVG_SPEED_MS,
} from '../data/mockRoute';
import { haversine, bearing } from '../utils/geo';

export const STATUS = {
  TRANSIT: 'Em Trânsito',
  NEAR: 'Próximo',
  DELIVERED: 'Entregue',
};

/** Simula o entregador andando pelo array ROUTE com setInterval. */
export function useCourierSimulation() {
  const [index, setIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const finished = index >= ROUTE.length - 1;

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, ROUTE.length - 1));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [finished, runId]);

  const restart = () => {
    setIndex(0);
    setRunId((r) => r + 1);
  };

  return useMemo(() => {
    const position = ROUTE[index];
    const next = ROUTE[Math.min(index + 1, ROUTE.length - 1)];
    const prev = ROUTE[Math.max(index - 1, 0)];
    // Direção do deslocamento: do ponto atual ao próximo (no último ponto, mantém a anterior)
    const heading = finished ? bearing(prev, position) : bearing(position, next);
    const distance = haversine(position, DESTINATION);
    const status =
      finished || distance <= DELIVERED_RADIUS_M
        ? STATUS.DELIVERED
        : distance < NEAR_RADIUS_M
        ? STATUS.NEAR
        : STATUS.TRANSIT;
    const etaMin = status === STATUS.DELIVERED ? 0 : Math.max(1, Math.round(distance / AVG_SPEED_MS / 60));
    return {
      index, total: ROUTE.length, position, heading, distance, status, etaMin,
      trail: ROUTE.slice(0, index + 1), restart,
    };
  }, [index, finished]);
}
