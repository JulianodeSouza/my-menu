import axios from "axios";

export async function get(url: string, params?: any): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    const headers = getHeaders();

    if (params) {
      params = "?" + new URLSearchParams(params).toString();
    } else {
      params = "";
    }

    axios
      .get(getUrlBase() + url + params, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}

export async function post(url: string, data?: any): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    const headers = getHeaders();

    axios
      .post(getUrlBase() + url, data, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}

export async function put(url: string, data: any): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    const headers = getHeaders();

    axios
      .put(getUrlBase() + url, data, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}

export async function remove(url: string): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}

function getUrlBase(): string {
  if (!__DEV__) {
    return "";
  }

  return "http://10.0.2.2:21000/";
}

function getHeaders(): Object {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  return headers;
}
