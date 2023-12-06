import { useToken } from "./useToken";

export const useApi = (
  request: string,
  fetchOptions: { [key: string]: any } = {}
) => {
  const apiUrl = "http://0.0.0.0:3001/api/";
  const { token } = useToken();

  fetchOptions.headers = {
    ...fetchOptions.headers,
  };
  if (token && token.value) {
    fetchOptions.headers = {
      ...fetchOptions?.headers,
      Authorization: `Bearer ${token.value}`,
    };
  }
  return $fetch(apiUrl + request, { ...fetchOptions });
};
