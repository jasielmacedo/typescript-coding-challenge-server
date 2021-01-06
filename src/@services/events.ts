import { EventScheduleModel } from "../@models/Data";
import fs from 'fs';
import moment from 'moment';
import debug from 'debug';
import DispatcherService from "./dispatcher";
import { Dictionary } from "typescript-collections";
import { ServerEvents } from "../@models/Enums";
import { rejects } from "assert";

const Debugger : debug.Debugger = debug("server-events");


export default new class EventsService extends DispatcherService
{
    private scheduledMessages : Dictionary<string,Array<EventScheduleModel>> = new Dictionary<string,Array<EventScheduleModel>>();

    constructor()
    {
        super();
        this.scheduledMessages.clear();
        this.loadEvents();
    }

    private loadEvents() : void
    {
        fs.readFile(__dirname + "/../../data/events.json",(err, data) => {
            
            this.scheduledMessages.clear();
            if (err)
            {
               Debugger("error to read data: "+err);
            } else {
                try
                {
                    let listOfEvents = JSON.parse(data.toString());

                    if(listOfEvents instanceof Array)
                    {
                        listOfEvents.forEach((events : Array<EventScheduleModel>) => {
                            events.forEach((event : EventScheduleModel) => {
                                this.add(event);
                            });
                        });
                    }
                }catch(e)
                {   
                    this.scheduledMessages.clear();
                }               
            }
        });
    }

    private getCurrentKeyMoment(current : Date = new Date()) : string
    {
        return moment(current).format("YYYY-MM-DD-hh:mm:ss");
    }

    public add(event : EventScheduleModel) : void
    {
        let keyMoment = this.getCurrentKeyMoment(event.date);

        let currentListOfEvents : EventScheduleModel[] | undefined = this.scheduledMessages.getValue(keyMoment);
        
        if(currentListOfEvents != undefined && currentListOfEvents != null)
        {
            currentListOfEvents.push(event);
        }else{
            currentListOfEvents = new Array<EventScheduleModel>(event);
        }

        this.scheduledMessages.setValue(keyMoment, currentListOfEvents);     
    }

    public check = () =>
    {
        let currentMoment = this.getCurrentKeyMoment();
        if(this.scheduledMessages.containsKey(currentMoment))
        {
            let event = this.scheduledMessages.getValue(currentMoment);
            this.dispatch(ServerEvents.ScheduledEventStarted, event);

            this.scheduledMessages.remove(currentMoment);
            this.save();
        }
    }

    public save() : Promise<boolean>
    {
        let eventsString = JSON.stringify(this.scheduledMessages.values());
        
        return new Promise( (resolve : (res : boolean) => void, reject) => {
            fs.writeFile(__dirname + "/../../data/events.json",eventsString,(err) => {
                if(err)
                {
                    Debugger("error: "+err)
                    reject(err)
                    return;
                } 
                resolve(true);               
            });
        });
        
    }
}