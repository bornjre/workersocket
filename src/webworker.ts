onmessage = function(message){
    const sendMessage: any = self.postMessage;
    const tag = message.data.tag;
    let data = {};
    
    switch (tag) {
        case "wsraw":
          let parsed = parsePacket(message.data.actualdata);
          data = {
              tag:tag,
              message:parsed
          }
          sendMessage(data);
          break;
        case "encode":
          encodeMsg();
          break;
        default:
            console.log("Not implemented");
            break;
    }
}

const  CMD_DOWNLOAD_SERVICE = 15;
function parsePacket(arrbuf:ArrayBuffer):any {
    
        //let ubuff = new Uint8Array(data);
        let offset = arrbuf.byteLength - 4;
        let headerbuf = arrbuf.slice(offset, arrbuf.byteLength);
        let headerdataview = new DataView(headerbuf, 0);
        let connid = headerdataview.getUint16(0);
        let cmdtype = headerdataview.getUint8(2);
        let flow = headerdataview.getUint8(3);
        let header = {
          connid: connid,
          flow: flow,
          cmdtype: cmdtype,
          //rawstr:"",
          ehead:{}
        };
      
        let bodybuff;
        //string/json
        var response;
      
        //console.log("Cmdtype :", cmdtype);
      
        if (cmdtype == CMD_DOWNLOAD_SERVICE) {
          let eheadbuff = arrbuf.slice(offset - 10, offset);
          let eheaddv = new DataView(eheadbuff,0);
      
          let eoffset = 0;//eheaddv.getBigInt64(0, false);
          let eflag = eheaddv.getUint8(8);
          let eid = eheaddv.getUint8(9);
          header.ehead = { eoffset: eoffset, eflag: eflag, eid: eid, Finished:eflag == 9 };
          //console.log(header.ehead);
          bodybuff = arrbuf.slice(0, offset - 10);
      
        if ("TextDecoder" in window) {
          let _tdv = new DataView(bodybuff);
          var decoder = new TextDecoder("utf-8");
          //let rawstr = decoder.decode(_tdv);
          //header.rawstr = rawstr;
          }

          return { 
              cmdtype:cmdtype,
              head:header,
              body:bodybuff
            }
        }
      
        bodybuff = arrbuf.slice(0, offset);
        let bodydataview = new DataView(bodybuff);
      
        if ("TextDecoder" in window) {
          var decoder = new TextDecoder("utf-8");
          let rawstr = decoder.decode(bodydataview);
          //console.log("RAWSTR:", rawstr);
          
          response = JSON.parse(rawstr);
        } else {
          console.log("OLD BROWSER");
          let decodedString = String.fromCharCode.apply(
            null,
            new Uint8Array(bodybuff)
          );
          response = JSON.parse(decodedString);
        }
        //{"cmd":1, data:{}}
        return {
            cmdtype:cmdtype,
            head:header,
            body:response
          }
}

export function encodeMsg() {
}