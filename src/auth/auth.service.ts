import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptConstants } from 'src/users/constants/constant';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import { createDecipheriv, scrypt } from 'crypto';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(userEmail: string, password: string): Promise<any> {
        if (!userEmail || !password) {
            throw new UnauthorizedException();
        }
        const userDetails = await this.userService.findOneByEmail(userEmail);
        if (!userDetails) {
            throw new NotFoundException();
        }
        const combinedPassword = password + encryptConstants.secret;
        const storedIv = Buffer.from(userDetails.iv, 'base64');
        const storedEncryptedPassword = Buffer.from(userDetails.password, 'base64');
        const storedKeyDerivationInfo = {
            salt: userDetails.salt
        };
        const key = (await promisify(scrypt)(combinedPassword, storedKeyDerivationInfo.salt, 32)) as Buffer;
        const decipher = createDecipheriv('aes-256-ctr', key, storedIv);
        const decryptedPassword = Buffer.concat([
            decipher.update(storedEncryptedPassword),
            decipher.final(),
        ]).toString('utf-8');
        if (decryptedPassword !== password) {
            throw new UnauthorizedException();
        }
        const payload = {
            sub: userDetails.userID,
            username: userDetails.userID,
            isActive: userDetails.isActive
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
