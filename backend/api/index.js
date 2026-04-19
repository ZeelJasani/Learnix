"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/config/db");
let isConnected = false;
const handler = async (req, res) => {
    if (!isConnected) {
        await (0, db_1.connectDB)();
        isConnected = true;
    }
    return (0, app_1.default)(req, res);
};
exports.default = handler;
//# sourceMappingURL=index.js.map