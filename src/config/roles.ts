 export enum Role {
    admin = "admin",
    user = 'user',
    manager = 'manager'
 }

 export const toRole = (role: string): Role => {
    switch (role) {
      case Role.admin:
        return Role.admin;
      case Role.user:
        return Role.user;
      case Role.manager:
        return Role.manager;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
 }
 export enum Permission {
    READ_ORDER = 'read:order',
    WRITE_ORDER = 'write:order',
    UPDATE_ORDER = 'update:order',
    DELETE_ORDER = 'delete:order',
    READ_USER = 'read:user',
    WRITE_USER = 'write:user',
    UPDATE_USER = 'update:user',
    DELETE_USER = 'delete:user',
    AUTH_LOGIN = 'auth:login',
    AUTH_LOGOUT = 'auth:logout'
 }
type RolePermission =  {
    [key in Role]: Permission[];
 }
 export const rolePermissions: RolePermission = {
     [Role.admin]: [
        ...Object.values(Permission),
     ],
     [Role.user]: [
         Permission.WRITE_ORDER,
         Permission.READ_USER,
         Permission.UPDATE_USER,
         Permission.DELETE_USER,
     ],
     [Role.manager]: [
         Permission.READ_ORDER,
         Permission.WRITE_ORDER,
         Permission.UPDATE_ORDER,
         Permission.DELETE_ORDER,
         Permission.READ_USER
     ]
 }
