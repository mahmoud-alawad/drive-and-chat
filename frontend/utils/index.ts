export const imageNormalizer = async (imagePath: string) => {
  const config = useRuntimeConfig();
  const token = useCookie("token");
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
