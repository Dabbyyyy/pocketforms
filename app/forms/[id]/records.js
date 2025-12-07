// app/forms/[id]/records.js
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createRecord,
  deleteRecord,
  fetchFields,
  fetchRecords,
} from '../../../src/api';

export default function RecordsScreen() {
  const { id: formId } = useLocalSearchParams();
  const [fields, setFields] = useState([]);
  const [records, setRecords] = useState([]);
  const [values, setValues] = useState({});
  const [joinOr, setJoinOr] = useState(false); // your filter UI can use this later

  function setVal(name, val) {
    setValues((v) => ({ ...v, [name]: val }));
  }

  async function load() {
    try {
      const f = await fetchFields(formId);
      const r = await fetchRecords(formId);
      setFields(Array.isArray(f) ? f : []);
      setRecords(Array.isArray(r) ? r : []);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }
  useEffect(() => {
    load();
  }, [formId]);

  // ---------- Image ----------
  async function pickImage(fieldName) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],   // <-- SDK 54: MUST be an array
        selectionLimit: 1,
        quality: 0.8,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets?.length) {
        setVal(fieldName, result.assets[0].uri); // store file://... path
      }
    } catch (e) {
      Alert.alert('Image Picker Error', String(e));
    }
  }

  // ---------- Location ----------
  async function useLocation(fieldName) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied for location');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setVal(fieldName, {
      lat: loc.coords.latitude,
      long: loc.coords.longitude,
    });
  }

  // ---------- Save ----------
  async function onSave() {
    try {
      await createRecord({ form_id: Number(formId), values });
      setValues({});
      load();
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  // ---------- UI ----------
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
        Add a record
      </Text>

      {fields.map((f) => (
        <View key={f.id} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 6 }}>{f.name}</Text>

          {f.field_type === 'text' && (
            <TextInput
              value={values[f.name] ?? ''}
              onChangeText={(t) => setVal(f.name, t)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
              }}
            />
          )}

          {f.field_type === 'multiline' && (
            <TextInput
              multiline
              numberOfLines={4}
              value={values[f.name] ?? ''}
              onChangeText={(t) => setVal(f.name, t)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
                textAlignVertical: 'top',
              }}
            />
          )}

          {f.field_type === 'dropdown' && (
            <TextInput
              placeholder="Type one of the allowed values"
              value={values[f.name] ?? ''}
              onChangeText={(t) => setVal(f.name, t)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
              }}
            />
            // If you have options array, swap this for a Picker; keeping text keeps it simple.
          )}

          {f.field_type === 'image' && (
            <View>
              <Button title="Pick Image" onPress={() => pickImage(f.name)} />
              {typeof values[f.name] === 'string' &&
                values[f.name].startsWith('file') && (
                  <Image
                    source={{ uri: values[f.name] }}
                    style={{
                      width: 120,
                      height: 120,
                      marginTop: 8,
                      borderRadius: 8,
                    }}
                  />
                )}
            </View>
          )}

          {f.field_type === 'location' && (
            <View>
              <Button
                title="Use Current Location"
                onPress={() => useLocation(f.name)}
              />
              <Text style={{ color: '#666', marginTop: 6 }}>
                {values[f.name]
                  ? JSON.stringify(values[f.name])
                  : 'No location yet'}
              </Text>
            </View>
          )}
        </View>
      ))}

      <Button title="Save Record" onPress={onSave} />

      <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>
        Records
      </Text>

      <FlatList
        data={records}
        keyExtractor={(i) => String(i.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: '600' }}>#{item.id}</Text>
            {Object.entries(item.values || {}).map(([k, v]) => (
              <View key={k} style={{ marginTop: 6 }}>
                <Text>
                  {k}:{' '}
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </Text>
                {typeof v === 'string' && v.startsWith('file') && (
                  <Image
                    source={{ uri: v }}
                    style={{ width: 100, height: 100, marginTop: 4 }}
                  />
                )}
              </View>
            ))}

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button
                title="COPY"
                onPress={() =>
                  Clipboard.setStringAsync(JSON.stringify(item.values))
                }
              />
              <Button
                title="DELETE"
                color="#b00020"
                onPress={async () => {
                  await deleteRecord(item.id);
                  load();
                }}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}
