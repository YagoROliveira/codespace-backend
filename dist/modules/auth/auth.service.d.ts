import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
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
    validateUser(userId: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    private generateToken;
}
