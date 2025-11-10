// import React from 'react';
// import { Modal, View, TouchableOpacity, Text } from 'react-native';

// const DURATIONS = [
//   { label: '1h', value: 3600 },
//   { label: '2h', value: 7200 },
//   { label: '4h', value: 14400 },
//   { label: '12h', value: 43200 },
//   { label: '24h', value: 86400 },
// ];

// export const DurationPopup: React.FC<{
//   visible: boolean;
//   currentMultiplier: number;
//   onClose: () => void;
//   onUpgrade: () => void;
//   onStart: (seconds: number) => void;
// }> = ({ visible, currentMultiplier, onClose, onUpgrade, onStart }) => {
//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'rgba(0,0,0,0.4)',
//           justifyContent: 'center',
//           padding: 20,
//         }}
//       >
//         <View
//           style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}
//         >
//           <Text style={{ fontSize: 18, fontWeight: '700' }}>
//             Select Duration
//           </Text>
//           <Text style={{ marginVertical: 8 }}>
//             Multiplier: {currentMultiplier}×
//           </Text>
//           <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//             {DURATIONS.map(d => (
//               <TouchableOpacity
//                 key={d.label}
//                 onPress={() => onStart(d.value)}
//                 style={{
//                   padding: 12,
//                   borderWidth: 1,
//                   borderColor: '#ddd',
//                   borderRadius: 12,
//                   margin: 4,
//                 }}
//               >
//                 <Text>{d.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginTop: 16,
//             }}
//           >
//             <TouchableOpacity onPress={onUpgrade} style={{ padding: 12 }}>
//               <Text>Upgrade Multiplier</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onClose} style={{ padding: 12 }}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// src/components/DurationPopup.tsx

import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { NeonButton } from '../ui/NeonButton';
import { theme } from '../ui/theme';

const DURATIONS = [
  { h: 1, label: '1 Hour', seconds: 3600 },
  { h: 2, label: '2 Hours', seconds: 7200 },
  { h: 4, label: '4 Hours', seconds: 14400 },
  { h: 12, label: '12 Hours', seconds: 43200 },
  { h: 24, label: '24 Hours', seconds: 86400 },
];

const MULTIPLIER_OPTIONS = [
  { value: 1, label: '1×', requiresAd: false },
  { value: 2, label: '2×', requiresAd: true },
  { value: 3, label: '3×', requiresAd: true },
  { value: 4, label: '4×', requiresAd: true },
  { value: 5, label: '5×', requiresAd: true },
  { value: 6, label: '6×', requiresAd: true },
];

const BASE_RATE = 0.01;

export const DurationPopup: React.FC<{
  visible: boolean;
  currentMultiplier: number;
  onClose: () => void;
  onUpgrade: () => void;
  onStart: (seconds: number) => void;
}> = ({ visible, currentMultiplier, onClose, onUpgrade, onStart }) => {
  const [selected, setSelected] = React.useState<number>(1);

  // reward math
  const seconds = selected * 3600;
  const effectiveRate = BASE_RATE / currentMultiplier;
  const reward = seconds * effectiveRate;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.centerWrap}>
          {/* BLURRED GLASS PANEL */}
          <View style={styles.glass}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ fontSize: 20, color: 'white' }}>✕</Text>
            </TouchableOpacity>

            <BlurView
              style={StyleSheet.absoluteFill}
              blurAmount={24}
              blurType="light"
            />

            {/* Gradient background */}
            <LinearGradient
              colors={['rgba(85,100,255,0.30)', 'rgba(50,12,170,0.30)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
              {/* HEADER ICON */}
              <Text style={styles.bigIcon}>⚙️</Text>
              <Text style={styles.title}>Select Mining Duration</Text>
              <Text style={styles.sub}>
                Choose how long you want to mine and select a multiplier
              </Text>

              {/* DURATION SECTION */}
              <Text style={styles.sectionLabel}>⏱️ Duration</Text>
              <View style={styles.grid}>
                {DURATIONS.map(d => {
                  const active = selected === d.h;
                  return (
                    <TouchableOpacity
                      key={d.h}
                      onPress={() => setSelected(d.h)}
                      style={[
                        styles.optionBtn,
                        active ? styles.optionActive : styles.optionIdle,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionTxt,
                          active && styles.optionTxtActive,
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* MULTIPLIER SECTION */}
              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
                ⚡ Multiplier
              </Text>
              <View style={styles.grid}>
                {MULTIPLIER_OPTIONS.map(m => {
                  const active = m.value === currentMultiplier;
                  const locked = m.value > currentMultiplier;
                  return (
                    <TouchableOpacity
                      disabled={active}
                      key={m.value}
                      onPress={() => locked && onUpgrade()}
                      style={[
                        styles.optionBtn,
                        active
                          ? styles.multActive
                          : locked
                          ? styles.multLocked
                          : styles.multIdle,
                      ]}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          style={[
                            styles.optionTxt,
                            active && styles.optionTxtActive,
                          ]}
                        >
                          {m.label}
                        </Text>
                        {locked && <Text style={styles.adBadge}>📺 Ad</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* REWARD BOX */}
              <View style={styles.rewardBox}>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardLabel}>Estimated Reward:</Text>
                  <Text style={styles.rewardVal}>
                    {reward.toFixed(4)} tokens
                  </Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardLabel}>Effective Rate:</Text>
                  <Text style={styles.rewardSmall}>
                    {effectiveRate.toFixed(6)} tokens/sec
                  </Text>
                </View>
              </View>

              {/* BUTTON ROW */}
              <View style={styles.btnRow}>
                <NeonButton
                  title="Cancel"
                  variant="outline"
                  onPress={onClose}
                  style={{ flex: 1 }}
                />
                <View style={{ width: 12 }} />
                <NeonButton
                  title="Start Mining"
                  onPress={() => onStart(seconds)}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  centerWrap: {
    width: '100%',
    maxWidth: 400,
  },
  glass: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    elevation: 12,
  },
  content: {
    padding: 20,
  },
  bigIcon: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    marginVertical: 6,
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 6,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionIdle: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  optionActive: {
    borderColor: 'transparent',
    backgroundColor: 'rgba(137,99,255,0.85)',
  },
  optionTxt: {
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
  },
  optionTxtActive: {
    color: 'white',
  },

  multIdle: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  multLocked: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  multActive: {
    borderColor: 'transparent',
    backgroundColor: '#FFC245',
  },
  adBadge: {
    fontSize: 10,
    marginTop: 2,
    color: '#FFD54A',
  },

  rewardBox: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 12,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rewardLabel: {
    color: 'rgba(255,255,255,0.75)',
  },
  rewardVal: {
    color: '#FFC245',
    fontWeight: '800',
  },
  rewardSmall: {
    color: 'white',
    fontWeight: '700',
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
  },
});
