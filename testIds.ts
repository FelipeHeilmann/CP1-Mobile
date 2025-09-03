import { generateUUID, generateId } from './utils';

console.log('Testando geração de IDs:');
console.log('generateUUID():', generateUUID());
console.log('generateUUID():', generateUUID());
console.log('generateId():', generateId());
console.log('generateId():', generateId());

// Exporta os testes para usar no console se necessário
export const testIds = () => {
  const uuid1 = generateUUID();
  const uuid2 = generateUUID();
  const id1 = generateId();
  const id2 = generateId();
  
  console.log('UUID 1:', uuid1);
  console.log('UUID 2:', uuid2);
  console.log('ID 1:', id1);
  console.log('ID 2:', id2);
  console.log('UUIDs são diferentes:', uuid1 !== uuid2);
  console.log('IDs são diferentes:', id1 !== id2);
};
