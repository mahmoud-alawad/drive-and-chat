<script setup>
const messages = ref([]);
const newMessages = ref([]);
const newMessageToSend = ref([]);
// const isAuthorized = ref();
const authStore = useAuthStore();
const { user, onlineUsers } = storeToRefs(authStore);
const route = useRoute();
definePageMeta({
  layout: "user",
  middleware: "auth",
});
const userReciver = await authStore.getUserById(route.params.id);
console.log(userReciver);

const { ioSocket } = useSocket();

onBeforeUnmount(() => {
  console.log("onbefore unomiut");
  onlineUsers.value = onlineUsers.value.filter((id) => id === user.id);
  ioSocket.disconnect((reasion) => {
    console.log("io disconnect", reasion);
  });
});
ioSocket.on("updateOnlineUsers", (data) => {
  console.log("updateOnlineUsers");
  console.log(data);
  onlineUsers.value = data;
});
console.log(ioSocket);
ioSocket.on("connect", (_data) => {
  console.log(_data);
  ioSocket.emit("login", {
    userId: user.value.id,
    receiverId: route.params.id,
  });
  ioSocket.emit("getMessages", {
    receiverId: route.params.id,
  });
});

ioSocket.on("error", (data) => {
  console.log("socket error");
  console.log(data);
});

ioSocket.on("chatHistory", (data) => {
  console.log("chatHistory", data);
  messages.value = data;
});

ioSocket.on("disconnect", () => {
  console.log("desconnect");
});
onMounted(() => {
  ioSocket.on("newMessage", (data) => {
    console.log("socket newMessage");
    console.log(data);
    console.log(newMessages.value);
    messages.value.push(data);
    // eslint-disable-next-line no-new
    new Notification("Example notification");
  });
});
const sendMessage = () => {
  const dataToSend = {
    senderId: user.value.id,
    text: newMessageToSend.value,
    receiverId: route.params.id,
  };
  ioSocket.emit("message", dataToSend);
  messages.value.push(dataToSend);
};
</script>
<template>
  <div
    class="relative flex h-[90svh] flex-col items-center justify-between rounded-md bg-gray-200"
  >
    <div class="flex h-[94%] w-full flex-col justify-end gap-2 p-2">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex max-w-sm items-center justify-between break-all rounded-sm bg-slate-500 px-2 py-1 text-white"
        :class="{ 'bg-red-400': message.senderId === user.id }"
      >
        <span v-if="message.sender" class="text-sm text-red-900">{{
          message.sender.username
        }}</span>
        {{ message.text }} <br />
        <span class="text-sm text-green-900">{{ message.createdAt }}</span>
      </div>
    </div>
    <div class="flex w-full items-center gap-x-2 px-1 py-2">
      <input
        v-model="newMessageToSend"
        class="w-10/12 rounded-sm bg-slate-600 px-0.5 py-2 text-white placeholder:px-2"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
      />
      <button
        class="w-2/12 cursor-pointer bg-primary px-1 py-2 text-white hover:bg-primary/90"
        @click.stop="sendMessage"
      >
        Invia
      </button>
    </div>
  </div>
</template>
