import { invokeApi } from "../bl_libs/invokeApi";


export const get_customer_list = async (data) => {
  const requestObj = {
    path: `api/customer/get_customers`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const get_profile = async (data) => {
  const requestObj = {
    path: `api/customer/detail_customer`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
