// Dados simulados (mock): trajeto pré-definido do entregador em São Paulo.
export const DESTINATION = {
  latitude: -23.585,
  longitude: -46.6442,
  title: 'Endereço de entrega',
  address: 'Rua Exemplo, 123 - Vila Mariana',
};

export const ROUTE = [
  { latitude: -23.5614, longitude: -46.6559 },
  { latitude: -23.5628, longitude: -46.6552 },
  { latitude: -23.5643, longitude: -46.6544 },
  { latitude: -23.5658, longitude: -46.6536 },
  { latitude: -23.5673, longitude: -46.6529 },
  { latitude: -23.5689, longitude: -46.6522 },
  { latitude: -23.5704, longitude: -46.6514 },
  { latitude: -23.5719, longitude: -46.6507 },
  { latitude: -23.5735, longitude: -46.65 },
  { latitude: -23.575, longitude: -46.6492 },
  { latitude: -23.5765, longitude: -46.6485 },
  { latitude: -23.578, longitude: -46.6478 },
  { latitude: -23.5794, longitude: -46.6471 },
  { latitude: -23.5806, longitude: -46.6465 },
  { latitude: -23.5816, longitude: -46.646 },
  { latitude: -23.5824, longitude: -46.6456 },
  { latitude: -23.5831, longitude: -46.6452 },
  { latitude: -23.5838, longitude: -46.6448 },
  { latitude: -23.5844, longitude: -46.6445 },
  { latitude: -23.585, longitude: -46.6442 }, // chegada
];

export const TICK_MS = 3000; // intervalo do setInterval
export const NEAR_RADIUS_M = 500; // dispara notificação
export const DELIVERED_RADIUS_M = 30;
export const AVG_SPEED_MS = 30 / 3.6; // 30 km/h em m/s
