import { Tenant, User, Incident, Asset, Report, AuditLog, ComplianceFramework, DepartmentRisk, RegulatoryFiling } from './types';

export const tenants: Tenant[] = [
  { id: 't1', name: 'ACME Bank - Ghana', slug: 'acme-bank-gh' },
  { id: 't2', name: 'Acme Bank - Nigeria', slug: 'acme-bank-ng' },
];

export const users: User[] = [
  { id: 'u1', email: 'admin@acme.com', name: 'Bolanle A.', role: 'admin', tenantId: 't1' },
  { id: 'u2', email: 'analyst@acme.com', name: 'Adebayo Analyst', role: 'analyst', tenantId: 't1' },
  { id: 'u3', email: 'admin@cbn.gov.ng', name: 'Charlie Admin', role: 'admin', tenantId: 't2' },
];

const now = new Date();
const subDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};
const subMinutes = (mins: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d.toISOString();
}
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const incidents: Incident[] = [
  { id: 'inc-1', title: 'Data exfiltration confirmed on core banking server.', description: 'Large outbound transfer detected.', status: 'investigating', severity: 'high', category: 'Data', timestamp: subMinutes(14), riskScore: 95, tenantId: 't1' },
  { id: 'inc-2', title: 'Malware confirmed on finance laptop. Containment ready.', description: 'Ransomware signature identified on PRD-WKS-01', status: 'open', severity: 'high', category: 'Endpoint', timestamp: subMinutes(45), riskScore: 88, tenantId: 't1' },
  { id: 'inc-3', title: 'External network scan blocked at the firewall', description: 'Scanning activity from external IP', status: 'resolved', severity: 'low', category: 'Network', timestamp: subDays(1), tenantId: 't1' },
  { id: 'inc-4', title: 'Brute Force Attack on staging', description: 'Multiple failed SSH attempts', status: 'closed', severity: 'medium', category: 'Network', timestamp: subDays(3), tenantId: 't1' },
  { id: 'inc-5', title: 'Suspicious Login detected', description: 'Failed login attempt from unrecognized IP', status: 'investigating', severity: 'medium', category: 'Auth', timestamp: subDays(0), riskScore: 45, tenantId: 't1' },
  { id: 'inc-13', title: 'Data exfiltration confirmed on core banking server.', description: 'Large outbound transfer detected.', status: 'investigating', severity: 'high', category: 'Data', timestamp: subMinutes(10), riskScore: 92, tenantId: 't2' },
  { id: 'inc-14', title: 'Leaked Credentials', description: 'Employee password found on dark web', status: 'investigating', severity: 'high', category: 'Auth', timestamp: subDays(1), tenantId: 't2' },
  { id: 'inc-18', title: 'SAML Response Mismatch', description: 'SSO error during authentication', status: 'open', severity: 'medium', category: 'Auth', timestamp: subDays(5), tenantId: 't2' },
];

export const assets: Asset[] = [
  // ACME Bank - Ghana (t1) - 12 Servers, 24 Endpoints, 5 Databases
  { id: 'ast-s1', name: 'CORE-BANK-DB1', type: 'server', ipAddress: '10.0.0.5', status: 'compromised', riskScore: 92, vulnerabilitiesCount: 3, lastSeen: subMinutes(2), tenantId: 't1', criticality: 'High', sourceTool: 'CrowdStrike Falcon' },
  { id: 'ast-s2', name: 'WEB-FRONT-01', type: 'server', ipAddress: '10.0.0.12', status: 'active', riskScore: 15, vulnerabilitiesCount: 1, lastSeen: subMinutes(1), tenantId: 't1', criticality: 'Medium', sourceTool: 'Qualys' },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `ast-s-gen-${i}`, name: `SRV-NODE-${100 + i}`, type: 'server' as const, ipAddress: `10.0.1.${10 + i}`, status: 'active' as const, riskScore: 10 + i, vulnerabilitiesCount: i % 3, lastSeen: subMinutes(5 + i), tenantId: 't1', criticality: 'Medium' as const, sourceTool: 'Nessus'
  })),

  { id: 'ast-e1', name: 'LPT-FIN-092', type: 'endpoint', ipAddress: '192.168.1.44', status: 'compromised', riskScore: 88, vulnerabilitiesCount: 14, lastSeen: subMinutes(10), tenantId: 't1', criticality: 'Medium', sourceTool: 'CrowdStrike Falcon' },
  ...Array.from({ length: 23 }).map((_, i) => ({
    id: `ast-e-gen-${i}`, name: `WKS-OFFICE-${200 + i}`, type: 'endpoint' as const, ipAddress: `192.168.2.${20 + i}`, status: 'active' as const, riskScore: 5 + i, vulnerabilitiesCount: 0, lastSeen: subMinutes(15 + i), tenantId: 't1', criticality: 'Low' as const, sourceTool: 'SentinelOne'
  })),

  { id: 'ast-d1', name: 'DB-CL-MAIN', type: 'database', ipAddress: '10.0.5.20', status: 'active', riskScore: 25, vulnerabilitiesCount: 3, lastSeen: subMinutes(1), tenantId: 't1', criticality: 'High', sourceTool: 'Guardium' },
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `ast-d-gen-${i}`, name: `DB-TIER-0${i+2}`, type: 'database' as const, ipAddress: `10.0.6.${5 + i}`, status: 'active' as const, riskScore: 10, vulnerabilitiesCount: 0, lastSeen: subMinutes(2 + i), tenantId: 't1', criticality: 'High' as const, sourceTool: 'Guardium'
  })),

  // CBN - Nigeria (t2)
  { id: 'ast-9', name: 'CBN-API-GW1', type: 'server', ipAddress: '172.16.0.4', status: 'active', riskScore: 18, vulnerabilitiesCount: 2, lastSeen: subMinutes(3), tenantId: 't2', criticality: 'High', sourceTool: 'Rapid7' },
  { id: 'ast-10', name: 'CBN-MON-01', type: 'server', ipAddress: '172.16.0.10', status: 'degraded', riskScore: 55, vulnerabilitiesCount: 8, lastSeen: subMinutes(12), tenantId: 't2', criticality: 'Medium', sourceTool: 'Nessus' },
  { id: 'ast-12', name: 'DB-REC-01', type: 'database', ipAddress: '172.16.5.10', status: 'active', riskScore: 12, vulnerabilitiesCount: 0, lastSeen: subMinutes(5), tenantId: 't2', criticality: 'High', sourceTool: 'Guardium' },
];

export const reports: Report[] = [
  { id: 'rep-1', name: 'Monthly Security Summary', date: 'April 2026', type: 'Executive', status: 'ready', tenantId: 't1', summary: 'Risk increased by 4% due to unresolved endpoint incidents.' },
  { id: 'rep-2', name: 'Incident Overview', date: 'April 2026', type: 'Operational', status: 'ready', tenantId: 't1', summary: 'High volume of external network scans mitigated.' },
  { id: 'rep-3', name: 'Compliance Status', date: 'April 2026', type: 'Regulatory', status: 'ready', tenantId: 't1', summary: 'BoG CISD audit checks pending 4 core failures.' },
  { id: 'rep-4', name: 'Financial Risk Exposure', date: 'April 2026', type: 'Executive', status: 'ready', tenantId: 't1', summary: 'Est. exposure currently sits at GH₵ 24M due to database vulnerabilities.' },
  // T2
  { id: 'rep-5', name: 'Monthly Security Summary', date: 'April 2026', type: 'Executive', status: 'ready', tenantId: 't2', summary: 'Risk stable. NDPR gap analysis shows major improvements.' },
  { id: 'rep-6', name: 'Financial Risk Exposure', date: 'April 2026', type: 'Executive', status: 'ready', tenantId: 't2', summary: 'Est. exposure currently sits at ₦1.2B due to core server vulnerabilities.' },
];

export const auditLogs: AuditLog[] = [
  { id: 'al-1', action: 'Failed Login Attempt', category: 'Login', user: 'jdoe@acme.com', timestamp: subMinutes(10), severity: 'medium', details: 'Invalid credentials from IP 192.168.1.5', tenantId: 't1' },
  { id: 'al-2', action: 'API Key Rotated', category: 'Config', user: 'Bolanle A.', timestamp: subMinutes(45), severity: 'high', details: 'Production API keys rotated successfully', tenantId: 't1' },
  { id: 'al-3', action: 'Device Isolated', category: 'Node Isolation', user: 'System (CrowdStrike)', timestamp: subMinutes(120), severity: 'high', details: 'LPT-FIN-092 sandboxed due to ransomware alert', tenantId: 't1' },
  { id: 'al-4', action: 'Incident Status Update', category: 'Incident', user: 'Adebayo Analyst', timestamp: subDays(1), severity: 'low', details: 'inc-3 marked as Closed', tenantId: 't1' },
  { id: 'al-5', action: 'Failed Login Attempt', category: 'Login', user: 'admin@cbn.gov.ng', timestamp: subMinutes(20), severity: 'medium', details: 'Invalid credentials', tenantId: 't2' },
];

export const complianceFrameworks: ComplianceFramework[] = [
  { id: 'cf-1', name: 'BoG CISD 2026', score: 68, controlsPassed: 85, controlsFailed: 40, tenantId: 't1' },
  { id: 'cf-2', name: 'Ghana Data Protection', score: 72, controlsPassed: 65, controlsFailed: 25, tenantId: 't1' },
  { id: 'cf-3', name: 'ISO 27001:2022', score: 95, controlsPassed: 110, controlsFailed: 5, tenantId: 't1' },
  { id: 'cf-4', name: 'PCI DSS v4.0', score: 55, controlsPassed: 140, controlsFailed: 112, tenantId: 't1' },
  // T2
  { id: 'cf-5', name: 'Acme Cyber Framework', score: 61, controlsPassed: 92, controlsFailed: 58, tenantId: 't2' },
  { id: 'cf-6', name: 'NDPR', score: 85, controlsPassed: 120, controlsFailed: 20, tenantId: 't2' },
  { id: 'cf-7', name: 'ISO 27001:2022', score: 98, controlsPassed: 112, controlsFailed: 2, tenantId: 't2' },
];

export const departmentRisks: DepartmentRisk[] = [
  { id: 'dr-1', department: 'Core Banking', exposureScore: 88, criticalAssets: 14, tenantId: 't1' },
  { id: 'dr-2', department: 'HR', exposureScore: 35, criticalAssets: 5, tenantId: 't1' },
  { id: 'dr-3', department: 'Finance', exposureScore: 92, criticalAssets: 21, tenantId: 't1' },
  { id: 'dr-4', department: 'Customer Support', exposureScore: 40, criticalAssets: 8, tenantId: 't1' },
  // T2
  { id: 'dr-5', department: 'Payment Gateways', exposureScore: 78, criticalAssets: 10, tenantId: 't2' },
  { id: 'dr-6', department: 'Gov Portals', exposureScore: 65, criticalAssets: 20, tenantId: 't2' },
];

export const regulatoryFilings: RegulatoryFiling[] = [
  { id: 'rf-1', reportName: 'BoG CISD Major Incident Report', framework: 'BoG CISD 2026', deadline: addDays(1), status: 'Draft', incidentsLinked: ['inc-1'], tenantId: 't1', progress: 40 },
  { id: 'rf-2', reportName: 'Monthly Threat Telemetry', framework: 'Ghana CSA', deadline: addDays(5), status: 'Under review', incidentsLinked: [], tenantId: 't1', progress: 85 },
  { id: 'rf-3', reportName: 'Annual Data Audit', framework: 'Ghana Data Protection', deadline: subDays(15), status: 'Submitted', incidentsLinked: [], tenantId: 't1', progress: 100 },
  // T2
  { id: 'rf-4', reportName: 'NDPR Breach Notification', framework: 'NDPR', deadline: addDays(2), status: 'Draft', incidentsLinked: ['inc-13'], tenantId: 't2', progress: 60 },
];
