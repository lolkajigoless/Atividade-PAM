import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { DESTINATION, NEAR_RADIUS_M } from './src/data/mockRoute';
import { useCourierSimulation, STATUS } from './src/hooks/useCourierSimulation';
import { useCompass } from './src/hooks/useCompass';
import { setupNotifications, notifyCourierNear } from './src/services/notifications';
import WidgetPreview from './src/components/WidgetPreview';
import { cardinal, formatDistance } from './src/utils/geo';

const COLOR = {
  ink: '#14202B', paper: '#F2F4F5', route: '#0F766E', muted: '#5B6B79',
  [STATUS.TRANSIT]: '#F5A524', [STATUS.NEAR]: '#E8590C', [STATUS.DELIVERED]: '#2F9E44',
};

export default function App() {
  const mapRef = useRef(null);
  const sim = useCourierSimulation();
  const compass = useCompass();
  const [followCompass, setFollowCompass] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const notified = useRef(false);

  // 1) Permissão de notificações
  useEffect(() => { setupNotifications(); }, []);

  // 2) Alerta único quando a distância (Haversine) fica < 500 m
  useEffect(() => {
    if (sim.index === 0) notified.current = false; // reiniciou a simulação
    if (sim.distance < NEAR_RADIUS_M && !notified.current) {
      notified.current = true;
      notifyCourierNear(sim.distance);
    }
  }, [sim.distance, sim.index]);

  // 3) Mapa "heading-up": gira conforme a bússola (opcional)
  const lastCamHeading = useRef(0);
  useEffect(() => {
    if (!followCompass) return;
    if (Math.abs(compass - lastCamHeading.current) < 5) return;
    lastCamHeading.current = compass;
    mapRef.current?.animateCamera({ heading: compass }, { duration: 250 });
  }, [compass, followCompass]);

  const fitAll = () =>
    mapRef.current?.fitToCoordinates([sim.position, DESTINATION], {
      edgePadding: { top: 220, right: 60, bottom: 320, left: 60 },
      animated: true,
    });

  const toggleCompass = () => {
    if (followCompass) mapRef.current?.animateCamera({ heading: 0 }, { duration: 300 });
    setFollowCompass((v) => !v);
  };

  // Direção do veículo em relação ao topo do celular
  const relative = (sim.heading - compass + 360) % 360;
  const accent = COLOR[sim.status];
  const progress = sim.index / (sim.total - 1);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: -23.573, longitude: -46.65, latitudeDelta: 0.03, longitudeDelta: 0.03,
        }}
        onMapReady={fitAll}
        rotateEnabled
      >
        {/* percurso já feito */}
        <Polyline coordinates={sim.trail} strokeColor="#9FB0BF" strokeWidth={4} />
        {/* linha entregador → destino */}
        <Polyline
          coordinates={[sim.position, DESTINATION]}
          strokeColor={COLOR.route}
          strokeWidth={4}
          lineDashPattern={[10, 8]}
        />

        <Marker coordinate={DESTINATION} title={DESTINATION.title} description={DESTINATION.address}>
          <View style={s.pin}><Text style={s.pinText}>⌂</Text></View>
        </Marker>

        {/* Ícone do veículo: rotation = direção do deslocamento (norte = 0°).
            flat=true faz o ícone acompanhar a rotação do mapa (modo bússola). */}
        <Marker
          coordinate={sim.position}
          rotation={sim.heading}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          title="Entregador"
        >
          <View style={[s.vehicle, { backgroundColor: accent }]}>
            <Text style={s.vehicleArrow}>▲</Text>
          </View>
        </Marker>
      </MapView>

      {/* Cabeçalho */}
      <View style={[s.top, { paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 54) + 8 }]}>
        <View style={s.card}>
          <Text style={s.small}>Pedido #4821</Text>
          <View style={s.row}>
            <Text style={[s.status, { color: accent }]}>{sim.status}</Text>
            <View style={s.compass}>
              <View style={{ transform: [{ rotate: `${relative}deg` }] }}>
                <Text style={s.compassArrow}>▲</Text>
              </View>
              <Text style={s.compassText}>{Math.round(compass)}° {cardinal(compass)}</Text>
            </View>
          </View>
          <Text style={s.small}>{DESTINATION.address}</Text>
        </View>
      </View>

      {showWidget && (
        <View style={s.widgetBox}>
          <WidgetPreview status={sim.status} etaMin={sim.etaMin} distanceText={formatDistance(sim.distance)} />
        </View>
      )}

      {/* Painel inferior */}
      <View style={s.bottom}>
        <View style={s.row}>
          <View>
            <Text style={s.big}>
              {sim.status === STATUS.DELIVERED ? 'Entregue' : `~${sim.etaMin} min`}
            </Text>
            <Text style={s.small}>tempo estimado</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.big}>{formatDistance(sim.distance)}</Text>
            <Text style={s.small}>até o destino</Text>
          </View>
        </View>

        <View style={s.bar}><View style={[s.barFill, { width: `${progress * 100}%`, backgroundColor: accent }]} /></View>

        <View style={s.buttons}>
          <Pressable style={s.btn} onPress={fitAll}><Text style={s.btnText}>Trajeto</Text></Pressable>
          <Pressable style={[s.btn, followCompass && s.btnOn]} onPress={toggleCompass}>
            <Text style={[s.btnText, followCompass && { color: '#fff' }]}>Bússola</Text>
          </Pressable>
          <Pressable style={[s.btn, showWidget && s.btnOn]} onPress={() => setShowWidget((v) => !v)}>
            <Text style={[s.btnText, showWidget && { color: '#fff' }]}>Widget</Text>
          </Pressable>
          <Pressable style={s.btn} onPress={sim.restart}><Text style={s.btnText}>Reiniciar</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.paper },
  top: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 14 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { fontSize: 28, fontWeight: '800', marginVertical: 4 },
  small: { fontSize: 13, color: COLOR.muted },
  big: { fontSize: 24, fontWeight: '700', color: COLOR.ink },
  compass: { alignItems: 'center' },
  compassArrow: { fontSize: 22, color: COLOR.ink },
  compassText: { fontSize: 11, color: COLOR.muted },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32, elevation: 12 },
  bar: { height: 8, borderRadius: 4, backgroundColor: '#E3E8EC', marginTop: 16, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  widgetBox: { position: 'absolute', left: 14, right: 14, bottom: 240, height: 120 },
  buttons: { flexDirection: 'row', gap: 8, marginTop: 18 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: COLOR.ink, alignItems: 'center' },
  btnOn: { backgroundColor: COLOR.ink },
  btnText: { fontSize: 12, fontWeight: '700', color: COLOR.ink },
  vehicle: { width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  vehicleArrow: { color: '#fff', fontSize: 16, marginTop: -1 },
  pin: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLOR.ink, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  pinText: { color: '#fff', fontSize: 18 },
});
