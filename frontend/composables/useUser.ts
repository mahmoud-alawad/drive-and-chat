type UserType = {
  name: string;
  email: string;
  id: string;
};
export const useUser = () => {
  const user = ref<UserType | null>();
  const token = ref<string | null>();

  const userStorage = localStorage.getItem("user");
  const tokenStorage = localStorage.getItem("token");

  const setToken = (value: string) =>
    localStorage.setItem("token", value as string);

  const getToken = () => localStorage.getItem("token");
  token.value = getToken() as string;

  const removeToken = () => localStorage.removeItem("token");

  const setUser = (newUserValue: UserType) => {
    user.value = newUserValue;
    localStorage.setItem("user", JSON.stringify(newUserValue));
  };

  const removeUser = () => {
    user.value = null;
    localStorage.removeItem("user");
    removeToken();
  };

  if (userStorage) {
    setUser(JSON.parse(userStorage) as UserType);
  }

  if (tokenStorage) {
    setToken(tokenStorage);
  }
  return { token, user, setUser, removeUser, removeToken, setToken, getToken };
};
