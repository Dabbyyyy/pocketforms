// app/index.js
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PocketForms</Text>
      <Text style={styles.subtitle}>
        Create custom forms and capture structured data right from your device.
      </Text>

      <Link href="/forms" asChild>
        <Button title="Open Forms" />
      </Link>

      <View style={{ height: 12 }} />

      <Link href="/about" asChild>
        <Button title="About" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 12,
  },
});
