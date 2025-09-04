import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { getUsers, deleteUser, User } from '../services/user-service';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  EditUser: { user: User };
  CreateUser: undefined;
};

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersList = await getUsers();
      setUsers(usersList);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar usuários.');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const handleDeleteUser = useCallback(async (id: string, nome: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o usuário "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(id);
              await loadUsers();
              Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário.';
              Alert.alert('Erro', errorMessage);
              console.error('Erro ao excluir usuário:', error);
            }
          }
        }
      ]
    );
  }, [loadUsers]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>👥 Usuários</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateUser')}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={loadUsers}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image 
              source={{ uri: item.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => navigation.navigate('EditUser', { user: item })}>
                <Text style={styles.actionIcon}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteUser(item.id, item.nome)}>
                <Text style={styles.actionIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
            <Text style={styles.emptySubText}>Toque em "＋" para adicionar</Text>
          </View>        
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff0f6', // tom claro do rosa principal
    padding: 20 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20
  },
  title: { 
    fontSize: 26, 
    color: '#ed145b', // cor principal
    fontWeight: 'bold'
  },
  addButton: { 
    backgroundColor: '#ed145b', // cor principal
    borderRadius: 50, 
    width: 48, 
    height: 48, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 4
  },
  addIcon: { 
    fontSize: 28, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  userCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 14, 
    alignItems: 'center', 
    padding: 16,
    shadowColor: '#ed145b',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 14, 
    borderWidth: 2,
    borderColor: '#ed145b' // cor principal
  },
  info: { flex: 1 },
  nome: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#ed145b' // cor principal
  },
  email: { 
    fontSize: 14, 
    color: '#b71c47', // tom escuro do rosa principal
    marginTop: 2
  },
  actions: { 
    flexDirection: 'row' 
  },
  actionButton: { 
    borderRadius: 10, 
    width: 38, 
    height: 38, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 8
  },
  editButton: {
    backgroundColor: '#f7b6d0' // tom claro do rosa principal
  },
  deleteButton: {
    backgroundColor: '#ffe2ec' // tom ainda mais claro do rosa principal
  },
  actionIcon: {
    fontSize: 18,
    color: '#ed145b' // cor principal
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 60 
  },
  emptyText: { 
    fontSize: 18, 
    color: '#ed145b', // cor principal
    fontWeight: '600',
    marginBottom: 6
  },
  emptySubText: { 
    fontSize: 14, 
    color: '#b71c47' // tom escuro do rosa principal
  },
});