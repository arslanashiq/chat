import { base_uri, invokeApi } from "../bl_libs/invokeApi";
// socket
import io from "socket.io-client";
let socket = io();

export const connect_socket = (user_id) => {
  socket = io(`${base_uri}?user_id=${user_id}`);
  return socket;
};

export const _on_socket_listner = (listner_name, handleListner,options) => {
  socket.on(listner_name, handleListner,options);
};

export const _emit_socket_listner = (listner_name, value) => {
  socket.emit(listner_name, value);
};
