import { Model } from 'mongoose';
import { SessionDocument } from './schemas/session.schema';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsService {
    private sessionModel;
    constructor(sessionModel: Model<SessionDocument>);
    findByUser(userId: string): Promise<SessionDocument[]>;
    findUpcoming(userId: string): Promise<SessionDocument[]>;
    findPast(userId: string): Promise<SessionDocument[]>;
    findById(id: string): Promise<SessionDocument>;
    create(userId: string, dto: CreateSessionDto): Promise<SessionDocument>;
    update(id: string, dto: UpdateSessionDto): Promise<SessionDocument>;
    cancel(id: string): Promise<SessionDocument>;
    getWeekSessions(userId: string): Promise<SessionDocument[]>;
}
