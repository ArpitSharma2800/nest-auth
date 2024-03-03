import { Role } from "src/auth/Roles/role.enum";

export class CreateUserDto {
    userEmail: string;
    password: string;
    isActive: boolean;
    iv: string;
    salt: string;
    keyDerivationInfo: string;
    Role: Role;
}
