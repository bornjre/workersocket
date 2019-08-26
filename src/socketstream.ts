
class SocketStream implements ReadableStream<any>{
    readonly locked: boolean;
    SocketStream(){

    }

    cancel(reason?: any): Promise<void>{
        //let p = new Promise<void>(function(){
        //})
        return null
    }
    /*
    getReader(options: { mode: "byob" }): ReadableStreamBYOBReader{
        return null
    }*/

    getReader(): ReadableStreamDefaultReader<any>{return null}
    pipeThrough<T>({ writable, readable }: 
        { writable: WritableStream<any>, readable: ReadableStream<T> },
         options?: PipeOptions): ReadableStream<any>{
             return null
         }
    pipeTo(dest: WritableStream<any>, options?: PipeOptions): Promise<void>{ return null}
    tee(): [ReadableStream<any>, ReadableStream<any>]{return null}
}