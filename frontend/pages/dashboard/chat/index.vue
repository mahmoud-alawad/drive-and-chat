<template>
  <div v-if="users && users.length" class="">
    <template v-for="(singleUser, index) in users" :key="index">
      <div
        v-if="singleUser"
        class="mt-4 flex items-center justify-between rounded-sm bg-slate-500 px-3 py-4 text-white"
      >
        <span class="text-lg font-medium">{{ singleUser?.username }}</span>
        <nuxt-link
          :to="{
            path: localePath('/dashboard/chat/' + singleUser?.id),
          }"
        >
          <svg
            class="dark:primary/80 h-5 w-5 rotate-45 text-primary"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
            />
          </svg>
        </nuxt-link>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
const authStore = useAuthStore();
const { users } = storeToRefs(authStore);
definePageMeta({
  layout: "user",
  middleware: "auth",
});

await authStore.getUsers();
</script>
<style lang=""></style>
