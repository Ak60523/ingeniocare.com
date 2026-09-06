export const APP_ROLES = ["owner", "admin", "user"];
export const TENANT_ROLES = ["owner", "admin", "member"];

export function isAppRole(value) {
  return APP_ROLES.includes(value);
}

export function isTenantRole(value) {
  return TENANT_ROLES.includes(value);
}

export function normalizeAppRole(value) {
  return isAppRole(value) ? value : "user";
}

export function appRoleFromTenantRole(role) {
  if (role === "owner") return "owner";
  if (role === "admin") return "admin";
  return "user";
}

export function effectiveAppRole(globalRole, tenantRole) {
  const global = normalizeAppRole(globalRole);
  const fromTenant = tenantRole ? appRoleFromTenantRole(tenantRole) : "user";
  if (global === "owner" || fromTenant === "owner") return "owner";
  if (global === "admin" || fromTenant === "admin") return "admin";
  return "user";
}

export function canManageTenants(role) {
  return role === "owner";
}

export function canManageUsers(role) {
  return role === "owner" || role === "admin";
}

export function canManageContent(role) {
  return role === "owner" || role === "admin";
}

export function canManageBuilds(role) {
  return role === "owner";
}

export function canManageCursorAgents(role) {
  return role === "owner";
}

export function canExploreDataModel(role) {
  return role === "owner";
}

export function canAssignRole(actorRole, targetRole) {
  if (targetRole === "owner") return actorRole === "owner";
  if (targetRole === "admin") return actorRole === "owner" || actorRole === "admin";
  return actorRole === "owner" || actorRole === "admin";
}

export function canManageMember(actorRole, targetRole) {
  if (actorRole === "owner") return true;
  if (actorRole === "admin") return targetRole !== "owner";
  return false;
}

export function roleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return "User";
}
