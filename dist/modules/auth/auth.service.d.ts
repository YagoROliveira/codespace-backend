import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            plan: string;
            role: string;
            avatar: string;
            accountStatus: string;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            plan: string;
            role: string;
            avatar: string;
            accountStatus: string;
        };
        token: string;
    }>;
    validateUser(userId: string): Promise<any>;
    googleLogin(accessToken: string): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            plan: string;
            role: string;
            avatar: string;
            accountStatus: string;
        };
        token: string;
    }>;
    private generateToken;
}
