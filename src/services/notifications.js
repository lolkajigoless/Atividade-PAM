import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'entrega';
let channelReady = false;

export async function setupNotifications() {
  // O canal é opcional: no Expo Go (Android) a criação pode falhar com NullPointerException.
  // Se falhar, usamos o canal padrão que o Android cria automaticamente.
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Alertas de entrega',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E8590C',
      });
      channelReady = true;
    } catch (e) {
      channelReady = false;
      console.log('Canal de notificação indisponível, usando o padrão:', e?.message);
    }
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.status === 'granted';
  } catch (e) {
    console.log('Erro ao pedir permissão de notificação:', e?.message);
    return false;
  }
}

export async function notifyCourierNear(distanceM) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🛵 Seu pedido está chegando!',
        body: `O entregador está a ${Math.round(distanceM)} m do endereço de entrega.`,
      },
      trigger: Platform.OS === 'android' && channelReady ? { channelId: CHANNEL_ID } : null,
    });
  } catch (e) {
    console.log('Não foi possível disparar a notificação:', e?.message);
  }
}