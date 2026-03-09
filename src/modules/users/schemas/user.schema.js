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
exports.UserSchema = exports.User = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var User = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _avatar_decorators;
    var _avatar_initializers = [];
    var _avatar_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _bio_decorators;
    var _bio_initializers = [];
    var _bio_extraInitializers = [];
    var _github_decorators;
    var _github_initializers = [];
    var _github_extraInitializers = [];
    var _linkedin_decorators;
    var _linkedin_initializers = [];
    var _linkedin_extraInitializers = [];
    var _plan_decorators;
    var _plan_initializers = [];
    var _plan_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _streakDays_decorators;
    var _streakDays_initializers = [];
    var _streakDays_extraInitializers = [];
    var _totalHours_decorators;
    var _totalHours_initializers = [];
    var _totalHours_extraInitializers = [];
    var _notificationPreferences_decorators;
    var _notificationPreferences_initializers = [];
    var _notificationPreferences_extraInitializers = [];
    var _lastLoginAt_decorators;
    var _lastLoginAt_initializers = [];
    var _lastLoginAt_extraInitializers = [];
    var User = _classThis = /** @class */ (function () {
        function User_1() {
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.avatar = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _avatar_initializers, void 0));
            this.phone = (__runInitializers(this, _avatar_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.bio = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
            this.github = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _github_initializers, void 0));
            this.linkedin = (__runInitializers(this, _github_extraInitializers), __runInitializers(this, _linkedin_initializers, void 0));
            this.plan = (__runInitializers(this, _linkedin_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
            this.status = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.role = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.streakDays = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _streakDays_initializers, void 0));
            this.totalHours = (__runInitializers(this, _streakDays_extraInitializers), __runInitializers(this, _totalHours_initializers, void 0));
            this.notificationPreferences = (__runInitializers(this, _totalHours_extraInitializers), __runInitializers(this, _notificationPreferences_initializers, void 0));
            this.lastLoginAt = (__runInitializers(this, _notificationPreferences_extraInitializers), __runInitializers(this, _lastLoginAt_initializers, void 0));
            __runInitializers(this, _lastLoginAt_extraInitializers);
        }
        return User_1;
    }());
    __setFunctionName(_classThis, "User");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _email_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true })];
        _password_decorators = [(0, mongoose_1.Prop)({ required: true, select: false })];
        _avatar_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _phone_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _bio_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _github_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _linkedin_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _plan_decorators = [(0, mongoose_1.Prop)({ enum: ['essencial', 'profissional', 'elite', 'free'], default: 'free' })];
        _status_decorators = [(0, mongoose_1.Prop)({ enum: ['active', 'inactive', 'suspended'], default: 'active' })];
        _role_decorators = [(0, mongoose_1.Prop)({ enum: ['user', 'admin', 'mentor'], default: 'user' })];
        _streakDays_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _totalHours_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _notificationPreferences_decorators = [(0, mongoose_1.Prop)({ type: Object, default: {} })];
        _lastLoginAt_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _avatar_decorators, { kind: "field", name: "avatar", static: false, private: false, access: { has: function (obj) { return "avatar" in obj; }, get: function (obj) { return obj.avatar; }, set: function (obj, value) { obj.avatar = value; } }, metadata: _metadata }, _avatar_initializers, _avatar_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: function (obj) { return "bio" in obj; }, get: function (obj) { return obj.bio; }, set: function (obj, value) { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
        __esDecorate(null, null, _github_decorators, { kind: "field", name: "github", static: false, private: false, access: { has: function (obj) { return "github" in obj; }, get: function (obj) { return obj.github; }, set: function (obj, value) { obj.github = value; } }, metadata: _metadata }, _github_initializers, _github_extraInitializers);
        __esDecorate(null, null, _linkedin_decorators, { kind: "field", name: "linkedin", static: false, private: false, access: { has: function (obj) { return "linkedin" in obj; }, get: function (obj) { return obj.linkedin; }, set: function (obj, value) { obj.linkedin = value; } }, metadata: _metadata }, _linkedin_initializers, _linkedin_extraInitializers);
        __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: function (obj) { return "plan" in obj; }, get: function (obj) { return obj.plan; }, set: function (obj, value) { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _streakDays_decorators, { kind: "field", name: "streakDays", static: false, private: false, access: { has: function (obj) { return "streakDays" in obj; }, get: function (obj) { return obj.streakDays; }, set: function (obj, value) { obj.streakDays = value; } }, metadata: _metadata }, _streakDays_initializers, _streakDays_extraInitializers);
        __esDecorate(null, null, _totalHours_decorators, { kind: "field", name: "totalHours", static: false, private: false, access: { has: function (obj) { return "totalHours" in obj; }, get: function (obj) { return obj.totalHours; }, set: function (obj, value) { obj.totalHours = value; } }, metadata: _metadata }, _totalHours_initializers, _totalHours_extraInitializers);
        __esDecorate(null, null, _notificationPreferences_decorators, { kind: "field", name: "notificationPreferences", static: false, private: false, access: { has: function (obj) { return "notificationPreferences" in obj; }, get: function (obj) { return obj.notificationPreferences; }, set: function (obj, value) { obj.notificationPreferences = value; } }, metadata: _metadata }, _notificationPreferences_initializers, _notificationPreferences_extraInitializers);
        __esDecorate(null, null, _lastLoginAt_decorators, { kind: "field", name: "lastLoginAt", static: false, private: false, access: { has: function (obj) { return "lastLoginAt" in obj; }, get: function (obj) { return obj.lastLoginAt; }, set: function (obj, value) { obj.lastLoginAt = value; } }, metadata: _metadata }, _lastLoginAt_initializers, _lastLoginAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
// Index for email uniqueness
exports.UserSchema.index({ email: 1 }, { unique: true });
