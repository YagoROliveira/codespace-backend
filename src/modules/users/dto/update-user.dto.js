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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationsDto = exports.UpdatePasswordDto = exports.UpdateUserDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateUserDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
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
    return _a = /** @class */ (function () {
            function UpdateUserDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.avatar = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _avatar_initializers, void 0));
                this.phone = (__runInitializers(this, _avatar_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.bio = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
                this.github = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _github_initializers, void 0));
                this.linkedin = (__runInitializers(this, _github_extraInitializers), __runInitializers(this, _linkedin_initializers, void 0));
                this.plan = (__runInitializers(this, _linkedin_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
                __runInitializers(this, _plan_extraInitializers);
            }
            return UpdateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _avatar_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _phone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bio_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _github_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _linkedin_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _plan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['essencial', 'profissional', 'elite', 'free'])];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _avatar_decorators, { kind: "field", name: "avatar", static: false, private: false, access: { has: function (obj) { return "avatar" in obj; }, get: function (obj) { return obj.avatar; }, set: function (obj, value) { obj.avatar = value; } }, metadata: _metadata }, _avatar_initializers, _avatar_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: function (obj) { return "bio" in obj; }, get: function (obj) { return obj.bio; }, set: function (obj, value) { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
            __esDecorate(null, null, _github_decorators, { kind: "field", name: "github", static: false, private: false, access: { has: function (obj) { return "github" in obj; }, get: function (obj) { return obj.github; }, set: function (obj, value) { obj.github = value; } }, metadata: _metadata }, _github_initializers, _github_extraInitializers);
            __esDecorate(null, null, _linkedin_decorators, { kind: "field", name: "linkedin", static: false, private: false, access: { has: function (obj) { return "linkedin" in obj; }, get: function (obj) { return obj.linkedin; }, set: function (obj, value) { obj.linkedin = value; } }, metadata: _metadata }, _linkedin_initializers, _linkedin_extraInitializers);
            __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: function (obj) { return "plan" in obj; }, get: function (obj) { return obj.plan; }, set: function (obj, value) { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserDto = UpdateUserDto;
var UpdatePasswordDto = function () {
    var _a;
    var _currentPassword_decorators;
    var _currentPassword_initializers = [];
    var _currentPassword_extraInitializers = [];
    var _newPassword_decorators;
    var _newPassword_initializers = [];
    var _newPassword_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePasswordDto() {
                this.currentPassword = __runInitializers(this, _currentPassword_initializers, void 0);
                this.newPassword = (__runInitializers(this, _currentPassword_extraInitializers), __runInitializers(this, _newPassword_initializers, void 0));
                __runInitializers(this, _newPassword_extraInitializers);
            }
            return UpdatePasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currentPassword_decorators = [(0, class_validator_1.IsString)()];
            _newPassword_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _currentPassword_decorators, { kind: "field", name: "currentPassword", static: false, private: false, access: { has: function (obj) { return "currentPassword" in obj; }, get: function (obj) { return obj.currentPassword; }, set: function (obj, value) { obj.currentPassword = value; } }, metadata: _metadata }, _currentPassword_initializers, _currentPassword_extraInitializers);
            __esDecorate(null, null, _newPassword_decorators, { kind: "field", name: "newPassword", static: false, private: false, access: { has: function (obj) { return "newPassword" in obj; }, get: function (obj) { return obj.newPassword; }, set: function (obj, value) { obj.newPassword = value; } }, metadata: _metadata }, _newPassword_initializers, _newPassword_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePasswordDto = UpdatePasswordDto;
var UpdateNotificationsDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _push_decorators;
    var _push_initializers = [];
    var _push_extraInitializers = [];
    var _mentorReminders_decorators;
    var _mentorReminders_initializers = [];
    var _mentorReminders_extraInitializers = [];
    var _communityUpdates_decorators;
    var _communityUpdates_initializers = [];
    var _communityUpdates_extraInitializers = [];
    var _weeklyReport_decorators;
    var _weeklyReport_initializers = [];
    var _weeklyReport_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateNotificationsDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.push = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _push_initializers, void 0));
                this.mentorReminders = (__runInitializers(this, _push_extraInitializers), __runInitializers(this, _mentorReminders_initializers, void 0));
                this.communityUpdates = (__runInitializers(this, _mentorReminders_extraInitializers), __runInitializers(this, _communityUpdates_initializers, void 0));
                this.weeklyReport = (__runInitializers(this, _communityUpdates_extraInitializers), __runInitializers(this, _weeklyReport_initializers, void 0));
                __runInitializers(this, _weeklyReport_extraInitializers);
            }
            return UpdateNotificationsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, class_validator_1.IsOptional)()];
            _push_decorators = [(0, class_validator_1.IsOptional)()];
            _mentorReminders_decorators = [(0, class_validator_1.IsOptional)()];
            _communityUpdates_decorators = [(0, class_validator_1.IsOptional)()];
            _weeklyReport_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _push_decorators, { kind: "field", name: "push", static: false, private: false, access: { has: function (obj) { return "push" in obj; }, get: function (obj) { return obj.push; }, set: function (obj, value) { obj.push = value; } }, metadata: _metadata }, _push_initializers, _push_extraInitializers);
            __esDecorate(null, null, _mentorReminders_decorators, { kind: "field", name: "mentorReminders", static: false, private: false, access: { has: function (obj) { return "mentorReminders" in obj; }, get: function (obj) { return obj.mentorReminders; }, set: function (obj, value) { obj.mentorReminders = value; } }, metadata: _metadata }, _mentorReminders_initializers, _mentorReminders_extraInitializers);
            __esDecorate(null, null, _communityUpdates_decorators, { kind: "field", name: "communityUpdates", static: false, private: false, access: { has: function (obj) { return "communityUpdates" in obj; }, get: function (obj) { return obj.communityUpdates; }, set: function (obj, value) { obj.communityUpdates = value; } }, metadata: _metadata }, _communityUpdates_initializers, _communityUpdates_extraInitializers);
            __esDecorate(null, null, _weeklyReport_decorators, { kind: "field", name: "weeklyReport", static: false, private: false, access: { has: function (obj) { return "weeklyReport" in obj; }, get: function (obj) { return obj.weeklyReport; }, set: function (obj, value) { obj.weeklyReport = value; } }, metadata: _metadata }, _weeklyReport_initializers, _weeklyReport_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateNotificationsDto = UpdateNotificationsDto;
