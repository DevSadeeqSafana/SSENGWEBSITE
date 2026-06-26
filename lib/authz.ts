export function canAccessAdmin(role?: string | null): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR';
}

export function canManageContent(role?: string | null): boolean {
  return canAccessAdmin(role);
}

export function canManageRecords(role?: string | null): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function canManageAdmins(role?: string | null): boolean {
  return role === 'SUPER_ADMIN';
}
