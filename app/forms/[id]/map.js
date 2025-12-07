// app/forms/[id]/map.js
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchFields, fetchRecords } from '../../../src/api';
import { hasLocationField, parseLocation } from '../../../src/utils';

export default function MapScreen() {
  const { id: formId } = useLocalSearchParams();
  const [fields, setFields] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const f = await fetchFields(formId);
        setFields(Array.isArray(f) ? f : []);
        const r = await fetchRecords(formId);
        setRecords(Array.isArray(r) ? r : []);
      } catch (e) {
        Alert.alert('Error', String(e));
      }
    })();
  }, [formId]);

  if (!hasLocationField(fields)) {
    return (
      <View style={styles.center}>
        <Text>No location field on this form.</Text>
      </View>
    );
  }

  const markers = records
    .map(r => ({
      id: r.id,
      loc: parseLocation(
        r.values?.location || r.values?.Location || r.values?.coords,
      ),
      vals: r.values,
    }))
    .filter(x => x.loc);

  const initial = markers[0]?.loc ?? { lat: -27.497, long: 153.013 }; // Brisbane default

  return (
    <View style={styles.center}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initial.lat,
          longitude: initial.long,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {markers.map(m => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.loc.lat, longitude: m.loc.long }}
            title={`#${m.id}`}
            description={JSON.stringify(m.vals)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
