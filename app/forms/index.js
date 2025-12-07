// app/forms/index.js
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createForm, deleteForm, fetchForms } from '../../src/api';

export default function FormsScreen() {
  const [forms, setForms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function load() {
    try {
      const data = await fetchForms();
      setForms(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd() {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Missing', 'Name and description are required.');
      return;
    }
    try {
      await createForm({ name, description });
      setName('');
      setDescription('');
      load();
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  async function onDelete(id) {
    Alert.alert(
      'Delete form?',
      'This will remove the form entry (fields/records behaviour depends on API implementation).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteForm(id);
              load();
            } catch (e) {
              Alert.alert('Error', String(e));
            }
          },
        },
      ],
    );
  }

  // Rename behaviour is omitted in the mobile build to avoid platform prompt issues.
  function onRenameDisabled() {
    Alert.alert('Not implemented', 'Renaming is not available in this build yet.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h}>Forms</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Form name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Add" onPress={onAdd} />
      </View>

      <FlatList
        data={forms}
        keyExtractor={item => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onLongPress={onRenameDisabled}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.description}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Link href={`/forms/${item.id}`} asChild>
                <Button title="Open" />
              </Link>
              <Button
                title="Delete"
                color="#b00020"
                onPress={() => onDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  h: { fontSize: 22, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: '600' },
});
  