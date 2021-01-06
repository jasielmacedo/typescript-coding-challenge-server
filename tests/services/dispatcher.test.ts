import DispatcherService from "../../src/@services/dispatcher";
import { expect } from 'chai';

describe("DispatcherService Class", () => 
{
    it('Should dispatch and listen events', (done : Mocha.Done) => 
    {
        const dispatcher = new DispatcherService();

        dispatcher.addListener("event1", (val : any) => 
        {
            expect(val).to.equal("success");
            done();
        });

        dispatcher.dispatch("event1","success");
    })

    it('Should remove events', (done : Mocha.Done) => 
    {
        const dispatcher = new DispatcherService();

        var eventDisp = (val : any) => {}        

        dispatcher.addListener("event1", eventDisp);
        let removing = dispatcher.removeListener("event1", eventDisp);

        expect(removing).to.equal(true);
        
        done();
    })
})
