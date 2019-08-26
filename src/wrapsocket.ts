
export type CallbackFunc = (message:any) => void;
export const enum Command {
    CMD_HELLO = 0,
    CMD_HELLO_REPLY =1
}

interface callbacksPerId {[idkey:number]:CallbackFunc}
interface callbackMap {[cmd:number]: callbacksPerId}

// TODO reconnect on network lost

export class WrapSocket {
    ws:WebSocket;
    worker:Worker;
    logging:boolean;
    callbacks:callbackMap = {};

    constructor(url: string, logging:boolean=true) {

        //setup webworker
        this.worker = new Worker("webworker.js");
        this.worker.onmessage = this.messageFromWebworker.bind(this);

        //setup websocket
        this.ws = new WebSocket(url);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onmessage = this.messageFromWebsocket.bind(this);
    }

    p(message?:any) {
        if(this.logging){
            console.log(message);
        }
    }

    messageFromWebworker(event:MessageEvent){
        let response = event.data.message;
        switch (event.data.tag) {
            case "wsraw":
                this._braodcast(response);
                break;
            case "encode":
                this.pushTowebsocket(response);
                break;
            default:
                break;
        }
    }

    _braodcast(response:any ){
        if( response.cmdtype in this.callbacks ){
            let funcs = this.callbacks[response.cmdtype];
            
            Object.keys(funcs).forEach((fkey:any) => {
                //func(response.data);
                this.p("calling");
                funcs[fkey](response.data);
            }
            );
        }
    }

    messageFromWebsocket(event:MessageEvent){
        let out = { tag:"wsraw",actualdata:event.data }
        this.p("Recived from ws");
        //this.p(event);
        //this.p(out);
        this.worker.postMessage( out, [out.actualdata]);
    }

    registerCallback( cmdType:Command,callback:CallbackFunc ):number{
        let funcs:callbacksPerId = {};
        if(cmdType in this.callbacks){
            funcs = this.callbacks[cmdType];
        } else {
            this.callbacks[cmdType] = funcs;
        }

        const id:number = Object.keys(funcs).length
        funcs[id] = callback;
        return id;
    }

    unregisterCallback(cmdType:Command, id:number){
        if( cmdType in this.callbacks ){
            let funcs = this.callbacks[cmdType];
            if(id in funcs){
                delete funcs[id]
            }
        }
    }

    pushTowebsocket(message:any){
        this.ws.send(message);
    }

    netWorkWatch(){
    // todo    
    }
}