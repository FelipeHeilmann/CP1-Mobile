import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { getUsers, deleteUser, User } from './userStorage';
import { useNavigation, useIsFocused, NavigationProp, useFocusEffect } from '@react-navigation/native';

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
              await loadUsers(); // Recarrega a lista
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateUser')}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lista de usuários</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={loadUsers}
       renderItem={({ item }) => (
        <View style={styles.userCard}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditUser', { user: item })}>
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(item.id, item.nome)}>
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
            <Text style={styles.emptySubText}>Toque em "Novo Usuário" para começar</Text>
          </View>        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e3f2fd', // azul claro
    padding: 24 
  },
  header: { 
    flexDirection: 'row-reverse',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 24, 
    position: 'relative' 
  },
  title: { 
    fontSize: 32, 
    color: '#1976d2', // azul escuro
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  addButton: { 
    position: 'absolute', 
    right: 0, 
    backgroundColor: '#1976d2', // azul escuro
    borderRadius: 20, 
    width: 44, 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
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
    marginBottom: 16, 
    alignItems: 'center', 
    padding: 16,
    borderWidth: 1,
    borderColor: '#1976d233',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    marginRight: 16, 
    borderWidth: 2,
    borderColor: '#1976d2'
  },
  info: { flex: 1 },
  nome: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1976d2' 
  },
  email: { 
    fontSize: 16, 
    color: '#333' 
  },
  actions: { 
    flexDirection: 'row' 
  },
  actionButton: { 
    backgroundColor: '#e3f2fd',
    borderRadius: 16, 
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#1976d233'
  },
  editIcon: { 
    fontSize: 18, 
    color: '#1976d2', 
    fontWeight: 'bold' 
  },
  deleteIcon: { 
    fontSize: 20, 
    color: '#1976d2', 
    fontWeight: 'bold' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 40 
  },
  emptyText: { 
    fontSize: 18, 
    color: '#1976d2', 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  emptySubText: { 
    fontSize: 14, 
    color: '#1976d2', 
    opacity: 0.8 
  },
});
