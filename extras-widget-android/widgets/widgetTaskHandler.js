import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryWidget } from './DeliveryWidget';

const WIDGET_KEY = 'delivery_widget_state'; // mesma chave de widgetSync.js

// Executado pelo Android (mesmo com o app fechado) para desenhar o widget.
export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      let state = {};
      try {
        const raw = await AsyncStorage.getItem(WIDGET_KEY);
        if (raw) state = JSON.parse(raw);
      } catch {}
      props.renderWidget(<DeliveryWidget {...state} />);
      break;
    }
    default:
      break;
  }
}
