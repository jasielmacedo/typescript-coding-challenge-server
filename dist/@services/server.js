"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
const Enums_1 = require("../@models/Enums");
const typescript_collections_1 = require("typescript-collections");
const events_1 = __importDefault(require("./events"));
const debug_1 = __importDefault(require("debug"));
const dispatcher_1 = __importDefault(require("./dispatcher"));
const Debugger = debug_1.default("server");
exports.default = new class ServerService extends dispatcher_1.default {
    constructor() {
        super();
        this.PORT = 5000;
        this.connections = new typescript_collections_1.Dictionary();
        this.sendToAllUsers = (event) => {
            this.io.emit(Enums_1.SocketEventMessageCode.NotifySchedule, event);
        };
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        this.listen();
        events_1.default.addListener(Enums_1.ServerEvents.ScheduledEventStarted, this.sendToAllUsers);
    }
    start() {
        return this.server.listen(this.PORT, () => {
            Debugger(`server running in http://localhost:${this.PORT}`);
            this.dispatch(Enums_1.ServerEvents.OnConnected);
        });
    }
    listen() {
        this.io.on(Enums_1.SocketEventMessageCode.ServerConnection, (socket) => {
            this.connections.forEach((key, sock) => {
                sock.emit(Enums_1.SocketEventMessageCode.NotifyNewUser);
            });
            this.connections.setValue(socket.id, socket);
            Debugger("new user connected. Total: " + this.connections.size());
            socket.on(Enums_1.SocketEventMessageCode.Schedule, (msg) => {
                Debugger("new event to schedule: " + msg.name);
                events_1.default.add(msg);
                events_1.default.save();
            });
            socket.on(Enums_1.SocketEventMessageCode.Disconnect, () => {
                this.connections.remove(socket.id);
            });
        });
    }
};
