import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { addUser } from './userStorage';
import { useNavigation } from '@react-navigation/native';
import { generateUUID } from './utils';
export default function CreateUserScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const isFormValid = nome.trim() !== '' && email.trim() !== '' && avatar.trim() !== '';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    if (!validateUrl(avatar.trim())) {
      Alert.alert('Erro', 'Por favor, insira uma URL válida para o avatar.');
      return;
    }

    setIsLoading(true);    try {
      await addUser({ 
        id: generateUUID(), 
        nome: nome.trim(), 
        email: email.trim(), 
        avatar: avatar.trim() 
      });
      Keyboard.dismiss();
      Alert.alert('Sucesso', 'Usuário criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar usuário. Tente novamente.';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Usuário</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nome" 
        value={nome} 
        onChangeText={setNome} 
        autoCapitalize="words"
        editable={!isLoading}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput 
        style={styles.input} 
        placeholder="URL do Avatar" 
        value={avatar} 
        onChangeText={setAvatar} 
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.saveBtn, (!isFormValid || isLoading) && styles.saveBtnDisabled]} 
        disabled={!isFormValid || isLoading} 
        onPress={handleSave} 
        activeOpacity={isFormValid && !isLoading ? 0.7 : 1}
      >
        <Text style={[styles.saveText, (!isFormValid || isLoading) && styles.saveTextDisabled]}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e3f2fd', // azul claro
    padding: 24, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 32, 
    color: '#1976d2', // azul escuro
    fontWeight: 'bold', 
    marginBottom: 32, 
    alignSelf: 'center',
    letterSpacing: 1,
  },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 18, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1976d233', // azul escuro com transparência
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtn: { 
    backgroundColor: '#1976d2', // azul escuro
    borderRadius: 24, 
    paddingVertical: 18, 
    paddingHorizontal: 32,
    alignItems: 'center', 
    marginTop: 16,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnDisabled: { 
    opacity: 0.5,
    backgroundColor: '#1976d299',
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 20,
    letterSpacing: 0.5,
  },
  saveTextDisabled: { 
    color: '#fff', 
    opacity: 0.7,
  },
});
