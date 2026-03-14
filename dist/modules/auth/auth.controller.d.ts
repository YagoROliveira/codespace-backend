import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getMe(user: any): Promise<{
        id: any;
        name: any;
        email: any;
        plan: any;
        role: any;
        avatar: any;
        phone: any;
        bio: any;
        github: any;
        linkedin: any;
        streakDays: any;
        totalHours: any;
        notificationPreferences: any;
    }>;
}
