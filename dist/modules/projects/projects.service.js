"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    constructor(projectModel, userProjectModel) {
        this.projectModel = projectModel;
        this.userProjectModel = userProjectModel;
    }
    async findAll(difficulty) {
        const query = { isActive: true };
        if (difficulty)
            query.difficulty = difficulty;
        return this.projectModel.find(query).sort({ isFeatured: -1, createdAt: -1 }).lean();
    }
    async findById(id) {
        const p = await this.projectModel.findById(id).lean();
        if (!p)
            throw new common_1.NotFoundException('Projeto não encontrado');
        return p;
    }
    async startProject(userId, projectId) {
        const existing = await this.userProjectModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId), projectId: new mongoose_2.Types.ObjectId(projectId) }).lean();
        if (existing)
            throw new common_1.ConflictException('Você já está participando deste projeto');
        await this.projectModel.findByIdAndUpdate(projectId, { $inc: { participants: 1 } });
        return this.userProjectModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            projectId: new mongoose_2.Types.ObjectId(projectId),
            status: 'in_progress',
            startedAt: new Date(),
        });
    }
    async submitProject(userId, projectId, repoUrl, deployUrl) {
        const up = await this.userProjectModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId), projectId: new mongoose_2.Types.ObjectId(projectId) });
        if (!up)
            throw new common_1.NotFoundException('Progresso não encontrado');
        up.status = 'submitted';
        up.repoUrl = repoUrl;
        up.deployUrl = deployUrl || '';
        up.submittedAt = new Date();
        return up.save();
    }
    async getMyProjects(userId) {
        const ups = await this.userProjectModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ startedAt: -1 }).lean();
        const projectIds = ups.map(u => u.projectId);
        const projects = await this.projectModel.find({ _id: { $in: projectIds } }).lean();
        const pMap = new Map(projects.map(p => [p._id.toString(), p]));
        return ups.map(u => ({ ...u, project: pMap.get(u.projectId.toString()) }));
    }
    async getUserStats(userId) {
        const stats = await this.userProjectModel.aggregate([
            { $match: { userId: new mongoose_2.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    submitted: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
                },
            },
        ]);
        const s = stats[0] || { total: 0, inProgress: 0, completed: 0, submitted: 0 };
        return { total: s.total, inProgress: s.inProgress, completed: s.completed, submitted: s.submitted };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_schema_1.UserProject.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map