import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BowRepository } from '@/src/repositories/bow-repository';

export default function CreateBowScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [power, setPower] = useState('');
  const [drawLength, setDrawLength] = useState('');
  const [arrows, setArrows] = useState('');
  const [string, setString] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // Campos especificos de recurvo
  const [limbs, setLimbs] = useState('');
  const [riser, setRiser] = useState('');
  
  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del arco es obligatorio');
      return;
    }

    try {
      const bowData: any = {
        name: name.trim(),
        type: 'recurvo',
        model: model.trim() || undefined,
        power: power ? parseInt(power, 10) : undefined,
        drawLength: drawLength ? parseFloat(drawLength) : undefined,
        arrows: arrows.trim() || undefined,
        string: string.trim() || undefined,
        isDefault,
        limbs: limbs.trim() || undefined,
        riser: riser.trim() || undefined,
      };
      
      await BowRepository.create(bowData);
      router.back();
    } catch (error) {
      console.error('Error creating bow:', error);
      Alert.alert('Error', 'No se pudo crear el arco');
    }
  }, [name, model, power, drawLength, arrows, string, isDefault, limbs, riser, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Arco</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nombre del arco"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="Modelo del arco"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Potencia (lbs)</Text>
          <TextInput
            style={styles.input}
            value={power}
            onChangeText={setPower}
            placeholder="30"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apertura (pulgadas)</Text>
          <TextInput
            style={styles.input}
            value={drawLength}
            onChangeText={setDrawLength}
            placeholder="28"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Flechas</Text>
          <TextInput
            style={styles.input}
            value={arrows}
            onChangeText={setArrows}
            placeholder="Descripcion de flechas"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Cuerda</Text>
          <TextInput
            style={styles.input}
            value={string}
            onChangeText={setString}
            placeholder="Tipo de cuerda"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Palas (superior/inferior)</Text>
          <TextInput
            style={styles.input}
            value={limbs}
            onChangeText={setLimbs}
            placeholder="Ej: Carbono + Foam"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Empuñadura (riser)</Text>
          <TextInput
            style={styles.input}
            value={riser}
            onChangeText={setRiser}
            placeholder="Ej: Aluminum"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.defaultToggle}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
            {isDefault && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.toggleLabel}>Establecer como arco predeterminado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Arco</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});