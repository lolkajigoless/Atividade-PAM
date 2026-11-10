import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const COLORS = { 'Em Trânsito': '#F5A524', 'Próximo': '#FF7A33', 'Entregue': '#4ADE80' };

/** Prévia do widget da tela inicial (o widget real exige development build). */
export default function WidgetPreview({ status, etaMin, distanceText }) {
  const eta = status === 'Entregue' ? 'Pedido entregue' : `Chega em ~${etaMin} min`;
  return (
    <View style={s.box}>
      <Text style={s.order}>Pedido #4821</Text>
      <Text style={[s.status, { color: COLORS[status] }]}>{status}</Text>
      <View style={s.row}>
        <Text style={s.eta}>{eta}</Text>
        <Text style={s.dist}>{distanceText}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#14202B', borderRadius: 20, padding: 16, justifyContent: 'space-between', elevation: 8 },
  order: { fontSize: 12, color: '#9FB0BF' },
  status: { fontSize: 26, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  eta: { fontSize: 14, color: '#fff' },
  dist: { fontSize: 14, color: '#9FB0BF' },
});
