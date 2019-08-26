/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wrapsocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrapsocket */ "./src/wrapsocket.ts");

console.log("__loaded__");
var wrap;
onload = function () {
    wrap = new _wrapsocket__WEBPACK_IMPORTED_MODULE_0__["WrapSocket"]("ws://localhost:8080/echo", true);
    var id = wrap.registerCallback(1, function (msg) {
        console.log("yep!");
    });
    console.log(id);
};


/***/ }),

/***/ "./src/wrapsocket.ts":
/*!***************************!*\
  !*** ./src/wrapsocket.ts ***!
  \***************************/
/*! exports provided: WrapSocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WrapSocket", function() { return WrapSocket; });
var WrapSocket = /** @class */ (function () {
    function WrapSocket(url, logging) {
        this.callbacks = {};
        //this.callbacks[Command.CMD_HELLO] = [function(m){}]
        //console.log(this.callbacks);
        // setup logging
        this.logging = logging ? logging : false;
        //setup webworker
        this.worker = new Worker("webworker.js");
        this.worker.onmessage = this.messageFromWebworker.bind(this);
        //setup websocket
        this.ws = new WebSocket(url);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onmessage = this.messageFromWebsocket.bind(this);
    }
    WrapSocket.prototype.p = function (message) {
        if (this.logging) {
            console.log(message);
        }
    };
    WrapSocket.prototype.messageFromWebworker = function (event) {
        var _this = this;
        //this.p(event);
        var response = { "cmd": 1, data: {} };
        if (response.cmd in this.callbacks) {
            this.p("it has");
            var funcs_1 = this.callbacks[response.cmd];
            Object.keys(funcs_1).forEach(function (fkey) {
                //func(response.data);
                _this.p("calling");
                funcs_1[fkey](response.data);
            });
        }
    };
    WrapSocket.prototype.messageFromWebsocket = function (event) {
        var out = { tag: "wsraw", actualdata: event.data };
        this.p("Recived from ws");
        //this.p(event);
        //this.p(out);
        this.worker.postMessage(out, [out.actualdata]);
    };
    WrapSocket.prototype.registerCallback = function (cmdType, callback) {
        var funcs = {};
        if (cmdType in this.callbacks) {
            funcs = this.callbacks[cmdType];
        }
        else {
            this.callbacks[cmdType] = funcs;
        }
        var id = Object.keys(funcs).length;
        funcs[id] = callback;
        return id;
    };
    WrapSocket.prototype.unregisterCallback = function (cmdType, id) {
        if (cmdType in this.callbacks) {
            var funcs = this.callbacks[cmdType];
            if (id in funcs) {
                delete funcs[id];
            }
        }
    };
    return WrapSocket;
}());



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy93cmFwc29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUF5QztBQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUV6QixJQUFJLElBQUksQ0FBQztBQUVULE1BQU0sR0FBRztJQUNMLElBQUksR0FBRyxJQUFJLHNEQUFVLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFFLENBQUM7SUFFekQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBQyxVQUFTLEdBQUc7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVwQixDQUFDOzs7Ozs7Ozs7Ozs7O0FDTEQ7QUFBQTtBQUFBO0lBTUksb0JBQVksR0FBVyxFQUFFLE9BQWdCO1FBRnpDLGNBQVMsR0FBZSxFQUFFLENBQUM7UUFHdkIscURBQXFEO1FBQ3JELDhCQUE4QjtRQUM5QixnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQUssQ0FBQztRQUV4QyxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdELGlCQUFpQjtRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxzQkFBQyxHQUFELFVBQUUsT0FBWTtRQUNWLElBQUcsSUFBSSxDQUFDLE9BQU8sRUFBQztZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRUQseUNBQW9CLEdBQXBCLFVBQXFCLEtBQWtCO1FBQXZDLGlCQWVDO1FBZEcsZ0JBQWdCO1FBQ2hCLElBQUksUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDO1FBRWpDLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakIsSUFBSSxPQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFekMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFRO2dCQUNoQyxzQkFBc0I7Z0JBQ3RCLEtBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xCLE9BQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUNBLENBQUM7U0FDTDtJQUNMLENBQUM7SUFFRCx5Q0FBb0IsR0FBcEIsVUFBcUIsS0FBa0I7UUFDbkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQy9DLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMxQixnQkFBZ0I7UUFDaEIsY0FBYztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxxQ0FBZ0IsR0FBaEIsVUFBa0IsT0FBZSxFQUFDLFFBQXFCO1FBQ25ELElBQUksS0FBSyxHQUFrQixFQUFFLENBQUM7UUFDOUIsSUFBRyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBQztZQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDbkM7UUFFRCxJQUFNLEVBQUUsR0FBVSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07UUFDM0MsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUNyQixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCx1Q0FBa0IsR0FBbEIsVUFBbUIsT0FBZSxFQUFFLEVBQVM7UUFDekMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMzQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLElBQUcsRUFBRSxJQUFJLEtBQUssRUFBQztnQkFDWCxPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7YUFDbkI7U0FDSjtJQUNMLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgV3JhcFNvY2tldCB9IGZyb20gJy4vd3JhcHNvY2tldCdcblxuY29uc29sZS5sb2coXCJfX2xvYWRlZF9fXCIpXG5cbmxldCB3cmFwO1xuXG5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB3cmFwID0gbmV3IFdyYXBTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4MDgwL2VjaG9cIiwgdHJ1ZSApO1xuXG4gICAgbGV0IGlkID0gd3JhcC5yZWdpc3RlckNhbGxiYWNrKDEsZnVuY3Rpb24obXNnKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJ5ZXAhXCIpXG4gICAgfSlcblxuICAgIGNvbnNvbGUubG9nKGlkKTtcbiAgICBcbn0iLCJcbmV4cG9ydCB0eXBlIENhbGxiYWNrRnVuYyA9IChtZXNzYWdlOmFueSkgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCBlbnVtIENvbW1hbmQge1xuICAgIENNRF9IRUxMTyA9IDAsXG4gICAgQ01EX0hFTExPX1JFUExZID0xXG59XG5cbmludGVyZmFjZSBjYWxsYmFja3NQZXJJZCB7W2lka2V5Om51bWJlcl06Q2FsbGJhY2tGdW5jfVxuaW50ZXJmYWNlIGNhbGxiYWNrTWFwIHtbY21kOm51bWJlcl06IGNhbGxiYWNrc1BlcklkfVxuXG5leHBvcnQgY2xhc3MgV3JhcFNvY2tldCB7XG4gICAgd3M6V2ViU29ja2V0O1xuICAgIHdvcmtlcjpXb3JrZXI7XG4gICAgbG9nZ2luZzpib29sZWFuO1xuICAgIGNhbGxiYWNrczpjYWxsYmFja01hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGxvZ2dpbmc/OmJvb2xlYW4pIHtcbiAgICAgICAgLy90aGlzLmNhbGxiYWNrc1tDb21tYW5kLkNNRF9IRUxMT10gPSBbZnVuY3Rpb24obSl7fV1cbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmNhbGxiYWNrcyk7XG4gICAgICAgIC8vIHNldHVwIGxvZ2dpbmdcbiAgICAgICAgdGhpcy5sb2dnaW5nID0gbG9nZ2luZyA/IGxvZ2dpbmcgOmZhbHNlO1xuICAgICAgICBcbiAgICAgICAgLy9zZXR1cCB3ZWJ3b3JrZXJcbiAgICAgICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKFwid2Vid29ya2VyLmpzXCIpO1xuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VGcm9tV2Vid29ya2VyLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy9zZXR1cCB3ZWJzb2NrZXRcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgdGhpcy53cy5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VGcm9tV2Vic29ja2V0LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcChtZXNzYWdlPzphbnkpIHtcbiAgICAgICAgaWYodGhpcy5sb2dnaW5nKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICB9ICAgXG4gICAgfVxuXG4gICAgbWVzc2FnZUZyb21XZWJ3b3JrZXIoZXZlbnQ6TWVzc2FnZUV2ZW50KXtcbiAgICAgICAgLy90aGlzLnAoZXZlbnQpO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB7XCJjbWRcIjoxLCBkYXRhOnt9fVxuICAgICAgICBcbiAgICAgICAgaWYoIHJlc3BvbnNlLmNtZCBpbiB0aGlzLmNhbGxiYWNrcyApe1xuICAgICAgICAgICAgdGhpcy5wKFwiaXQgaGFzXCIpO1xuICAgICAgICAgICAgbGV0IGZ1bmNzID0gdGhpcy5jYWxsYmFja3NbcmVzcG9uc2UuY21kXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZnVuY3MpLmZvckVhY2goKGZrZXk6YW55KSA9PiB7XG4gICAgICAgICAgICAgICAgLy9mdW5jKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMucChcImNhbGxpbmdcIik7XG4gICAgICAgICAgICAgICAgZnVuY3NbZmtleV0ocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWVzc2FnZUZyb21XZWJzb2NrZXQoZXZlbnQ6TWVzc2FnZUV2ZW50KXtcbiAgICAgICAgbGV0IG91dCA9IHsgdGFnOlwid3NyYXdcIixhY3R1YWxkYXRhOmV2ZW50LmRhdGEgfVxuICAgICAgICB0aGlzLnAoXCJSZWNpdmVkIGZyb20gd3NcIik7XG4gICAgICAgIC8vdGhpcy5wKGV2ZW50KTtcbiAgICAgICAgLy90aGlzLnAob3V0KTtcbiAgICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoIG91dCwgW291dC5hY3R1YWxkYXRhXSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJDYWxsYmFjayggY21kVHlwZTpDb21tYW5kLGNhbGxiYWNrOkNhbGxiYWNrRnVuYyApOm51bWJlcntcbiAgICAgICAgbGV0IGZ1bmNzOmNhbGxiYWNrc1BlcklkID0ge307XG4gICAgICAgIGlmKGNtZFR5cGUgaW4gdGhpcy5jYWxsYmFja3Mpe1xuICAgICAgICAgICAgZnVuY3MgPSB0aGlzLmNhbGxiYWNrc1tjbWRUeXBlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzW2NtZFR5cGVdID0gZnVuY3M7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpZDpudW1iZXIgPSBPYmplY3Qua2V5cyhmdW5jcykubGVuZ3RoXG4gICAgICAgIGZ1bmNzW2lkXSA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckNhbGxiYWNrKGNtZFR5cGU6Q29tbWFuZCwgaWQ6bnVtYmVyKXtcbiAgICAgICAgaWYoIGNtZFR5cGUgaW4gdGhpcy5jYWxsYmFja3MgKXtcbiAgICAgICAgICAgIGxldCBmdW5jcyA9IHRoaXMuY2FsbGJhY2tzW2NtZFR5cGVdO1xuICAgICAgICAgICAgaWYoaWQgaW4gZnVuY3Mpe1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBmdW5jc1tpZF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9