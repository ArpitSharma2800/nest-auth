import { Injectable, CanActivate, ExecutionContext, Req } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        //reflectior :  get the details about the metadata
        const roles = this.reflector.getAllAndOverride<Role[]>('roles',
            //get metadata for specific context
            [context.getHandler(), context.getClass()]);
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = {
            name: request.user.username,
            role: request.user.Role
        };
        return roles.some(role => user.role.includes(role));
    }
}