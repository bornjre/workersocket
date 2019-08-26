import { WrapSocket } from './wrapsocket'

console.log("__loaded__")

let wrap;

onload = function() {
    wrap = new WrapSocket("ws://localhost:8080/echo", true );

    let id = wrap.registerCallback(1,function(msg){
        console.log("yep!")
    })

    console.log(id);
    
}