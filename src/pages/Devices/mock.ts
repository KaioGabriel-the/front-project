// src/pages/Devices/mock.ts

// Primeiro, definimos a "forma" de um dispositivo usando uma interface do TypeScript.
// Isso garante que todos os nossos objetos de dispositivo tenham a mesma estrutura.
export interface Device {
  id: number;
  name: string;
  status: 'ON' | 'OFF'; // O status só pode ser 'ON' ou 'OFF'
  roomName: string; // Adicionando o nome do cômodo para contexto
}

// Agora, criamos nossa lista de dispositivos falsos
export const mockDevices: Device[] = [
  { id: 1, name: 'Luz 1', status: 'ON', roomName: 'Quarto' },
  { id: 2, name: 'Siri', status: 'OFF', roomName: 'Quarto' },
  { id: 3, name: 'Interruptor 4', status: 'ON', roomName: 'Quarto' },
  { id: 4, name: 'Luz 2', status: 'OFF', roomName: 'Quarto' },
  { id: 5, name: 'PC', status: 'ON', roomName: 'Quarto' },
  { id: 6, name: 'Interruptor 6', status: 'OFF', roomName: 'Quarto' },
  { id: 7, name: 'Ar condicionado', status: 'ON', roomName: 'Quarto' },
  { id: 8, name: 'Cortina', status: 'OFF', roomName: 'Quarto' },
  { id: 9, name: 'Televisão', status: 'ON', roomName: 'Quarto' },
  { id: 10, name: 'Ventilador', status: 'OFF', roomName: 'Quarto' },
  { id: 11, name: 'Persiana', status: 'ON', roomName: 'Quarto' },
  { id: 12, name: 'Alexa', status: 'ON', roomName: 'Quarto' },
];