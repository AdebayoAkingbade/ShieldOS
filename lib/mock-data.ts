import { Tenant, User, Incident, Asset, Report } from './types';

export const tenants: Tenant[] = [
  { id: 't1', name: 'Acme Corp', slug: 'acme' },
  { id: 't2', name: 'Globex IT', slug: 'globex' },
];

export const users: User[] = [
  { id: 'u1', email: 'admin@acme.com', name: 'Bolanle Admin', role: 'admin', tenantId: 't1' },
  { id: 'u2', email: 'analyst@acme.com', name: 'Adebayo Analyst', role: 'analyst', tenantId: 't1' },
  { id: 'u3', email: 'admin@globex.com', name: 'Charlie Admin', role: 'admin', tenantId: 't2' },
];

const now = new Date();
const subDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const incidents: Incident[] = [
  // Tenant 1 (Acme) - 12 incidents
  { id: 'inc-1', title: 'Suspicious Login detected', description: 'Failed login attempt from unrecognized IP', status: 'investigating', severity: 'medium', category: 'Auth', timestamp: subDays(0), riskScore: 45, tenantId: 't1' },
  { id: 'inc-2', title: 'Malware Detected on Endpoint', description: 'Ransomware signature identified on PRD-WKS-01', status: 'open', severity: 'high', category: 'Endpoint', timestamp: subDays(1), riskScore: 88, tenantId: 't1' },
  { id: 'inc-3', title: 'Unusual Data Export', description: 'Large volume of data sent to external cloud storage', status: 'resolved', severity: 'high', category: 'Data', timestamp: subDays(2), tenantId: 't1' },
  { id: 'inc-4', title: 'Brute Force Attack', description: 'Multiple failed SSH attempts on app-server-01', status: 'closed', severity: 'medium', category: 'Network', timestamp: subDays(3), tenantId: 't1' },
  { id: 'inc-5', title: 'Phishing Email Link Clicked', description: 'User clicked on a known malicious URL', status: 'investigating', severity: 'medium', category: 'Email', timestamp: subDays(4), tenantId: 't1' },
  { id: 'inc-6', title: 'Unauthorized API Access', description: 'API key used from unauthorized source', status: 'open', severity: 'high', category: 'Cloud', timestamp: subDays(5), tenantId: 't1' },
  { id: 'inc-7', title: 'Port Scan Detected', description: 'Scanning activity from IP 192.168.1.50', status: 'closed', severity: 'low', category: 'Network', timestamp: subDays(6), tenantId: 't1' },
  { id: 'inc-8', title: 'Privilege Escalation', description: 'Standard user gained sudo access', status: 'investigating', severity: 'high', category: 'Auth', timestamp: subDays(7), tenantId: 't1' },
  { id: 'inc-9', title: 'DNS Tunneling', description: 'Suspicious DNS traffic patterns', status: 'open', severity: 'medium', category: 'Network', timestamp: subDays(8), tenantId: 't1' },
  { id: 'inc-10', title: 'Insecure S3 Bucket', description: 'Bucket permissions set to public', status: 'resolved', severity: 'medium', category: 'Cloud', timestamp: subDays(9), tenantId: 't1' },
  { id: 'inc-11', title: 'Shadow IT Usage', description: 'Unauthorized cloud application detected', status: 'closed', severity: 'low', category: 'App', timestamp: subDays(10), tenantId: 't1' },
  { id: 'inc-12', title: 'SQL Injection Attempt', description: 'Malicious payload in search field', status: 'open', severity: 'high', category: 'App', timestamp: subDays(11), tenantId: 't1' },

  // Tenant 2 (Globex) - 10 incidents
  { id: 'inc-13', title: 'DDoS Attack', description: 'Inbound flood on port 443', status: 'open', severity: 'high', category: 'Network', timestamp: subDays(0), tenantId: 't2' },
  { id: 'inc-14', title: 'Leaked Credentials', description: 'Employee password found on dark web', status: 'investigating', severity: 'high', category: 'Auth', timestamp: subDays(1), tenantId: 't2' },
  { id: 'inc-15', title: 'Rogue Access Point', description: 'Unrecognized Wi-Fi name detected', status: 'resolved', severity: 'medium', category: 'Network', timestamp: subDays(2), tenantId: 't2' },
  { id: 'inc-16', title: 'USB Device Plugged In', description: 'Unauthorized storage device on sensitive workstation', status: 'closed', severity: 'low', category: 'Physical', timestamp: subDays(3), tenantId: 't2' },
  { id: 'inc-17', title: 'Outdated Browser Used', description: 'User accessed portal with vulnerable version', status: 'closed', severity: 'low', category: 'Compliance', timestamp: subDays(4), tenantId: 't2' },
  { id: 'inc-18', title: 'SAML Response Mismatch', description: 'SSO error during authentication', status: 'open', severity: 'medium', category: 'Auth', timestamp: subDays(5), tenantId: 't2' },
  { id: 'inc-19', title: 'Inbound Tor Traffic', description: 'Connection from a Tor exit node', status: 'investigating', severity: 'medium', category: 'Network', timestamp: subDays(6), tenantId: 't2' },
  { id: 'inc-20', title: 'Excessive API Calls', description: 'Rate limit exceeded by internal service', status: 'closed', severity: 'low', category: 'App', timestamp: subDays(7), tenantId: 't2' },
  { id: 'inc-21', title: 'Missing Security Patch', description: 'Zero-day vulnerability reported for server-02', status: 'open', severity: 'high', category: 'Endpoint', timestamp: subDays(8), tenantId: 't2' },
  { id: 'inc-22', title: 'Backup Failure', description: 'Daily backup job failed', status: 'resolved', severity: 'medium', category: 'Internal', timestamp: subDays(9), tenantId: 't2' },
];

export const assets: Asset[] = [
  { id: 'ast-1', name: 'PRD-SRV-01', type: 'server', ipAddress: '10.0.0.5', status: 'active', riskScore: 12, vulnerabilitiesCount: 3, lastSeen: subDays(0), tenantId: 't1' },
  { id: 'ast-2', name: 'PRD-WKS-01', type: 'endpoint', ipAddress: '10.0.0.10', status: 'compromised', riskScore: 92, vulnerabilitiesCount: 14, lastSeen: subDays(1), tenantId: 't1' },
  { id: 'ast-3', name: 'GLB-FW-01', type: 'network', ipAddress: '192.168.50.1', status: 'active', riskScore: 5, vulnerabilitiesCount: 0, lastSeen: subDays(0), tenantId: 't2' },
];

export const reports: Report[] = [
  { id: 'rep-1', name: 'Monthly Threat Landscape', date: 'Mar 2024', type: 'Executive', status: 'ready', tenantId: 't1' },
  { id: 'rep-2', name: 'SOC Operational Efficiency', date: 'Feb 2024', type: 'Operational', status: 'ready', tenantId: 't1' },
  { id: 'rep-3', name: 'Compliance & Audit Trail', date: 'Q1 2024', type: 'Compliance', status: 'generating', tenantId: 't1' },
  { id: 'rep-4', name: 'Network Traffic Analysis', date: 'Jan 2024', type: 'Technical', status: 'ready', tenantId: 't1' },
  { id: 'rep-5', name: 'Executive Summary Q4', date: 'Dec 2023', type: 'Executive', status: 'ready', tenantId: 't2' },
  { id: 'rep-6', name: 'Infrastructure Audit', date: 'Feb 2024', type: 'Compliance', status: 'ready', tenantId: 't2' },
];
