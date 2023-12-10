<template>
  <div>
    <div v-if="users && users.length" class="">
      users
      <template v-for="(singleUser, index) in users" :key="index">
        <div
          v-if="singleUser"
          class="mt-4 flex items-center justify-between rounded-sm bg-slate-500 px-3 py-4 text-white"
        >
          {{ onlineUsers }}
          <!-- <span
            v-if="onlineUsers[singleUser.id] === singleUser.id"
            class="h-2 w-2 bg-green-600"
          ></span> -->
          <span class="text-lg font-medium">{{ singleUser?.username }}</span>
          <nuxt-link
            :to="localePath('/dashboard/chat/' + singleUser?.id)"
            class="flex items-center justify-center rounded-full bg-primary p-2 hover:bg-primary/80 focus:right-4"
          >
            <Icon
              class="dark:primary/80 -rotate-45 text-white"
              name="uil:message"
              color="text-primary"
            />
          </nuxt-link>
        </div>
      </template>
    </div>
    <div v-else>no users to chat :(</div>
  </div>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
const authStore = useAuthStore();
const { users, onlineUsers } = storeToRefs(authStore);

definePageMeta({
  layout: "user",
  middleware: "auth",
});

await authStore.getUsers();
watch(
  () => onlineUsers.value,
  (val) => {
    console.log(val);
  }
);
</script>
<style lang=""></style>
