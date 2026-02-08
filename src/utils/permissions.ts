/**
 * Checks if a user has the required permission.
 * Supports wildcard permissions (e.g., 'users.*' covers 'users.read').
 * 
 * @param permissions - The list of permissions the user possesses.
 * @param required - The specific permission required for the action.
 * @returns true if the user has the permission, false otherwise.
 */
export function hasPermission(permissions: string[] | undefined, required: string): boolean {
    if (!permissions || !Array.isArray(permissions)) return false;

    return (
        permissions.includes(required) ||
        permissions.some(p => p.endsWith('.*') && required.startsWith(p.slice(0, -2)))
    );
}
