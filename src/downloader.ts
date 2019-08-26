const streamSaver = require("streamsaver");

const enum DLSTATE {
    INIT = 0,
    RUNNING = 1,
    FINISHED = 2
}

interface QueueData {offset:number, data:ArrayBuffer}

class Downloader{
    filename:string;
    state:DLSTATE;
    dataQueue:QueueData[] = [];
    //stream:
    Downloader(fileName:string){
        this.filename = fileName;
        this.state = DLSTATE.INIT;
    }

    start(){
        this.state = DLSTATE.RUNNING;
        let enqueue = (controller:ReadableStreamDefaultController) => {
            if(this.state == DLSTATE.FINISHED) { 
                controller.close();
                return;
            }

            if(this.dataQueue.length == 0){
                return;
            }
            controller.enqueue(this.dataQueue.pop());

        }
        let close = () => {
            this.state = DLSTATE.FINISHED;
        }
        enqueue = enqueue.bind(this);
        close = close.bind(this);



        const stream = new ReadableStream({
            start(controller) {
                enqueue(controller);
            },
            pull(controller) {
                enqueue(controller);
            },
            cancel() {
                close();
            }
          });
          const fileStream = streamSaver.createWriteStream(this.filename);
          stream.pipeTo(fileStream);
    }


}