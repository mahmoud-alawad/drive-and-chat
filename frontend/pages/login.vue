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
          Sign in to your account
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="signIn">
          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-900"
              >Your email</label
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
              >Password</label
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
              >Forgot password?</a
            >
          </div>
          <button
            type="submit"
            class="hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            Sign in
          </button>
          <br />
          <span>OR</span>
          <nuxt-link
            :to="useLocalePath()('register')"
            type="submit"
            class="hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            Sign Up
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
const { error, loading } = storeToRefs(authStore);
const signIn = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  });
  console.log(error);
  console.log(loading);
  if (error.value) {
    alert(error.value.data);
  }
  navigateTo(useLocalePath()("dashboard"));
};
</script>
<style lang=""></style>
