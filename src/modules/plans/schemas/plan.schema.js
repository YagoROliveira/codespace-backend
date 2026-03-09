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
exports.PlanSchema = exports.Plan = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Plan = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _priceMonthly_decorators;
    var _priceMonthly_initializers = [];
    var _priceMonthly_extraInitializers = [];
    var _priceYearly_decorators;
    var _priceYearly_initializers = [];
    var _priceYearly_extraInitializers = [];
    var _sessionsPerWeek_decorators;
    var _sessionsPerWeek_initializers = [];
    var _sessionsPerWeek_extraInitializers = [];
    var _features_decorators;
    var _features_initializers = [];
    var _features_extraInitializers = [];
    var _isPopular_decorators;
    var _isPopular_initializers = [];
    var _isPopular_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var Plan = _classThis = /** @class */ (function () {
        function Plan_1() {
            this.slug = __runInitializers(this, _slug_initializers, void 0);
            this.name = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.priceMonthly = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priceMonthly_initializers, void 0));
            this.priceYearly = (__runInitializers(this, _priceMonthly_extraInitializers), __runInitializers(this, _priceYearly_initializers, void 0));
            this.sessionsPerWeek = (__runInitializers(this, _priceYearly_extraInitializers), __runInitializers(this, _sessionsPerWeek_initializers, void 0));
            this.features = (__runInitializers(this, _sessionsPerWeek_extraInitializers), __runInitializers(this, _features_initializers, void 0));
            this.isPopular = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _isPopular_initializers, void 0));
            this.isActive = (__runInitializers(this, _isPopular_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.order = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            __runInitializers(this, _order_extraInitializers);
        }
        return Plan_1;
    }());
    __setFunctionName(_classThis, "Plan");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _slug_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _priceMonthly_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _priceYearly_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _sessionsPerWeek_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _features_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _isPopular_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _isActive_decorators = [(0, mongoose_1.Prop)({ default: true })];
        _order_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _priceMonthly_decorators, { kind: "field", name: "priceMonthly", static: false, private: false, access: { has: function (obj) { return "priceMonthly" in obj; }, get: function (obj) { return obj.priceMonthly; }, set: function (obj, value) { obj.priceMonthly = value; } }, metadata: _metadata }, _priceMonthly_initializers, _priceMonthly_extraInitializers);
        __esDecorate(null, null, _priceYearly_decorators, { kind: "field", name: "priceYearly", static: false, private: false, access: { has: function (obj) { return "priceYearly" in obj; }, get: function (obj) { return obj.priceYearly; }, set: function (obj, value) { obj.priceYearly = value; } }, metadata: _metadata }, _priceYearly_initializers, _priceYearly_extraInitializers);
        __esDecorate(null, null, _sessionsPerWeek_decorators, { kind: "field", name: "sessionsPerWeek", static: false, private: false, access: { has: function (obj) { return "sessionsPerWeek" in obj; }, get: function (obj) { return obj.sessionsPerWeek; }, set: function (obj, value) { obj.sessionsPerWeek = value; } }, metadata: _metadata }, _sessionsPerWeek_initializers, _sessionsPerWeek_extraInitializers);
        __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: function (obj) { return "features" in obj; }, get: function (obj) { return obj.features; }, set: function (obj, value) { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
        __esDecorate(null, null, _isPopular_decorators, { kind: "field", name: "isPopular", static: false, private: false, access: { has: function (obj) { return "isPopular" in obj; }, get: function (obj) { return obj.isPopular; }, set: function (obj, value) { obj.isPopular = value; } }, metadata: _metadata }, _isPopular_initializers, _isPopular_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Plan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Plan = _classThis;
}();
exports.Plan = Plan;
exports.PlanSchema = mongoose_1.SchemaFactory.createForClass(Plan);
