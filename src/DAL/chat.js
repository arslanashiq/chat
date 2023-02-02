import { invokeApi } from "../bl_libs/invokeApi";

export const send_message = async (data) => {
  const requestObj = {
    path: `api/chat/send_message`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_chat_by_id = async (id, data) => {
  const requestObj = {
    path: `api/chat/list_message/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const start_chat = async (data) => {
  const requestObj = {
    path: `api/chat`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const get_chat_list = async (data) => {
  const requestObj = {
    path: `api/chat/list_chat`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const remove_message_from_chat = async (id, data) => {
  const requestObj = {
    path: `api/chat/delete_message/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
