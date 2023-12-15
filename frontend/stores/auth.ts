import { acceptHMRUpdate, defineStore } from "pinia";

export type UserType = {
  id: string;
  username: string;
  password: string;
  email: string;
  images?: any;
  reciverMessages?: any;
  senderMessages?: any;
  previewMessages?: any;
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserType>();
  const userImages = ref<any>([]);
  const users = ref<UserType[]>();
  const authenticated = ref<boolean>();
  const token = ref<string>();
  const loading = ref<boolean>(false);
  const error = ref<any>();
  const onlineUsers = ref<string[]>();

  const iUser = computed(() => {
    return user.value ? user.value : false;
  });

  const setUser = (userData: UserType) => {
    user.value = userData;
  };

  const normalizeResponse = ({ data, pending, fetchError }: any) => {
    if (data.value) {
      loading.value = false;
      error.value = null;
    }
    loading.value = !!pending.value;
    if (fetchError.value) {
      error.value = fetchError.value;
    }
  };

  const login = async (payload: Omit<UserType, "id" | "username">) => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useApi("/api/auth/login", {
      method: "POST",
      body: {
        email: payload.email,
        password: payload.password,
      },
    });

    normalizeResponse({ data, pending, fetchError });

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
    }: any = await useApi("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    normalizeResponse({ data, pending, fetchError });

    if (data.value) {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      token.value = data?.value?.token; // set token to cookie
      authenticated.value = true; // set authenticated  state value to true
    }
    return { data, error };
  };

  const logout = () => {
    const token = useCookie("token"); // useCookie new hook in nuxt 3
    const userId = useCookie("userId"); // useCookie new hook in nuxt 3
    authenticated.value = false; // set authenticated  state value to false
    token.value = null; // clear the token cookie
    userId.value = null; // clear the token cookie
  };

  const updateUser = async (payload: Omit<UserType, "id" | "password">) => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useApi("/api/user", {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
      method: "PUT",
      body: payload,
    });
    normalizeResponse({ data, pending, fetchError });

    if (data.value) {
      setUser(data.value as UserType);
    }
    return { data, error, pending };
  };

  const deleteAccount = async () => {
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useApi("/api/user", {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
      method: "DELETE",
    });
    normalizeResponse({ data, pending, fetchError });

    if (data.value) {
      user.value = undefined;
      const tok = useCookie("token");
      tok.value = null;
    }
    return { data, error, pending };
  };

  const getUsers = async () => {
    const {
      data,
      pending,
      error: fetchError,
    } = await useApi("/api/user/users");

    normalizeResponse({ data, pending, fetchError });

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
      refresh,
    } = await useApi("/api/user/me");
    console.log(data);

    normalizeResponse({ data, pending, fetchError });

    setUser(data.value as any);
    return { data, fetchError, refresh };
  };

  const nomalizeImage = async (filename?: string) => {
    const baseUrl = `/api/user/images/${filename}` as string;
    const {
      data,
      pending,
      error: fetchError,
    }: any = await useApi(baseUrl, {
      query: {
        filename,
      },
    });

    normalizeResponse({ data, pending, fetchError });

    if (data.value) {
      return { url: URL.createObjectURL(data.value) };
    }

    return {
      pending,
      error,
    };
  };

  const normalizeImages = async () => {
    userImages.value = [];
    const { data: userData, refresh } = await authenticateUser();
    const realWithType = userData.value as UserType;
    if (realWithType) {
      realWithType?.images?.forEach(async (image: any) => {
        const { url }: any = await nomalizeImage(image.filename);
        userImages.value.push({ ...image, url });
      });
    } else {
      refresh();
    }
  };

  return {
    user,
    userImages,
    users,
    token,
    iUser,
    error,
    loading,
    authenticated,
    onlineUsers,
    deleteAccount,
    login,
    register,
    logout,
    authenticateUser,
    updateUser,
    setUser,
    getUsers,
    getUserById,
    nomalizeImage,
    normalizeImages,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
