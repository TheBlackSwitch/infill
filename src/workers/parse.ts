import * as YAMP from "@theblackswitch/yamp"

// Look at this puny tiny bit of code

self.onmessage = (e) => {
    const result = YAMP.parse(e.data);
    console.log(result);
    self.postMessage(result);
}