// 定义响应的数据类型
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

const BASE_URL = '/api';
// 定义请求参数的类型
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any;
}

// 封装 fetch 请求
export const request = async <T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers, body } = options;

  // 默认请求头
  const defaultHeaders = {
    ...headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: defaultHeaders,
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', (error as Error).message);
    throw error; // 抛出错误
  }
};

// GET 请求封装
export const get = <T>(url: string, data?:any,headers?: Record<string, string>): Promise<ApiResponse<T>> => {
  return request<T>(url+'?'+(new URLSearchParams(data)), {
    method: 'GET',
    headers,
  });
};

// POST 请求封装
export const post = <T>(url: string, body: any, headers?: Record<string, string>): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    method: 'POST',
    headers,
    body:JSON.stringify(body),
  });
};

// 其他方法封装 PUT、DELETE
export const put = <T>(url: string, body: any, headers?: Record<string, string>): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    method: 'PUT',
    headers,
    body,
  });
};

export const del = <T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    method: 'DELETE',
    headers,
  });
};