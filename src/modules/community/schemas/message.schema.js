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
exports.MessageSchema = exports.Message = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Message = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _channelId_decorators;
    var _channelId_initializers = [];
    var _channelId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _isPinned_decorators;
    var _isPinned_initializers = [];
    var _isPinned_extraInitializers = [];
    var _likes_decorators;
    var _likes_initializers = [];
    var _likes_extraInitializers = [];
    var _replyCount_decorators;
    var _replyCount_initializers = [];
    var _replyCount_extraInitializers = [];
    var _parentMessageId_decorators;
    var _parentMessageId_initializers = [];
    var _parentMessageId_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    var Message = _classThis = /** @class */ (function () {
        function Message_1() {
            this.channelId = __runInitializers(this, _channelId_initializers, void 0);
            this.userId = (__runInitializers(this, _channelId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.content = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.isPinned = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _isPinned_initializers, void 0));
            this.likes = (__runInitializers(this, _isPinned_extraInitializers), __runInitializers(this, _likes_initializers, void 0));
            this.replyCount = (__runInitializers(this, _likes_extraInitializers), __runInitializers(this, _replyCount_initializers, void 0));
            this.parentMessageId = (__runInitializers(this, _replyCount_extraInitializers), __runInitializers(this, _parentMessageId_initializers, void 0));
            this.attachments = (__runInitializers(this, _parentMessageId_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            __runInitializers(this, _attachments_extraInitializers);
        }
        return Message_1;
    }());
    __setFunctionName(_classThis, "Message");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _channelId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Channel', required: true })];
        _userId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _content_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _isPinned_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _likes_decorators = [(0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'User', default: [] })];
        _replyCount_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _parentMessageId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Message', default: null })];
        _attachments_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        __esDecorate(null, null, _channelId_decorators, { kind: "field", name: "channelId", static: false, private: false, access: { has: function (obj) { return "channelId" in obj; }, get: function (obj) { return obj.channelId; }, set: function (obj, value) { obj.channelId = value; } }, metadata: _metadata }, _channelId_initializers, _channelId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _isPinned_decorators, { kind: "field", name: "isPinned", static: false, private: false, access: { has: function (obj) { return "isPinned" in obj; }, get: function (obj) { return obj.isPinned; }, set: function (obj, value) { obj.isPinned = value; } }, metadata: _metadata }, _isPinned_initializers, _isPinned_extraInitializers);
        __esDecorate(null, null, _likes_decorators, { kind: "field", name: "likes", static: false, private: false, access: { has: function (obj) { return "likes" in obj; }, get: function (obj) { return obj.likes; }, set: function (obj, value) { obj.likes = value; } }, metadata: _metadata }, _likes_initializers, _likes_extraInitializers);
        __esDecorate(null, null, _replyCount_decorators, { kind: "field", name: "replyCount", static: false, private: false, access: { has: function (obj) { return "replyCount" in obj; }, get: function (obj) { return obj.replyCount; }, set: function (obj, value) { obj.replyCount = value; } }, metadata: _metadata }, _replyCount_initializers, _replyCount_extraInitializers);
        __esDecorate(null, null, _parentMessageId_decorators, { kind: "field", name: "parentMessageId", static: false, private: false, access: { has: function (obj) { return "parentMessageId" in obj; }, get: function (obj) { return obj.parentMessageId; }, set: function (obj, value) { obj.parentMessageId = value; } }, metadata: _metadata }, _parentMessageId_initializers, _parentMessageId_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Message = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Message = _classThis;
}();
exports.Message = Message;
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);
exports.MessageSchema.index({ channelId: 1, createdAt: -1 });
exports.MessageSchema.index({ parentMessageId: 1 });
