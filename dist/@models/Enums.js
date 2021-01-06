"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEventMessageCode;
(function (SocketEventMessageCode) {
    SocketEventMessageCode["ServerConnection"] = "connection";
    SocketEventMessageCode["Disconnect"] = "disconnect";
    SocketEventMessageCode["ConnectionError"] = "connect_error";
    SocketEventMessageCode["Schedule"] = "msgSchedule";
    SocketEventMessageCode["NotifySchedule"] = "msgNotifySchedule";
    SocketEventMessageCode["NotifyNewUser"] = "msgNotifyNewUser";
    SocketEventMessageCode["ClientConnection"] = "connect";
    SocketEventMessageCode["ClientConnecting"] = "connecting";
    SocketEventMessageCode["ClientReconnecting"] = "reconnecting";
})(SocketEventMessageCode = exports.SocketEventMessageCode || (exports.SocketEventMessageCode = {}));
var ServerEvents;
(function (ServerEvents) {
    ServerEvents["OnConnected"] = "OnConnected";
    ServerEvents["OnDisconnected"] = "OnDisconnected";
    ServerEvents["ScheduledEventStarted"] = "scheduledEventStarted";
})(ServerEvents = exports.ServerEvents || (exports.ServerEvents = {}));
