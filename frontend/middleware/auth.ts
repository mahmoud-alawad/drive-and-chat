export default defineNuxtRouteMiddleware((_from) => {
  const authStore = useAuthStore();
  const { authenticated } = storeToRefs(authStore);
  const token = useCookie("token"); // get token from
  const localePath = useLocalePath();
  // const router = useRouter();
  if (token.value) {
    // check if value exists
    // todo verify if token is valid, before updating the state
    authenticated.value = true; // update the state to authenticated
  }

  // if token doesn't exist redirect to log in
  if (!token.value && _from?.path.includes(localePath("dashboard"))) {
    return navigateTo(localePath("login"));
  }
});
