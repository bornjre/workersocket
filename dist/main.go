package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "localhost:8080", "http service address")
var p = log.Println

var upgrader = websocket.Upgrader{} // use default options

func echo(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		p("upgrade:", err)
		return
	}
	p("new ws connection.")
	defer c.Close()

	ticker := time.NewTicker(2 * time.Second)

	go func() {
		for {
			<-ticker.C

			c.WriteMessage(websocket.BinaryMessage, []byte("Hello"))

			/*err = c.WriteMessage()
			if err != nil {
				p("write:", err)
				break
			} */
		}
	}()

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			p("read:", err)
			break
		}
		p("recv: %s", message)

	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/echo", echo)
	http.Handle("/", http.FileServer(http.Dir(".")))
	p(http.ListenAndServe(*addr, nil))
}
