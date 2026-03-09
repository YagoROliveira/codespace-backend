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
exports.SessionSchema = exports.Session = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Session = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _mentorId_decorators;
    var _mentorId_initializers = [];
    var _mentorId_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _scheduledAt_decorators;
    var _scheduledAt_initializers = [];
    var _scheduledAt_extraInitializers = [];
    var _durationMinutes_decorators;
    var _durationMinutes_initializers = [];
    var _durationMinutes_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _meetingUrl_decorators;
    var _meetingUrl_initializers = [];
    var _meetingUrl_extraInitializers = [];
    var _recordingUrl_decorators;
    var _recordingUrl_initializers = [];
    var _recordingUrl_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _topics_decorators;
    var _topics_initializers = [];
    var _topics_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var Session = _classThis = /** @class */ (function () {
        function Session_1() {
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            this.mentorId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _mentorId_initializers, void 0));
            this.title = (__runInitializers(this, _mentorId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.scheduledAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
            this.durationMinutes = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _durationMinutes_initializers, void 0));
            this.status = (__runInitializers(this, _durationMinutes_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.meetingUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _meetingUrl_initializers, void 0));
            this.recordingUrl = (__runInitializers(this, _meetingUrl_extraInitializers), __runInitializers(this, _recordingUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _recordingUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.topics = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
            this.type = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            __runInitializers(this, _type_extraInitializers);
        }
        return Session_1;
    }());
    __setFunctionName(_classThis, "Session");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _userId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _mentorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' })];
        _title_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _scheduledAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _durationMinutes_decorators = [(0, mongoose_1.Prop)({ default: 60 })];
        _status_decorators = [(0, mongoose_1.Prop)({ enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' })];
        _meetingUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _recordingUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _notes_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _topics_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _type_decorators = [(0, mongoose_1.Prop)({ enum: ['mentoring', 'code_review', 'mock_interview', 'pair_programming'], default: 'mentoring' })];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _mentorId_decorators, { kind: "field", name: "mentorId", static: false, private: false, access: { has: function (obj) { return "mentorId" in obj; }, get: function (obj) { return obj.mentorId; }, set: function (obj, value) { obj.mentorId = value; } }, metadata: _metadata }, _mentorId_initializers, _mentorId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: function (obj) { return "scheduledAt" in obj; }, get: function (obj) { return obj.scheduledAt; }, set: function (obj, value) { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
        __esDecorate(null, null, _durationMinutes_decorators, { kind: "field", name: "durationMinutes", static: false, private: false, access: { has: function (obj) { return "durationMinutes" in obj; }, get: function (obj) { return obj.durationMinutes; }, set: function (obj, value) { obj.durationMinutes = value; } }, metadata: _metadata }, _durationMinutes_initializers, _durationMinutes_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _meetingUrl_decorators, { kind: "field", name: "meetingUrl", static: false, private: false, access: { has: function (obj) { return "meetingUrl" in obj; }, get: function (obj) { return obj.meetingUrl; }, set: function (obj, value) { obj.meetingUrl = value; } }, metadata: _metadata }, _meetingUrl_initializers, _meetingUrl_extraInitializers);
        __esDecorate(null, null, _recordingUrl_decorators, { kind: "field", name: "recordingUrl", static: false, private: false, access: { has: function (obj) { return "recordingUrl" in obj; }, get: function (obj) { return obj.recordingUrl; }, set: function (obj, value) { obj.recordingUrl = value; } }, metadata: _metadata }, _recordingUrl_initializers, _recordingUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: function (obj) { return "topics" in obj; }, get: function (obj) { return obj.topics; }, set: function (obj, value) { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Session = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Session = _classThis;
}();
exports.Session = Session;
exports.SessionSchema = mongoose_1.SchemaFactory.createForClass(Session);
exports.SessionSchema.index({ userId: 1, scheduledAt: -1 });
exports.SessionSchema.index({ mentorId: 1, scheduledAt: -1 });
