import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    findByUser(userId: string): Promise<import("./schemas/session.schema").SessionDocument[]>;
    findUpcoming(userId: string): Promise<import("./schemas/session.schema").SessionDocument[]>;
    findPast(userId: string): Promise<import("./schemas/session.schema").SessionDocument[]>;
    getWeekSessions(userId: string): Promise<import("./schemas/session.schema").SessionDocument[]>;
    findById(id: string): Promise<import("./schemas/session.schema").SessionDocument>;
    create(userId: string, dto: CreateSessionDto): Promise<import("./schemas/session.schema").SessionDocument>;
    update(id: string, dto: UpdateSessionDto): Promise<import("./schemas/session.schema").SessionDocument>;
    cancel(id: string): Promise<import("./schemas/session.schema").SessionDocument>;
}
