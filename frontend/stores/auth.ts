// stores/counter.js
import { defineStore } from "pinia";

export type UserType = {
  id: string;
  username: string;
  password: string;
  email: string;
  images?: any;
  reciverMessages?: any;
  senderMessages?: any;
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserType>();
  const users = ref<UserType[]>();
  const authenticated = ref<boolean>();
  const token = ref<string>();
  const loading = ref<boolean>();
  const error = ref<any>();
  const config = useRuntimeConfig();
  console.log(config);

  const iUser = computed(() => {
    return user.value ? user.value : false;
  });

  const setUser = (userData: UserType) => {
    user.value = userData;
  };

  const login = async (payload: Omit<UserType, "id" | "username">) => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useFetch(config.public.apiUrl + "/api/auth/login", {
      method: "POST",
      body: {
        email: payload.email,
        password: payload.password,
      },
    });
    error.value = fetchError.value;
    loading.value = pending;
    if (data.value) {
      const _tokenCookie = useCookie("token"); // useCookie new hook in nuxt 3
      const _userIdCookie = useCookie("userId"); // useCookie new hook in nuxt 3
      _tokenCookie.value = data?.value?.token; // set token to cookie
      _userIdCookie.value = data?.value?.user.id; // set token to cookie
      authenticated.value = true; // set authenticated  state value to true
    }
    return data;
  };

  const register = async (payload: Omit<UserType, "id">) => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useFetch(config.public.apiUrl + "/api/auth/register", {
      method: "POST",
      body: payload,
    });
    error.value = fetchError.value;
    loading.value = pending;
    if (data.value) {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      token.value = data?.value?.token; // set token to cookie
      authenticated.value = true; // set authenticated  state value to true
    }
    return data;
  };

  const logout = () => {
    const token = useCookie("token"); // useCookie new hook in nuxt 3
    authenticated.value = false; // set authenticated  state value to false
    token.value = null; // clear the token cookie
  };

  const getUsers = async () => {
    const {
      data,
      pending,
      error: fetchError,
    } = await useFetch(config.public.apiUrl + "/api/user/users", {
      headers: {
        Authorization: "Bearer " + useCookie("token").value,
      },
    });

    error.value = fetchError.value;
    loading.value = pending.value;
    if (data && data.value) {
      users.value = data.value as UserType[];
      return data.value;
    }
    return [];
  };

  const getUserById = async (userId: string) => {
    if (!users.value) {
      await getUsers();
    }
    if (users.value && users.value.length) {
      return users.value.find((user: UserType) => user.id === userId);
    }
  };
  const authenticateUser = async () => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useFetch(config.public.apiUrl + "/api/user/me", {
      method: "get",
      headers: {
        Authorization: "Bearer " + useCookie("token").value,
      },
    });
    error.value = fetchError.value;
    loading.value = pending.value;
    setUser(data.value);

    return data;
  };

  return {
    user,
    users,
    token,
    iUser,
    error,
    loading,
    authenticated,
    login,
    register,
    logout,
    authenticateUser,
    setUser,
    getUsers,
    getUserById,
  };
});
