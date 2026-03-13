import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    findByUser(userId: string): Promise<any[]>;
    findUpcoming(userId: string): Promise<any[]>;
    findPast(userId: string): Promise<any[]>;
    getWeekSessions(userId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(userId: string, dto: CreateSessionDto): Promise<import("./schemas/session.schema").SessionDocument>;
    update(id: string, dto: UpdateSessionDto): Promise<import("./schemas/session.schema").SessionDocument>;
    cancel(id: string): Promise<import("./schemas/session.schema").SessionDocument>;
}
