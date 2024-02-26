import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(userEmail: string, password: string): Promise<any> {
        const userDetails = await this.userService.findOneByEmail(userEmail);
        if (userDetails?.password !== password) {
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
