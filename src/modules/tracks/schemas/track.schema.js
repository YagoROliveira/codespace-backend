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
exports.TrackSchema = exports.Track = exports.LessonSchema = exports.Lesson = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Lesson = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _videoUrl_decorators;
    var _videoUrl_initializers = [];
    var _videoUrl_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _durationMinutes_decorators;
    var _durationMinutes_initializers = [];
    var _durationMinutes_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var Lesson = _classThis = /** @class */ (function () {
        function Lesson_1() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.videoUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _videoUrl_initializers, void 0));
            this.content = (__runInitializers(this, _videoUrl_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.durationMinutes = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _durationMinutes_initializers, void 0));
            this.order = (__runInitializers(this, _durationMinutes_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            __runInitializers(this, _order_extraInitializers);
        }
        return Lesson_1;
    }());
    __setFunctionName(_classThis, "Lesson");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _videoUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _content_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _durationMinutes_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _order_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _videoUrl_decorators, { kind: "field", name: "videoUrl", static: false, private: false, access: { has: function (obj) { return "videoUrl" in obj; }, get: function (obj) { return obj.videoUrl; }, set: function (obj, value) { obj.videoUrl = value; } }, metadata: _metadata }, _videoUrl_initializers, _videoUrl_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _durationMinutes_decorators, { kind: "field", name: "durationMinutes", static: false, private: false, access: { has: function (obj) { return "durationMinutes" in obj; }, get: function (obj) { return obj.durationMinutes; }, set: function (obj, value) { obj.durationMinutes = value; } }, metadata: _metadata }, _durationMinutes_initializers, _durationMinutes_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Lesson = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Lesson = _classThis;
}();
exports.Lesson = Lesson;
exports.LessonSchema = mongoose_1.SchemaFactory.createForClass(Lesson);
var Track = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _icon_decorators;
    var _icon_initializers = [];
    var _icon_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _difficulty_decorators;
    var _difficulty_initializers = [];
    var _difficulty_extraInitializers = [];
    var _totalLessons_decorators;
    var _totalLessons_initializers = [];
    var _totalLessons_extraInitializers = [];
    var _estimatedHours_decorators;
    var _estimatedHours_initializers = [];
    var _estimatedHours_extraInitializers = [];
    var _lessons_decorators;
    var _lessons_initializers = [];
    var _lessons_extraInitializers = [];
    var _requiredPlans_decorators;
    var _requiredPlans_initializers = [];
    var _requiredPlans_extraInitializers = [];
    var _isPublished_decorators;
    var _isPublished_initializers = [];
    var _isPublished_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var Track = _classThis = /** @class */ (function () {
        function Track_1() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.icon = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _icon_initializers, void 0));
            this.color = (__runInitializers(this, _icon_extraInitializers), __runInitializers(this, _color_initializers, void 0));
            this.tags = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.difficulty = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _difficulty_initializers, void 0));
            this.totalLessons = (__runInitializers(this, _difficulty_extraInitializers), __runInitializers(this, _totalLessons_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _totalLessons_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.lessons = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _lessons_initializers, void 0));
            this.requiredPlans = (__runInitializers(this, _lessons_extraInitializers), __runInitializers(this, _requiredPlans_initializers, void 0));
            this.isPublished = (__runInitializers(this, _requiredPlans_extraInitializers), __runInitializers(this, _isPublished_initializers, void 0));
            this.order = (__runInitializers(this, _isPublished_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            __runInitializers(this, _order_extraInitializers);
        }
        return Track_1;
    }());
    __setFunctionName(_classThis, "Track");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _icon_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _color_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _tags_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _difficulty_decorators = [(0, mongoose_1.Prop)({ enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' })];
        _totalLessons_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _estimatedHours_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _lessons_decorators = [(0, mongoose_1.Prop)({ type: [exports.LessonSchema], default: [] })];
        _requiredPlans_decorators = [(0, mongoose_1.Prop)({ type: [String], enum: ['free', 'essencial', 'profissional', 'elite'], default: ['free'] })];
        _isPublished_decorators = [(0, mongoose_1.Prop)({ default: true })];
        _order_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _icon_decorators, { kind: "field", name: "icon", static: false, private: false, access: { has: function (obj) { return "icon" in obj; }, get: function (obj) { return obj.icon; }, set: function (obj, value) { obj.icon = value; } }, metadata: _metadata }, _icon_initializers, _icon_extraInitializers);
        __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _difficulty_decorators, { kind: "field", name: "difficulty", static: false, private: false, access: { has: function (obj) { return "difficulty" in obj; }, get: function (obj) { return obj.difficulty; }, set: function (obj, value) { obj.difficulty = value; } }, metadata: _metadata }, _difficulty_initializers, _difficulty_extraInitializers);
        __esDecorate(null, null, _totalLessons_decorators, { kind: "field", name: "totalLessons", static: false, private: false, access: { has: function (obj) { return "totalLessons" in obj; }, get: function (obj) { return obj.totalLessons; }, set: function (obj, value) { obj.totalLessons = value; } }, metadata: _metadata }, _totalLessons_initializers, _totalLessons_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: function (obj) { return "estimatedHours" in obj; }, get: function (obj) { return obj.estimatedHours; }, set: function (obj, value) { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _lessons_decorators, { kind: "field", name: "lessons", static: false, private: false, access: { has: function (obj) { return "lessons" in obj; }, get: function (obj) { return obj.lessons; }, set: function (obj, value) { obj.lessons = value; } }, metadata: _metadata }, _lessons_initializers, _lessons_extraInitializers);
        __esDecorate(null, null, _requiredPlans_decorators, { kind: "field", name: "requiredPlans", static: false, private: false, access: { has: function (obj) { return "requiredPlans" in obj; }, get: function (obj) { return obj.requiredPlans; }, set: function (obj, value) { obj.requiredPlans = value; } }, metadata: _metadata }, _requiredPlans_initializers, _requiredPlans_extraInitializers);
        __esDecorate(null, null, _isPublished_decorators, { kind: "field", name: "isPublished", static: false, private: false, access: { has: function (obj) { return "isPublished" in obj; }, get: function (obj) { return obj.isPublished; }, set: function (obj, value) { obj.isPublished = value; } }, metadata: _metadata }, _isPublished_initializers, _isPublished_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Track = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Track = _classThis;
}();
exports.Track = Track;
exports.TrackSchema = mongoose_1.SchemaFactory.createForClass(Track);
