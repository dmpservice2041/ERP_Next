 
export function hasPermission(permissions: string[] | undefined, required: string): boolean {
    if (!permissions || !Array.isArray(permissions)) return false;

    return (
        permissions.includes(required) ||
        permissions.some(p => p.endsWith('.*') && required.startsWith(p.slice(0, -2)))
    );
}
