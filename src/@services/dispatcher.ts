export default class DispatcherService 
{
    _internalEvents: any;
  
    constructor() {
      this._internalEvents = {};
    }
  
    addListener(event: string, callback: (data?: any) => any) 
    {
      if (this._internalEvents[event] === undefined) {
        this._internalEvents[event] = {
          listeners: []
        };
      }
      this._internalEvents[event].listeners.push(callback);
    }
  
    removeListener(event: string, callback: (data?: any) => any)
    {
      if (this._internalEvents[event] === undefined) {
        return false;
      }
      this._internalEvents[event].listeners = this._internalEvents[event].listeners.filter(
        (listener: string) => {
          return listener.toString() !== callback.toString();
        }
      );

      return true;
    }
  
    dispatch(event: string, data?: any) 
    {
      if (this._internalEvents[event] === undefined) {
        return false;
      }
      this._internalEvents[event].listeners.forEach((listener: any) => {
        listener(data);
      });
    }
  }