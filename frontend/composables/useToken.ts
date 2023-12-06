export const useToken = () => {
  const token = ref<string>();
  const setTokent = (value: string) =>
    localStorage.setItem("token", value as string);
  const getToken = () => localStorage.getItem("token");
  token.value = getToken() as string;
  return { setTokent, token, getToken };
};
