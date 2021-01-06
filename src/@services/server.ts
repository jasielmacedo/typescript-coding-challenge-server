import express from "express";
import { createServer, Server } from 'http';
import socketIoServer, { Socket } from 'socket.io';
import { SocketEventMessageCode, ServerEvents } from "../@models/Enums";
import { Dictionary } from 'typescript-collections';
import { EventScheduleModel } from "../@models/Data";
import EventsService from './events';
import path from 'path';

import debug from 'debug';
import DispatcherService from "./dispatcher";
const Debugger : debug.Debugger = debug("server");

export default new class ServerService extends DispatcherService
{
    public app: express.Application;
    public server: Server;
    private io: socketIoServer.Server;
    public PORT: number = 5000;

    public connections : Dictionary<string,Socket> = new Dictionary<string,Socket>();

    public constructor()
    {
        super();
        this.app = express();

        this.server = createServer(this.app);
        this.io = socketIoServer(this.server);

        this.listen();

        EventsService.addListener(ServerEvents.ScheduledEventStarted,this.sendToAllUsers);
    }

    public start() : Server
    {
        return this.server.listen(this.PORT, () => 
        {
            Debugger(`server running in http://localhost:${this.PORT}`);
            this.dispatch(ServerEvents.OnConnected);
        });
    }

    private listen(): void 
    {
        this.io.on(SocketEventMessageCode.ServerConnection, (socket: Socket) => 
        {
            this.connections.forEach((key : string, sock : Socket) => 
            {
                sock.emit(SocketEventMessageCode.NotifyNewUser);
            })

            this.connections.setValue(socket.id,socket);

            Debugger("new user connected. Total: "+this.connections.size());

            socket.on(SocketEventMessageCode.Schedule,(msg  : EventScheduleModel) => 
            {
                Debugger("new event to schedule: "+msg.name);

                EventsService.add(msg);               
                EventsService.save();
            });

            socket.on(SocketEventMessageCode.Disconnect,() => 
            {
                this.connections.remove(socket.id);
            });
            
        });
    }

    sendToAllUsers = (events : EventScheduleModel[]) =>
    {
        events.forEach((event: EventScheduleModel) => 
        {
            this.io.emit(SocketEventMessageCode.NotifySchedule,event);
        })
    }
}