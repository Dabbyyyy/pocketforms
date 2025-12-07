import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { createField, fetchFields } from '../../../src/api';
import { FIELD_TYPES } from '../../../src/utils';

export default function FieldsScreen() {
  const { id: formId } = useLocalSearchParams();
  const [fields, setFields] = useState([]);
  const [name, setName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);
  const [isNum, setIsNum] = useState(false);
  const [options, setOptions] = useState('');

  async function load() {
    try {
      const list = await fetchFields(formId);
      setFields(Array.isArray(list) ? list : []);
    } catch (e) {
      Alert.alert('Error', String(e));
      setFields([]);
    }
  }

  useEffect(() => { load(); }, [formId]);

  async function onAdd() {
    if (!name.trim()) return Alert.alert('Missing', 'Field name required.');
    let opts = null;
    if (fieldType === 'dropdown') {
      try { opts = JSON.parse(options || '[]'); if (!Array.isArray(opts)) throw new Error(); }
      catch { return Alert.alert('Error', 'Dropdown options must be a JSON array of strings.'); }
    }
    await createField({
      form_id: Number(formId),
      name,
      field_type: fieldType,
      required,
      is_num: isNum,
      options: opts,
      order_index: fields.length,
    });
    setName(''); setIsNum(false); setRequired(false); setOptions('');
    load();
  }

  return (
    <View style={styles.c}>
      <Text style={styles.h}>Fields for form {formId}</Text>

      <View style={styles.box}>
        <Text style={styles.sub}>Add a field</Text>
        <TextInput placeholder="Field name" style={styles.input} value={name} onChangeText={setName} />
        <Picker selectedValue={fieldType} onValueChange={setFieldType}>
          {FIELD_TYPES.map(t => <Picker.Item key={t} label={t} value={t} />)}
        </Picker>
        {fieldType === 'dropdown' && (
          <TextInput
            placeholder='Dropdown options as JSON, e.g. ["A","B","C"]'
            style={styles.input}
            value={options}
            onChangeText={setOptions}
          />
        )}
        <View style={styles.row}><Text>Required</Text><Switch value={required} onValueChange={setRequired} /></View>
        <View style={styles.row}><Text>Is Number</Text><Switch value={isNum} onValueChange={setIsNum} /></View>
        <Button title="Add Field" onPress={onAdd} />
      </View>

      <Text style={styles.sub}>Existing Fields</Text>
      <FlatList
        data={fields}
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text>{item.field_type}{item.required ? ' · required' : ''}{item.is_num ? ' · numeric' : ''}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, padding: 16, gap: 12 },
  h: { fontSize: 22, fontWeight: '700' },
  sub: { fontWeight: '600', marginBottom: 6 },
  box: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, gap: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 4 },
  item: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8 },
});
