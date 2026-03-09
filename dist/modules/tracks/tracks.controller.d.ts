import { TracksService } from './tracks.service';
export declare class TracksController {
    private readonly tracksService;
    constructor(tracksService: TracksService);
    findAll(): Promise<import("./schemas/track.schema").TrackDocument[]>;
    getUserTracks(userId: string): Promise<any[]>;
    getTrackDetail(id: string, userId: string): Promise<any>;
    findById(id: string): Promise<import("./schemas/track.schema").TrackDocument>;
    startTrack(userId: string, trackId: string): Promise<import("./schemas/user-track-progress.schema").UserTrackProgressDocument>;
    completeLesson(user: any, trackId: string, lessonId: string): Promise<import("./schemas/user-track-progress.schema").UserTrackProgressDocument>;
}
