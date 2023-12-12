<template>
  <div>
    <div v-if="users && users.length" class="">
      users
      <template v-for="(singleUser, index) in users" :key="index">
        <div
          v-if="singleUser && singleUser.id !== user?.id"
          class="mt-4 flex items-center justify-between rounded-sm bg-slate-500 px-3 py-4 text-white"
        >
          <div class="flex">
            <div
              class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white uppercase text-black"
            >
              {{ singleUser.username?.slice(0, 2) }}
              <span
                v-if="
              onlineUsers?.find((onUser:any) => onUser.userId === singleUser.id && onUser.socketId !== ioSocket.id)
            "
                class="absolute -top-1 right-0 h-4 w-4 rounded-full bg-green-600"
              ></span>
            </div>
          </div>
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
const { user, users, onlineUsers } = storeToRefs(authStore);

definePageMeta({
  layout: "user",
  middleware: "auth",
});
const { ioSocket } = useSocket();

await authStore.getUsers();
// @ts-ignore
ioSocket.on("connect", (_data) => {
  ioSocket.emit("login", {
    userId: user.value?.id,
  });
});

ioSocket.on("updateOnlineUsers", (data) => {
  console.log("updateOnlineUsers");
  onlineUsers.value = data;
});

onBeforeUnmount(() => {
  ioSocket.emit("logoutUser", ioSocket.id);
});
</script>
<style lang=""></style>
