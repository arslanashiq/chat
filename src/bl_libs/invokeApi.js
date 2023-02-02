// common business logic related util methods
import axios from "axios";


export const  base_uri ='http://192.168.100.48:1200/'

axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  base_url = base_uri,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const reqObj = {
    method,
    url: base_url + path,
    headers,
  };

  reqObj.params = queryParams;

  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }

  let results;

  console.log("<===REQUEST-OBJECT===>", reqObj);

  try {
    results = await axios(reqObj);
    console.log("<===Api-Success-Result===>", results);

    return results.data;
  } catch (error) {
    console.log("<===Api-Error===>", reqObj, error.response.data);

    if (error.response.status === 401) {
      // localStorage.clear();
      // window.location.reload();
    }
    return {
      code: error.response.status,
      message: error.response.data.message ? error.response.data.message : "",
    };
  }
}
