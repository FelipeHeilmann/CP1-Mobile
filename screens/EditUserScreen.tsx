import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { updateUser, User } from '../services/user-service';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditUserScreen() {
  const route = useRoute();
  const { user } = route.params as { user: User };

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const isFormValid = nome.trim() && email.trim() && avatar.trim();
  const hasChanges =
    nome.trim() !== user.nome ||
    email.trim() !== user.email ||
    avatar.trim() !== user.avatar;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    if (!validateEmail(email.trim())) {
      return Alert.alert('Erro', 'Por favor, insira um email válido.');
    }

    if (!validateUrl(avatar.trim())) {
      return Alert.alert('Erro', 'Por favor, insira uma URL válida para o avatar.');
    }

    if (!hasChanges) {
      return navigation.goBack(); // apenas volta sem alerta
    }

    setIsLoading(true);
    try {
      await updateUser({
        id: user.id,
        nome: nome.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
      });

      Keyboard.dismiss();
      Alert.alert('✅ Sucesso', 'Usuário atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao atualizar usuário. Tente novamente.';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar Usuário</Text>

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
        activeOpacity={0.7}
      >
        <Text style={styles.saveText}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f6', // tom claro do rosa principal
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#ed145b', // cor principal
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ed145b', // cor principal
    shadowColor: '#ed145b',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtn: {
    backgroundColor: '#ed145b', // cor principal
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#f7b6d0', // tom claro do rosa principal
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});