// app/about.js
import { StyleSheet, Text, View } from 'react-native';

export default function About() {
  return (
    <View style={styles.c}>
      <Text style={styles.h}>About PocketForms</Text>
      <Text>
        PocketForms is a mobile form builder and data collection tool.
        You can create custom forms, add different field types (text,
        numbers, dropdowns, images, GPS location), capture records with
        validation, and visualise location-based entries on a map.
        Built with Expo Router and a REST API backend.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, padding: 16, gap: 12 },
  h: { fontSize: 22, fontWeight: '700' },
});
