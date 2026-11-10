import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

const COLORS = {
  'Em Trânsito': '#F5A524',
  'Próximo': '#FF7A33',
  'Entregue': '#4ADE80',
};

export function DeliveryWidget({ status = 'Em Trânsito', etaMin = 0, distanceText = '--' }) {
  const eta = status === 'Entregue' ? 'Pedido entregue' : `Chega em ~${etaMin} min`;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#14202B',
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
      }}
    >
      <TextWidget text="Pedido #4821" style={{ fontSize: 12, color: '#9FB0BF' }} />
      <TextWidget text={status} style={{ fontSize: 26, fontWeight: 'bold', color: COLORS[status] }} />
      <FlexWidget style={{ flexDirection: 'row', width: 'match_parent', justifyContent: 'space-between' }}>
        <TextWidget text={eta} style={{ fontSize: 14, color: '#FFFFFF' }} />
        <TextWidget text={distanceText} style={{ fontSize: 14, color: '#9FB0BF' }} />
      </FlexWidget>
    </FlexWidget>
  );
}
