import { Model } from 'mongoose';
import { TrackDocument } from './schemas/track.schema';
import { UserTrackProgressDocument } from './schemas/user-track-progress.schema';
import { StudyCronogramDocument } from '../admin/schemas/study-cronogram.schema';
import { CertificatesService } from '../certificates/certificates.service';
export declare class TracksService {
    private trackModel;
    private progressModel;
    private cronogramModel;
    private readonly certificatesService;
    constructor(trackModel: Model<TrackDocument>, progressModel: Model<UserTrackProgressDocument>, cronogramModel: Model<StudyCronogramDocument>, certificatesService: CertificatesService);
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    getTrackDetail(trackId: string, userId?: string): Promise<any>;
    getUserTracks(userId: string): Promise<any[]>;
    startTrack(userId: string, trackId: string): Promise<UserTrackProgressDocument>;
    completeLesson(userId: string, trackId: string, lessonId: string, userName?: string): Promise<UserTrackProgressDocument>;
}
