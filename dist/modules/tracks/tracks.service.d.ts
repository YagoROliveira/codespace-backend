import { Model } from 'mongoose';
import { TrackDocument } from './schemas/track.schema';
import { UserTrackProgressDocument } from './schemas/user-track-progress.schema';
import { CertificatesService } from '../certificates/certificates.service';
export declare class TracksService {
    private trackModel;
    private progressModel;
    private readonly certificatesService;
    constructor(trackModel: Model<TrackDocument>, progressModel: Model<UserTrackProgressDocument>, certificatesService: CertificatesService);
    findAll(): Promise<TrackDocument[]>;
    findById(id: string): Promise<TrackDocument>;
    getTrackDetail(trackId: string, userId?: string): Promise<any>;
    getUserTracks(userId: string): Promise<any[]>;
    startTrack(userId: string, trackId: string): Promise<UserTrackProgressDocument>;
    completeLesson(userId: string, trackId: string, lessonId: string, userName?: string): Promise<UserTrackProgressDocument>;
}
