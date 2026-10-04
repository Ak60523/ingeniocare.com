import { isPersonalWorkspaceName } from "./tenants.js";

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

assert(isPersonalWorkspaceName("Alex Kumar's workspace"), "named personal");
assert(isPersonalWorkspaceName("Personal workspace"), "generic personal");
assert(!isPersonalWorkspaceName("Bridgepoint Medical Group"), "clinic");
console.log("tenants.selfcheck ok");
