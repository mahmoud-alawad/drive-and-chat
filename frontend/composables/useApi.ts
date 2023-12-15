export const useApi = (
  request: string,
  fetchOptions: { [key: string]: any } = {}
) => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const token = useCookie("token");

  fetchOptions.headers = {
    ...fetchOptions.headers,
  };

  fetchOptions.immediate = true;

  if (token && token.value) {
    fetchOptions.headers = {
      ...fetchOptions?.headers,
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token.value}`,
    };
  }

  return useFetch(apiUrl + request, { ...fetchOptions });
};
