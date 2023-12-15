<template>
  <div>
    <div v-if="compUser && compUser.length" class="">
      <template v-for="(singleUser, index) in compUser" :key="index">
        <div
          v-if="singleUser && singleUser.id !== user?.id"
          class="mt-4 flex items-center justify-between rounded-sm bg-slate-500 px-3 py-4 text-white"
        >
          <div class="flex items-center">
            <div
              class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white uppercase text-black"
            >
              <span> {{ singleUser?.username?.slice(0, 2) }}</span>
              <span
                v-if="onlineUsers?.find((onUser: any) => onUser.userId === singleUser.id && onUser.socketId !== ioSocket.id)
                "
                class="absolute -top-1 right-0 h-4 w-4 rounded-full bg-green-600"
              ></span>
            </div>
            <div class="slef-center px-2 text-lg font-medium">
              {{ singleUser?.username }}
              <div
                v-if="singleUser.previewMessages"
                class="w-full animate-bounce text-sm italic"
              >
                {{ singleUser.previewMessages.text }}
              </div>
            </div>
          </div>

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
definePageMeta({
  layout: "user",
  middleware: "auth",
});
const localePath = useLocalePath();
const authStore = useAuthStore();
const { user, users, onlineUsers } = storeToRefs(authStore);
const { ioSocket } = useSocket();
const previewMessages = ref<any>([]);
await authStore.getUsers();

const compUser = computed(() => {
  return users.value?.map((singleUser: UserType) => {
    const mess = previewMessages.value
      .filter((message: any) => message.senderId === singleUser.id)
      .reduce((prev: any, current: any) => {
        return prev.createdAt > current.createdAt ? prev : current;
      }, 0);

    singleUser.previewMessages = mess;
    return singleUser;
  });
});

ioSocket.on("connect", () => {
  ioSocket.emit("otherUsersMessages", {
    userId: user.value?.id,
    usersId: users.value
      ?.filter((singleUser) => singleUser.id !== user.value?.id)
      .map((singleUser) => singleUser.id),
  });
});

ioSocket.on("receiveMessage", (data) => {
  console.log("receiveMessage", data);
  previewMessages.value = [...previewMessages.value, data];
});
ioSocket.on("updateOnlineUsers", (data) => {
  console.log("updateOnlineUsers");
  onlineUsers.value = data;
});
ioSocket.on("otherUsersMessages", (data) => {
  console.log("otherUsersMessages");
  console.log(data);
  if (data) {
    previewMessages.value = [...data];
  }
});
onBeforeUnmount(() => {
  ioSocket.emit("logoutUser", ioSocket.id);
});
</script>
<style lang=""></style>
