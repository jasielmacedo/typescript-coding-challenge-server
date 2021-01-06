import ServerService from './@services/server';
import EventsService from './@services/events';
import debug from 'debug';
import { ServerEvents } from './@models/Enums';
import moment from 'moment';
import { clearInterval } from 'timers';

const Debugger : debug.Debugger = debug("entry");

ServerService.start();

var haveInterval = false;
var intervalId : NodeJS.Timeout;

ServerService.addListener(ServerEvents.OnConnected, () => {
    
    Debugger("Server started and running");

    if(haveInterval)
    {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        EventsService.check();
    },900);

    haveInterval = true;
});
    
