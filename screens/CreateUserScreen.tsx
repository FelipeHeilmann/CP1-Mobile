import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { addUser } from '../services/user-service';
import { useNavigation } from '@react-navigation/native';
import { generateUUID } from '../utils';

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

    setIsLoading(true);
    try {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🆕 Novo Usuário</Text>

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
    backgroundColor: '#fff0f6',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    color: '#ed145b',
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ed145b',
    shadowColor: '#ed145b',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtn: {
    backgroundColor: '#ed145b',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4
  },
  saveBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#f7b6d0',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  saveTextDisabled: {
    color: '#fff0f6',
  },
});
