const nuxtConfig = () => {
  const config = useRuntimeConfig();
  const token = useCookie("token");

  return { config, token };
};

export const imageNormalizer = async (imagePath: string) => {
  const { config, token } = nuxtConfig();
  const baseUrl = config.public.apiUrl + "/uploads/";
  const { data, error } = await useFetch(baseUrl + imagePath, {
    headers: new Headers({
      Authorization: "Bearer " + token.value,
    }),
  });
  console.log(data);
  console.log(error);

  return data;
};

export const getAllCookies = () =>
  document.cookie
    .split(";")
    .reduce(
      (ac, str) =>
        Object.assign(ac, { [str.split("=")[0].trim()]: str.split("=")[1] }),
      {}
    );

export const nomalizeImage = async (filename: string) => {
  const { config, token } = nuxtConfig();
  const { user, loading, error } = storeToRefs(useAuthStore());
  const baseUrl = (config.public.apiUrl +
    `/api/user/images/${filename}`) as string;
  const {
    data,
    pending,
    error: fetchError,
  }: any = await useFetch(baseUrl, {
    query: {
      filename,
    },
    headers: {
      Authorization: "Bearer " + token.value,
    },
    watch: [user],
    lazy: true,
  });
  loading.value = pending;
  error.value = fetchError.value;
  if (data.value) {
    return { url: URL.createObjectURL(data.value) };
  }

  return {
    pending,
    error,
  };
};
