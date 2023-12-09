<script lang="ts" setup>
const message = ref();
const userFields = reactive({
  username: "",
  email: "",
  password: "",
});
const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);
const singUp = async () => {
  await authStore.register(userFields);
};
</script>

<template>
  <section class="container mx-auto mt-20">
    <md-modal
      :show="!!authenticated"
      @close="
        () => {
          message = null;
        }
      "
    >
      <div v-if="authenticated" class="w-full p-3 lg:p-6">
        <span class="inline-block w-full text-center"
          >{{ userFields.username }} created</span
        >
        <span class="inline-block w-full text-center"> go to login page</span>
        <nuxt-link
          class="mx-auto mt-2 block w-8/12 rounded-md bg-primary px-3 py-1 text-center text-white lg:mt-4"
          :to="useLocalePath()('login')"
          >{{ $t("login") }}</nuxt-link
        >
      </div>
    </md-modal>
    <div
      class="mx-auto w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0"
    >
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          Register your account
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="singUp">
          <div>
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-gray-900"
              >Your name</label
            >
            <input
              id="username"
              v-model="userFields.username"
              type="text"
              name="username"
              class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
              placeholder="my name  "
            />
          </div>
          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-900"
              >Your email</label
            >
            <input
              id="email"
              v-model="userFields.email"
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
              v-model="userFields.password"
              type="password"
              name="password"
              placeholder="••••••••"
              class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            class="hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            @click.prevent="singUp"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
