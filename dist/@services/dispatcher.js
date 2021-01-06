"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DispatcherService {
    constructor() {
        this._internalEvents = {};
    }
    addListener(event, callback) {
        if (this._internalEvents[event] === undefined) {
            this._internalEvents[event] = {
                listeners: []
            };
        }
        this._internalEvents[event].listeners.push(callback);
    }
    removeListener(event, callback) {
        if (this._internalEvents[event] === undefined) {
            return false;
        }
        this._internalEvents[event].listeners = this._internalEvents[event].listeners.filter((listener) => {
            return listener.toString() !== callback.toString();
        });
        return true;
    }
    dispatch(event, data) {
        if (this._internalEvents[event] === undefined) {
            return false;
        }
        this._internalEvents[event].listeners.forEach((listener) => {
            listener(data);
        });
    }
}
exports.default = DispatcherService;
