import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto, UpdatePasswordDto, UpdateNotificationsDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<UserDocument | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<UserDocument>;
    update(id: string, dto: UpdateUserDto): Promise<UserDocument>;
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<void>;
    updateNotifications(id: string, dto: UpdateNotificationsDto): Promise<UserDocument>;
    updateLastLogin(id: string): Promise<void>;
    deleteUser(id: string): Promise<void>;
    activateAccount(userId: string, plan: string, subscriptionEndDate: Date): Promise<UserDocument>;
    deactivateAccount(userId: string, status?: 'inactive' | 'payment_pending' | 'expired'): Promise<UserDocument>;
    getStripeCustomerId(userId: string): Promise<string>;
    setStripeCustomerId(userId: string, customerId: string): Promise<void>;
}
