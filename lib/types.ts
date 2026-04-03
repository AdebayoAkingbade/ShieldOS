export type Role = 'admin' | 'analyst' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
}

export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type Severity = 'high' | 'medium' | 'low';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: Severity;
  category: string;
  timestamp: string;
  lastAlert?: string;
  riskScore?: number;
  tenantId: string;
  assignedTo?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'endpoint' | 'server' | 'network' | 'cloud';
  ipAddress: string;
  status: 'active' | 'inactive' | 'compromised';
  riskScore: number;
  vulnerabilitiesCount: number;
  lastSeen: string;
  tenantId: string;
}

export interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
  tenantId: string;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: User[];
}
