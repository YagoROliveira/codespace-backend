"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracksService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var TracksService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TracksService = _classThis = /** @class */ (function () {
        function TracksService_1(trackModel, progressModel) {
            this.trackModel = trackModel;
            this.progressModel = progressModel;
        }
        TracksService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.trackModel.find({ isPublished: true }).sort({ order: 1 }).exec()];
                });
            });
        };
        TracksService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var track;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackModel.findById(id).exec()];
                        case 1:
                            track = _a.sent();
                            if (!track)
                                throw new common_1.NotFoundException('Trilha não encontrada');
                            return [2 /*return*/, track];
                    }
                });
            });
        };
        TracksService_1.prototype.getUserTracks = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var tracks, progress, progressMap;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackModel.find({ isPublished: true }).sort({ order: 1 }).exec()];
                        case 1:
                            tracks = _a.sent();
                            return [4 /*yield*/, this.progressModel.find({ userId: new mongoose_1.Types.ObjectId(userId) }).exec()];
                        case 2:
                            progress = _a.sent();
                            progressMap = new Map(progress.map(function (p) { return [p.trackId.toString(), p]; }));
                            return [2 /*return*/, tracks.map(function (track) {
                                    var userProgress = progressMap.get(track._id.toString());
                                    return __assign(__assign({}, track.toObject()), { userProgress: userProgress
                                            ? {
                                                status: userProgress.status,
                                                progressPercent: userProgress.progressPercent,
                                                completedLessons: userProgress.completedLessons,
                                                startedAt: userProgress.startedAt,
                                            }
                                            : null });
                                })];
                    }
                });
            });
        };
        TracksService_1.prototype.startTrack = function (userId, trackId) {
            return __awaiter(this, void 0, void 0, function () {
                var track, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(trackId)];
                        case 1:
                            track = _a.sent();
                            return [4 /*yield*/, this.progressModel.findOne({
                                    userId: new mongoose_1.Types.ObjectId(userId),
                                    trackId: new mongoose_1.Types.ObjectId(trackId),
                                }).exec()];
                        case 2:
                            progress = _a.sent();
                            if (!!progress) return [3 /*break*/, 4];
                            progress = new this.progressModel({
                                userId: new mongoose_1.Types.ObjectId(userId),
                                trackId: new mongoose_1.Types.ObjectId(trackId),
                                status: 'in_progress',
                                startedAt: new Date(),
                            });
                            return [4 /*yield*/, progress.save()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, progress];
                    }
                });
            });
        };
        TracksService_1.prototype.completeLesson = function (userId, trackId, lessonId) {
            return __awaiter(this, void 0, void 0, function () {
                var track, progress, existingLesson;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(trackId)];
                        case 1:
                            track = _a.sent();
                            return [4 /*yield*/, this.progressModel.findOne({
                                    userId: new mongoose_1.Types.ObjectId(userId),
                                    trackId: new mongoose_1.Types.ObjectId(trackId),
                                }).exec()];
                        case 2:
                            progress = _a.sent();
                            if (!progress) {
                                progress = new this.progressModel({
                                    userId: new mongoose_1.Types.ObjectId(userId),
                                    trackId: new mongoose_1.Types.ObjectId(trackId),
                                    status: 'in_progress',
                                    startedAt: new Date(),
                                    lessonProgress: [],
                                });
                            }
                            existingLesson = progress.lessonProgress.find(function (lp) { return lp.lessonId.toString() === lessonId; });
                            if (!existingLesson) {
                                progress.lessonProgress.push({
                                    lessonId: new mongoose_1.Types.ObjectId(lessonId),
                                    completed: true,
                                    completedAt: new Date(),
                                });
                            }
                            progress.completedLessons = progress.lessonProgress.filter(function (lp) { return lp.completed; }).length;
                            progress.progressPercent = Math.round((progress.completedLessons / track.totalLessons) * 100);
                            if (progress.completedLessons >= track.totalLessons) {
                                progress.status = 'completed';
                                progress.completedAt = new Date();
                            }
                            else {
                                progress.status = 'in_progress';
                            }
                            return [4 /*yield*/, progress.save()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, progress];
                    }
                });
            });
        };
        return TracksService_1;
    }());
    __setFunctionName(_classThis, "TracksService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TracksService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TracksService = _classThis;
}();
exports.TracksService = TracksService;
