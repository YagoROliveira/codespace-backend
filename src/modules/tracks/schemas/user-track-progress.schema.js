"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTrackProgressSchema = exports.UserTrackProgress = exports.LessonProgressSchema = exports.LessonProgress = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var LessonProgress = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _lessonId_decorators;
    var _lessonId_initializers = [];
    var _lessonId_extraInitializers = [];
    var _completed_decorators;
    var _completed_initializers = [];
    var _completed_extraInitializers = [];
    var _completedAt_decorators;
    var _completedAt_initializers = [];
    var _completedAt_extraInitializers = [];
    var LessonProgress = _classThis = /** @class */ (function () {
        function LessonProgress_1() {
            this.lessonId = __runInitializers(this, _lessonId_initializers, void 0);
            this.completed = (__runInitializers(this, _lessonId_extraInitializers), __runInitializers(this, _completed_initializers, void 0));
            this.completedAt = (__runInitializers(this, _completed_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            __runInitializers(this, _completedAt_extraInitializers);
        }
        return LessonProgress_1;
    }());
    __setFunctionName(_classThis, "LessonProgress");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _lessonId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _completed_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _completedAt_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _lessonId_decorators, { kind: "field", name: "lessonId", static: false, private: false, access: { has: function (obj) { return "lessonId" in obj; }, get: function (obj) { return obj.lessonId; }, set: function (obj, value) { obj.lessonId = value; } }, metadata: _metadata }, _lessonId_initializers, _lessonId_extraInitializers);
        __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: function (obj) { return "completed" in obj; }, get: function (obj) { return obj.completed; }, set: function (obj, value) { obj.completed = value; } }, metadata: _metadata }, _completed_initializers, _completed_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: function (obj) { return "completedAt" in obj; }, get: function (obj) { return obj.completedAt; }, set: function (obj, value) { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LessonProgress = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LessonProgress = _classThis;
}();
exports.LessonProgress = LessonProgress;
exports.LessonProgressSchema = mongoose_1.SchemaFactory.createForClass(LessonProgress);
var UserTrackProgress = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _trackId_decorators;
    var _trackId_initializers = [];
    var _trackId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _progressPercent_decorators;
    var _progressPercent_initializers = [];
    var _progressPercent_extraInitializers = [];
    var _completedLessons_decorators;
    var _completedLessons_initializers = [];
    var _completedLessons_extraInitializers = [];
    var _lessonProgress_decorators;
    var _lessonProgress_initializers = [];
    var _lessonProgress_extraInitializers = [];
    var _startedAt_decorators;
    var _startedAt_initializers = [];
    var _startedAt_extraInitializers = [];
    var _completedAt_decorators;
    var _completedAt_initializers = [];
    var _completedAt_extraInitializers = [];
    var UserTrackProgress = _classThis = /** @class */ (function () {
        function UserTrackProgress_1() {
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            this.trackId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _trackId_initializers, void 0));
            this.status = (__runInitializers(this, _trackId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.progressPercent = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progressPercent_initializers, void 0));
            this.completedLessons = (__runInitializers(this, _progressPercent_extraInitializers), __runInitializers(this, _completedLessons_initializers, void 0));
            this.lessonProgress = (__runInitializers(this, _completedLessons_extraInitializers), __runInitializers(this, _lessonProgress_initializers, void 0));
            this.startedAt = (__runInitializers(this, _lessonProgress_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            __runInitializers(this, _completedAt_extraInitializers);
        }
        return UserTrackProgress_1;
    }());
    __setFunctionName(_classThis, "UserTrackProgress");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _userId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _trackId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Track', required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' })];
        _progressPercent_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _completedLessons_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _lessonProgress_decorators = [(0, mongoose_1.Prop)({ type: [exports.LessonProgressSchema], default: [] })];
        _startedAt_decorators = [(0, mongoose_1.Prop)()];
        _completedAt_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _trackId_decorators, { kind: "field", name: "trackId", static: false, private: false, access: { has: function (obj) { return "trackId" in obj; }, get: function (obj) { return obj.trackId; }, set: function (obj, value) { obj.trackId = value; } }, metadata: _metadata }, _trackId_initializers, _trackId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _progressPercent_decorators, { kind: "field", name: "progressPercent", static: false, private: false, access: { has: function (obj) { return "progressPercent" in obj; }, get: function (obj) { return obj.progressPercent; }, set: function (obj, value) { obj.progressPercent = value; } }, metadata: _metadata }, _progressPercent_initializers, _progressPercent_extraInitializers);
        __esDecorate(null, null, _completedLessons_decorators, { kind: "field", name: "completedLessons", static: false, private: false, access: { has: function (obj) { return "completedLessons" in obj; }, get: function (obj) { return obj.completedLessons; }, set: function (obj, value) { obj.completedLessons = value; } }, metadata: _metadata }, _completedLessons_initializers, _completedLessons_extraInitializers);
        __esDecorate(null, null, _lessonProgress_decorators, { kind: "field", name: "lessonProgress", static: false, private: false, access: { has: function (obj) { return "lessonProgress" in obj; }, get: function (obj) { return obj.lessonProgress; }, set: function (obj, value) { obj.lessonProgress = value; } }, metadata: _metadata }, _lessonProgress_initializers, _lessonProgress_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: function (obj) { return "startedAt" in obj; }, get: function (obj) { return obj.startedAt; }, set: function (obj, value) { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: function (obj) { return "completedAt" in obj; }, get: function (obj) { return obj.completedAt; }, set: function (obj, value) { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserTrackProgress = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserTrackProgress = _classThis;
}();
exports.UserTrackProgress = UserTrackProgress;
exports.UserTrackProgressSchema = mongoose_1.SchemaFactory.createForClass(UserTrackProgress);
exports.UserTrackProgressSchema.index({ userId: 1, trackId: 1 }, { unique: true });
