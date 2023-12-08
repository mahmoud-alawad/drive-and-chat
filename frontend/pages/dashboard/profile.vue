<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: "auth",
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const userUpdate = reactive({
  username: user.value?.username,
  email: user.value?.email,
}) as Omit<UserType, "id" | "password">;

if (!user.value) {
  await authStore.authenticateUser();
}

const handleForm = async () => {
  if (
    userUpdate.username !== user.value?.username ||
    userUpdate.email !== user.value?.email
  ) {
    await authStore.updateUser(userUpdate);
  } else {
    return alert("no changes detected");
  }
};

const deleteAccount = async () => {
  const { data } = await authStore.deleteAccount();
  if (data.value) {
    navigateTo(useLocalePath()("/"));
  }
};
</script>
<template>
  <div class="flex h-fit w-full items-center justify-center">
    <div class="w-10/12">
      <div class="rounded-lg bg-white py-3 shadow-xl">
        <div class="photo-wrapper mx-auto aspect-square w-1/2 p-2">
          <img
            class="mx-auto w-full rounded-full object-contain"
            src="https://placehold.co/200x200"
            alt="John Doe"
          />
        </div>
        <form class="grid w-full gap-4 p-2" @submit.prevent="handleForm">
          <div class="flex items-center gap-x-4">
            <label class="uppercase" for="username">user name :</label>
            <input
              v-model="userUpdate.username"
              class="text-xl font-medium leading-8 text-gray-400"
            />
          </div>
          <div class="flex items-center gap-x-2">
            <label class="uppercase" for="email">email</label>
            <input
              v-model="userUpdate.email"
              class="text-xl font-medium leading-8 text-gray-400"
              type="email"
              name="email"
            />
          </div>
          <div class="my-3 grid gap-3 text-center md:grid-cols-2">
            <button
              type="submit"
              class="block rounded-md bg-primary py-2 text-lg font-medium text-white"
            >
              {{ $t("update profile") }}
            </button>
            <div
              class="block cursor-pointer rounded-md bg-red-500 py-2 text-lg font-medium text-white"
              @click="deleteAccount"
            >
              {{ $t("delete account") }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
