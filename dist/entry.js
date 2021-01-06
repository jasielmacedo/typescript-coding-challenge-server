"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./@services/server"));
const events_1 = __importDefault(require("./@services/events"));
const debug_1 = __importDefault(require("debug"));
const Enums_1 = require("./@models/Enums");
const timers_1 = require("timers");
const Debugger = debug_1.default("entry");
server_1.default.start();
var haveInterval = false;
var intervalId;
server_1.default.addListener(Enums_1.ServerEvents.OnConnected, () => {
    Debugger("Server started and running");
    if (haveInterval) {
        timers_1.clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
        events_1.default.check();
    }, 900);
    haveInterval = true;
});
