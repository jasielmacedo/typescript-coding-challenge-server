import { expect,assert  } from 'chai';
import SocketIoClient from 'socket.io-client';
import moment from 'moment';

import '../src/entry';
import { SocketEventMessageCode } from '../src/@models/Enums';
import { EventScheduleModel } from '../src/@models/Data';
import fs from 'fs';

describe('Server Testing', () => {

    beforeEach(done => setTimeout(done, 1000));

    var conn : SocketIOClient.Socket;

    it('Should connect with Server',(done : Mocha.Done) => {
        conn = SocketIoClient("http://localhost:5000");
        conn.on('connect',()=> {
            expect(conn.id).is.not.empty;
            done();
        })
    });

    var currentDateSaved : Date;
    var eventName = 'evnt';
    var eventAfter = 'evntafter';

    it('Should schedule and receive event after 2 second', (done : Mocha.Done) => {
        

        conn.on(SocketEventMessageCode.NotifySchedule,(msg : EventScheduleModel) => {
            expect(msg).is.not.null
            expect(msg.name).is.equal(eventName);

            conn.close();
            done();
        });

        let currentDate = moment();
        currentDate.add(2,'seconds');
        currentDateSaved = currentDate.toDate();

        let event : EventScheduleModel = {
            name : eventName,
            date : currentDateSaved
        }

        conn.emit(SocketEventMessageCode.Schedule,event);

        currentDate.add(2,'seconds');

        event.name = eventAfter;
        event.date = currentDate.toDate();

        conn.emit(SocketEventMessageCode.Schedule,event);
    });

    it('Should connect and receive scheduled event', (done : Mocha.Done) => {
        const conn2 : SocketIOClient.Socket = SocketIoClient("http://localhost:5000");
        conn2.on('connect',() => {
            expect(conn2.id).is.not.empty;

            conn2.on(SocketEventMessageCode.NotifySchedule,(msg : EventScheduleModel) => {
                expect(msg).is.not.null
                expect(msg.name).is.equal(eventAfter);
                conn2.close();
                done();
            });
        })
    });
    
});