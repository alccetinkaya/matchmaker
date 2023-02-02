export enum UserRoleID {
    ADMIN = 1
}

export const UserRole = [
    { id: UserRoleID.ADMIN, name: "Admin" }
]

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRoleID;
}