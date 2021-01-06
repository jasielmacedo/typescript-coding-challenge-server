  

export enum SocketEventMessageCode
{
    ServerConnection = "connection",

    Disconnect = "disconnect",
    ConnectionError = "connect_error",

    Schedule = "msgSchedule",
    
    NotifySchedule = "msgNotifySchedule",
    NotifyNewUser = "msgNotifyNewUser",

    ClientConnection  = "connect",
    ClientConnecting = "connecting",
    ClientReconnecting = "reconnecting",
}

export enum ServerEvents
{
    OnConnected = "OnConnected",
    OnDisconnected = "OnDisconnected",
    ScheduledEventStarted = "scheduledEventStarted"
}