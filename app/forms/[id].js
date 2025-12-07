// app/forms/[id].js
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function FormHome() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.c}>
      <Text style={styles.h}>Form {id}</Text>
      <Text style={{ marginBottom: 12 }}>Choose a section:</Text>
      <Link href={`/forms/${id}/fields`} style={styles.link}>➤ Fields</Link>
      <Link href={`/forms/${id}/records`} style={styles.link}>➤ Records</Link>
      <Link href={`/forms/${id}/map`} style={styles.link}>➤ Map</Link>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, padding: 16 },
  h: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  link: { fontSize: 18, paddingVertical: 8 },
});
