import Vue from "vue";
import Cookies from "js-cookie";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import Element from "element-ui";
import "./styles/element-variables.scss";
import "@/styles/index.scss"; // global css
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
//初始化websocket
// websocket   配置
// const socketOptions = {
//   autoConnect: false, // 是否自动连接 如果为false在指定情况下手动触发才连接socket，（this.$socket.open() // 开始连接socket
//   //path: "/my-app/"  // 定义socket后面的路径，不写默认路径为/socket.io
//   transports: ["websocket"]
// };
// let vueSocketIo = new VueSocketIO({
//   debug: true, // debug调试，生产关闭
//   connection: SocketIO.connect("ws://47.111.178.57:8282", socketOptions)
//   // connection: SocketIO("/socket.io", socketOptions),
// });
// vueSocketIo.io.on("connect", () => {
//   console.log("socket connect from main.js");
// });
// Vue.use(vueSocketIo);

import App from "./App";
import store from "./store";
import router from "./router";
import Vconsole from "vconsole";
import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log
import * as filters from "./filters"; // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
});
// const vConsole = new Vconsole()
// Vue.use(vConsole)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
