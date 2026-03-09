"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
let cachedApp;
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.init();
    return app;
}
async function handler(req, res) {
    if (!cachedApp) {
        cachedApp = await createApp();
    }
    const expressApp = cachedApp.getHttpAdapter().getInstance();
    return expressApp(req, res);
}
if (process.env.NODE_ENV !== 'production') {
    createApp().then(async (app) => {
        const port = process.env.PORT || 3000;
        await app.listen(port);
        console.log(`🚀 Codespace API running on http://localhost:${port}/api`);
    });
}
//# sourceMappingURL=main.js.map