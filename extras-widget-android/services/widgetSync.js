import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { DeliveryWidget } from '../widgets/DeliveryWidget';

export const WIDGET_KEY = 'delivery_widget_state';

/** Salva o estado atual e pede ao Android para redesenhar o widget. */
export async function syncWidget(state) {
  if (Platform.OS !== 'android') return;
  try {
    await AsyncStorage.setItem(WIDGET_KEY, JSON.stringify(state));
    await requestWidgetUpdate({
      widgetName: 'DeliveryStatus',
      renderWidget: () => <DeliveryWidget {...state} />,
      widgetNotFound: () => {}, // widget ainda não foi adicionado à tela inicial
    });
  } catch (e) {
    console.warn('Widget indisponível (use um development build):', e?.message);
  }
}
