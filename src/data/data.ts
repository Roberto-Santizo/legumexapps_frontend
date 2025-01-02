import { Permission, Role, User } from "../types";

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    role: {
      name: 'Admin',
    },
    estado: '1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'janesmith@example.com',
    role: {
      name: 'User',
    },
    estado: '0',
  },
];

const permissions : Permission[] = [
  {
    id: '1',
    name: 'create ot',
  },
  {
    id: '2',
    name: 'create documentocp',
  },
  {
    id: '3',
    name: 'create documentold',
  },
  {
    id: '4',
    name: 'tehuya',
  },
  {
    id: '5',
    name: 'alameda',
  },
];

const roles : Role[] = [
  {
    id: '1',
    name: 'Admin',
  },
  {
    id: '2',
    name: 'User',
  }
]

export { users, permissions, roles };
