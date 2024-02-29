
export class CreateUserDto {
    userEmail: string;
    password: string;
    isActive: boolean;
    iv: string;
    salt: string;
    keyDerivationInfo: string;
}
