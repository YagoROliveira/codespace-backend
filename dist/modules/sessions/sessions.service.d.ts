import { Model } from 'mongoose';
import { SessionDocument } from './schemas/session.schema';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsService {
    private sessionModel;
    constructor(sessionModel: Model<SessionDocument>);
    findByUser(userId: string): Promise<any[]>;
    findUpcoming(userId: string): Promise<any[]>;
    findPast(userId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(userId: string, dto: CreateSessionDto): Promise<SessionDocument>;
    update(id: string, dto: UpdateSessionDto): Promise<SessionDocument>;
    cancel(id: string): Promise<SessionDocument>;
    getWeekSessions(userId: string): Promise<any[]>;
}
