<template>
  <section class="container mx-auto mt-20">
    <p v-if="message">{{ message }}</p>
    <div
      class="mx-auto w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0"
    >
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          {{ $t("sign in to your account") }}
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="signIn">
          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-900"
              >{{ $t("Your email") }}</label
            >
            <input
              id="email"
              v-model="email"
              type="text"
              name="email"
              class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-gray-900"
              >{{ $t("Password") }}</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              placeholder="••••••••"
              class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            />
          </div>
          <div class="flex items-center justify-between">
            <a
              href="#"
              class="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
              >{{ $t("Forgot password") }}?</a
            >
          </div>
          <button
            type="submit"
            class="hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            {{ $t("Sign in") }}
          </button>
          <div class="w-full py-1 uppercase">{{ $t("or") }}</div>
          <nuxt-link
            :to="useLocalePath()('register')"
            type="submit"
            class="hover:bg-primary-700 focus:ring-primary-300 block w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            {{ $t("Sign up") }}
          </nuxt-link>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const email = ref<any>("");
const password = ref<any>("");
const message = ref<any>("");

const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);
if (authenticated.value) {
  navigateTo(useLocalePath()("/dashboard/chat"));
}
const signIn = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  });

  navigateTo(useLocalePath()("dashboard"));
};
</script>
