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
  type: 'endpoint' | 'server' | 'network' | 'cloud' | 'database';
  ipAddress: string;
  status: 'active' | 'inactive' | 'compromised' | 'offline' | 'degraded';
  riskScore: number;
  vulnerabilitiesCount: number;
  lastSeen: string;
  tenantId: string;
  criticality: 'High' | 'Medium' | 'Low';
  sourceTool: string;
}

export interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
  tenantId: string;
  summary?: string;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGlobalLoading: boolean;
  viewedPaths: string[];
  registeredUsers: User[];
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'Login' | 'Config' | 'Incident' | 'Node Isolation';
  user: string;
  timestamp: string;
  severity: Severity;
  details: string;
  tenantId: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  score: number;
  controlsPassed: number;
  controlsFailed: number;
  tenantId: string;
}

export interface DepartmentRisk {
  id: string;
  department: string;
  exposureScore: number;
  criticalAssets: number;
  tenantId: string;
}

export interface RegulatoryFiling {
  id: string;
  reportName: string;
  framework: string;
  deadline: string;
  status: 'Draft' | 'Under review' | 'Submitted';
  incidentsLinked: string[];
  tenantId: string;
  progress: number;
}
