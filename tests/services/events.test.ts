import EventsService from "../../src/@services/events";
import { expect } from 'chai';
import fs from 'fs';
import moment from "moment";

describe("EventsService Class", () => 
{
    it("Shouldn't return error during saving", (done : Mocha.Done) => {
        EventsService.save().then((res : Boolean)=> {

            expect(res).to.be.true;

            fs.exists(__dirname + "/../../data/events.json",(fileExists) => {

                expect(fileExists).to.be.true;
                done();
            });

        }).catch((err)=>{
            done(err);
        });

        
    })

    it("Should add without error", (done : Mocha.Done) => {
        EventsService.add({
            name : 'Test2',
            date : moment().add(1,'year').toDate()
        });

        done();
    });

    it('The data file should exist and be persistent and the array should be greater than 0', (done : Mocha.Done) => {

        EventsService.add({
            name : 'Test3 One Year Later',
            date : moment().add(1,'year').toDate()
        });

        EventsService.save().then((res : Boolean)=> 
        {
            fs.readFile(__dirname + "/../../data/events.json",(err, data) => 
            {
                expect(err).to.be.null
                expect(data.toString()).is.not.empty
    
                let obj = JSON.parse(data.toString());
                
                expect(obj).not.be.null
                expect(obj.length).not.be.undefined
                expect(obj.length).to.be.greaterThan(0);
    
                done();
            });
        }).catch((err) => {
            done(err);
        });

        
    });
});