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
exports.CommunityService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var CommunityService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CommunityService = _classThis = /** @class */ (function () {
        function CommunityService_1(channelModel, messageModel) {
            this.channelModel = channelModel;
            this.messageModel = messageModel;
        }
        // Channels
        CommunityService_1.prototype.getChannels = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.channelModel.find({ isActive: true }).sort({ order: 1 }).exec()];
                });
            });
        };
        CommunityService_1.prototype.createChannel = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var channel;
                return __generator(this, function (_a) {
                    channel = new this.channelModel(dto);
                    return [2 /*return*/, channel.save()];
                });
            });
        };
        // Messages
        CommunityService_1.prototype.getMessages = function (channelId_1) {
            return __awaiter(this, arguments, void 0, function (channelId, page, limit) {
                var skip, _a, messages, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.messageModel
                                        .find({
                                        channelId: new mongoose_1.Types.ObjectId(channelId),
                                        parentMessageId: null,
                                    })
                                        .sort({ createdAt: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .populate('userId', 'name avatar role plan')
                                        .exec(),
                                    this.messageModel.countDocuments({
                                        channelId: new mongoose_1.Types.ObjectId(channelId),
                                        parentMessageId: null,
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), messages = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    messages: messages.reverse(),
                                    total: total,
                                    page: page,
                                    totalPages: Math.ceil(total / limit),
                                }];
                    }
                });
            });
        };
        CommunityService_1.prototype.getPinnedMessages = function (channelId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.messageModel
                            .find({
                            channelId: new mongoose_1.Types.ObjectId(channelId),
                            isPinned: true,
                        })
                            .populate('userId', 'name avatar role')
                            .sort({ createdAt: -1 })
                            .exec()];
                });
            });
        };
        CommunityService_1.prototype.createMessage = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var message, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            message = new this.messageModel(__assign(__assign({}, dto), { userId: new mongoose_1.Types.ObjectId(userId), channelId: new mongoose_1.Types.ObjectId(dto.channelId), parentMessageId: dto.parentMessageId
                                    ? new mongoose_1.Types.ObjectId(dto.parentMessageId)
                                    : null }));
                            return [4 /*yield*/, message.save()];
                        case 1:
                            saved = _a.sent();
                            if (!dto.parentMessageId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.messageModel.findByIdAndUpdate(dto.parentMessageId, {
                                    $inc: { replyCount: 1 },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, saved.populate('userId', 'name avatar role plan')];
                    }
                });
            });
        };
        CommunityService_1.prototype.toggleLike = function (messageId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var message, userObjectId, likeIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.messageModel.findById(messageId).exec()];
                        case 1:
                            message = _a.sent();
                            if (!message)
                                throw new common_1.NotFoundException('Mensagem não encontrada');
                            userObjectId = new mongoose_1.Types.ObjectId(userId);
                            likeIndex = message.likes.findIndex(function (id) { return id.toString() === userId; });
                            if (likeIndex > -1) {
                                message.likes.splice(likeIndex, 1);
                            }
                            else {
                                message.likes.push(userObjectId);
                            }
                            return [4 /*yield*/, message.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, message.populate('userId', 'name avatar role plan')];
                    }
                });
            });
        };
        CommunityService_1.prototype.togglePin = function (messageId) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.messageModel.findById(messageId).exec()];
                        case 1:
                            message = _a.sent();
                            if (!message)
                                throw new common_1.NotFoundException('Mensagem não encontrada');
                            message.isPinned = !message.isPinned;
                            return [4 /*yield*/, message.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, message];
                    }
                });
            });
        };
        CommunityService_1.prototype.getReplies = function (messageId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.messageModel
                            .find({ parentMessageId: new mongoose_1.Types.ObjectId(messageId) })
                            .populate('userId', 'name avatar role plan')
                            .sort({ createdAt: 1 })
                            .exec()];
                });
            });
        };
        return CommunityService_1;
    }());
    __setFunctionName(_classThis, "CommunityService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommunityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommunityService = _classThis;
}();
exports.CommunityService = CommunityService;
