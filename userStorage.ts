import AsyncStorage from '@react-native-async-storage/async-storage';
export type User = {
  id: string;
  nome: string;
  email: string;
  avatar: string;
};
export const getUsers = async (): Promise<User[]> => {
  try {
    const json = await AsyncStorage.getItem('users');
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};
export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    throw new Error('Falha ao salvar dados');
  }
};
export const addUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    
    // Verifica se já existe um usuário com o mesmo email
    const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingUser) {
      throw new Error('Já existe um usuário com este email');
    }
    
    users.push(user);
    await saveUsers(users);
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
};
export const updateUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    
    if (idx === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verifica se o email já está sendo usado por outro usuário
    const existingUser = users.find(u => u.id !== user.id && u.email.toLowerCase() === user.email.toLowerCase());
    if (existingUser) {
      throw new Error('Já existe outro usuário com este email');
    }
    
    users[idx] = user;
    await saveUsers(users);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const users = await getUsers();
    const filtered = users.filter(u => u.id !== id);
    
    if (filtered.length === users.length) {
      throw new Error('Usuário não encontrado');
    }
    
    await saveUsers(filtered);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};
