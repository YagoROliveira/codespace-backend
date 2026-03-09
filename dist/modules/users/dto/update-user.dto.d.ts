export declare class UpdateUserDto {
    name?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    plan?: string;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UpdateNotificationsDto {
    email?: boolean;
    push?: boolean;
    mentorReminders?: boolean;
    communityUpdates?: boolean;
    weeklyReport?: boolean;
}
