// Multi-Tenant Isolation Middleware
// Ensures vendor queries are strictly scoped to their own store and prevents cross-tenant data leakage

export const enforceTenantIsolation = (req, res, next) => {
  // If request is from an authenticated vendor, force query / body to their assigned storeId
  if (req.user && req.user.role === 'vendor' && req.user.storeId) {
    req.tenantId = req.user.storeId
    
    // Auto-inject tenantId into query filters and body payloads
    if (req.body) {
      req.body.tenantId = req.user.storeId
      if (req.user.storeName) {
        req.body.tenantName = req.user.storeName
      }
    }
  } else if (req.query.tenantId) {
    // Public customer querying a specific store
    req.tenantId = req.query.tenantId
  } else if (req.params.storeId || req.params.tenantId) {
    req.tenantId = req.params.storeId || req.params.tenantId
  }

  next()
}
