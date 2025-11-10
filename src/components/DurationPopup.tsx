import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

const DURATIONS = [
  { label: '1h', value: 3600 },
  { label: '2h', value: 7200 },
  { label: '4h', value: 14400 },
  { label: '12h', value: 43200 },
  { label: '24h', value: 86400 },
];

export const DurationPopup: React.FC<{
  visible: boolean;
  currentMultiplier: number;
  onClose: () => void;
  onUpgrade: () => void;
  onStart: (seconds: number) => void;
}> = ({ visible, currentMultiplier, onClose, onUpgrade, onStart }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View
          style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Select Duration
          </Text>
          <Text style={{ marginVertical: 8 }}>
            Multiplier: {currentMultiplier}×
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {DURATIONS.map(d => (
              <TouchableOpacity
                key={d.label}
                onPress={() => onStart(d.value)}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 12,
                  margin: 4,
                }}
              >
                <Text>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <TouchableOpacity onPress={onUpgrade} style={{ padding: 12 }}>
              <Text>Upgrade Multiplier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ padding: 12 }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
