import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { updateUser, User } from './userStorage';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditUserScreen() {
  const route = useRoute();
  const { user } = route.params as { user: User };
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const isFormValid = nome.trim() !== '' && email.trim() !== '' && avatar.trim() !== '';
  const hasChanges = nome.trim() !== user.nome || email.trim() !== user.email || avatar.trim() !== user.avatar;

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

    if (!hasChanges) {
      Alert.alert('Informação', 'Nenhuma alteração foi feita.');
      return;
    }

    setIsLoading(true);    try {
      await updateUser({ 
        id: user.id, 
        nome: nome.trim(), 
        email: email.trim(), 
        avatar: avatar.trim() 
      });
      Keyboard.dismiss();
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário. Tente novamente.';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>
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
