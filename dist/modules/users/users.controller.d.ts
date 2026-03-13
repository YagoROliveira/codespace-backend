import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateNotificationsDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(userId: string): Promise<any>;
    updateMe(userId: string, dto: UpdateUserDto): Promise<import("./schemas/user.schema").UserDocument>;
    updatePassword(userId: string, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updateNotifications(userId: string, dto: UpdateNotificationsDto): Promise<import("./schemas/user.schema").UserDocument>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    findById(id: string): Promise<any>;
}
