import { invokeApi } from "../bl_libs/invokeApi";


export const login = async (data) => {
  const requestObj = {
    path: `api/app_api/login`,
    method: "POST",
  
    postData: data,
  };
  return invokeApi(requestObj);
};

export const register = async (data) => {
  const requestObj = {
    path: `api/customer/signup_customer`,
    method: "POST",
    
    postData: data,
  };
  return invokeApi(requestObj);
};
