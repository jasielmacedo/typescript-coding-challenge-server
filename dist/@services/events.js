"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const debug_1 = __importDefault(require("debug"));
const dispatcher_1 = __importDefault(require("./dispatcher"));
const typescript_collections_1 = require("typescript-collections");
const Enums_1 = require("../@models/Enums");
const Debugger = debug_1.default("server-events");
exports.default = new class EventsService extends dispatcher_1.default {
    constructor() {
        super();
        this.scheduledMessages = new typescript_collections_1.Dictionary();
        this.check = () => {
            let currentMoment = moment_1.default().format("YYYY-MM-DD-hh:mm:ss");
            if (this.scheduledMessages.containsKey(currentMoment)) {
                let event = this.scheduledMessages.getValue(currentMoment);
                this.dispatch(Enums_1.ServerEvents.ScheduledEventStarted, event);
            }
        };
        this.scheduledMessages.clear();
        this.loadEvents();
    }
    loadEvents() {
        fs_1.default.readFile(__dirname + "/../../data/events.json", (err, data) => {
            this.scheduledMessages.clear();
            if (err) {
                Debugger("error to read data: " + err);
            }
            else {
                try {
                    let obj = JSON.parse(data.toString());
                    if (obj) {
                        for (let i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    }
                }
                catch (e) {
                    this.scheduledMessages.clear();
                }
            }
        });
    }
    add(event) {
        this.scheduledMessages.setValue(moment_1.default(event.date).format("YYYY-MM-DD-hh:mm:ss"), event);
    }
    save() {
        let eventsString = JSON.stringify(this.scheduledMessages.values());
        fs_1.default.writeFile(__dirname + "/../../data/events.json", eventsString, (err) => {
            Debugger("error: " + err);
        });
    }
};
