import { Role } from '@/configs/roleConfig';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export const mockUsers: Record<Role, User> = {
  operator: {
    id: 'user-001',
    email: 'operator@company.com',
    name: 'John Operator',
    role: 'operator',
  },
  test_bench_operator: {
    id: 'user-002',
    email: 'testbench@company.com',
    name: 'Sarah Tester',
    role: 'test_bench_operator',
  },
  qa_tech: {
    id: 'user-003',
    email: 'qa@company.com',
    name: 'Mike Quality',
    role: 'qa_tech',
  },
  packaging: {
    id: 'user-004',
    email: 'packaging@company.com',
    name: 'Lisa Packager',
    role: 'packaging',
  },
  supervisor: {
    id: 'user-005',
    email: 'supervisor@company.com',
    name: 'David Supervisor',
    role: 'supervisor',
  },
  admin: {
    id: 'user-006',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
  },
};

// Default user for demo
export const defaultUser = mockUsers.admin;
