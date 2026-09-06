import crypto from "crypto";
import { isTenantRole } from "./roles.js";

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function newInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function mapMembership(row) {
  return {
    membershipId: row.membershipid ?? row.membershipId,
    tenantId: row.tenantid ?? row.tenantId,
    tenantName: row.tenantname ?? row.tenantName,
    role: isTenantRole(row.role) ? row.role : "member",
  };
}

function aliases(row) {
  return new Proxy(row, {
    get(target, prop) {
      if (typeof prop !== "string") return target[prop];
      if (prop in target) return target[prop];
      const lower = prop.toLowerCase();
      if (lower in target) return target[lower];
      return undefined;
    },
  });
}

export async function listMemberships(pool, userId) {
  const { rows } = await pool.query(
    `SELECT m.id AS "membershipId", m.tenant_id AS "tenantId", t.name AS "tenantName", m.role
     FROM tenant_memberships m
     INNER JOIN tenants t ON t.id = m.tenant_id
     WHERE m.user_id = ? AND COALESCE(m.status, 'active') <> 'inactive'
     ORDER BY t.name ASC`,
    [userId]
  );
  return rows.map((row) => mapMembership(aliases(row)));
}

export async function listAllTenants(pool) {
  const { rows } = await pool.query(
    `SELECT id, name, slug, brand_name AS "brandName", support_email AS "supportEmail",
            support_phone AS "supportPhone", created_at AS "createdAt"
     FROM tenants
     ORDER BY name ASC`
  );
  return rows;
}

export async function getTenant(pool, tenantId) {
  const { rows } = await pool.query(
    `SELECT id, name, slug, brand_name AS "brandName", support_email AS "supportEmail",
            support_phone AS "supportPhone", created_at AS "createdAt"
     FROM tenants WHERE id = ? LIMIT 1`,
    [tenantId]
  );
  return rows[0] || null;
}

export async function createTenant(pool, { name, ownerUserId }) {
  const trimmed = String(name || "").trim().slice(0, 255);
  if (!trimmed) {
    const error = new Error("Workspace name is required");
    error.status = 400;
    throw error;
  }
  let slug = slugify(trimmed) || `workspace-${Date.now().toString(36)}`;
  const { rows: clash } = await pool.query("SELECT id FROM tenants WHERE slug = ? LIMIT 1", [slug]);
  if (clash[0]) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const { insertId: tenantId } = await pool.query(
    "INSERT INTO tenants (name, slug, brand_name) VALUES (?, ?, ?) RETURNING id",
    [trimmed, slug, trimmed]
  );
  await pool.query(
    "INSERT INTO tenant_memberships (tenant_id, user_id, role, status) VALUES (?, ?, 'owner', 'active')",
    [tenantId, ownerUserId]
  );
  return getTenant(pool, tenantId);
}

export async function ensurePersonalWorkspace(pool, user) {
  let memberships = await listMemberships(pool, user.id);
  if (memberships.length) return memberships;
  const label = user.name?.trim() ? `${user.name.trim()}'s workspace` : "Personal workspace";
  await createTenant(pool, { name: label, ownerUserId: user.id });
  memberships = await listMemberships(pool, user.id);
  return memberships;
}

export async function getMembershipForUser(pool, tenantId, userId) {
  const { rows } = await pool.query(
    `SELECT id AS "membershipId", role, status
     FROM tenant_memberships
     WHERE tenant_id = ? AND user_id = ? LIMIT 1`,
    [tenantId, userId]
  );
  const row = rows[0];
  if (!row || (row.status || "active") === "inactive") return null;
  return {
    membershipId: row.membershipId,
    role: isTenantRole(row.role) ? row.role : "member",
    status: row.status || "active",
  };
}

export async function listTenantMembers(pool, tenantId) {
  const { rows } = await pool.query(
    `SELECT m.id AS "membershipId", u.id AS "userId", u.email, u.name, u.phone,
            m.role, m.status, m.created_at AS "createdAt"
     FROM tenant_memberships m
     INNER JOIN users u ON u.id = m.user_id
     WHERE m.tenant_id = ?
     ORDER BY m.created_at DESC`,
    [tenantId]
  );
  return rows;
}

export async function countActiveOwners(pool, tenantId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS n FROM tenant_memberships
     WHERE tenant_id = ? AND role = 'owner' AND COALESCE(status, 'active') <> 'inactive'`,
    [tenantId]
  );
  return Number(rows[0]?.n || 0);
}

export async function listPendingInvites(pool, tenantId) {
  const { rows } = await pool.query(
    `SELECT id, email, name, phone, role, token, expires_at AS "expiresAt", created_at AS "createdAt"
     FROM tenant_invites
     WHERE tenant_id = ? AND accepted_at IS NULL
     ORDER BY created_at DESC`,
    [tenantId]
  );
  return rows;
}

export async function createTenantInvite(pool, input) {
  const token = newInviteToken();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const { insertId } = await pool.query(
    `INSERT INTO tenant_invites
      (tenant_id, email, name, phone, role, token, invited_by_user_id, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`,
    [
      input.tenantId,
      input.email,
      input.name,
      input.phone,
      input.role,
      token,
      input.invitedByUserId,
      expiresAt,
    ]
  );
  return {
    id: insertId,
    email: input.email,
    name: input.name,
    phone: input.phone,
    role: input.role,
    token,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function getInviteByToken(pool, token) {
  const { rows } = await pool.query(
    `SELECT i.id, i.email, i.name, i.phone, i.role, i.expires_at,
            i.accepted_at, i.tenant_id, t.name AS tenant_name
     FROM tenant_invites i
     INNER JOIN tenants t ON t.id = i.tenant_id
     WHERE i.token = ? LIMIT 1`,
    [token]
  );
  return rows[0] || null;
}

export function inviteFrontendUrl(token) {
  const frontend = String(process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "")
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");
  return frontend ? `${frontend}/invite/${token}` : `/invite/${token}`;
}
