<script setup>
definePageMeta({
  layout: "user",
  middleware: "auth",
});
const messages = ref([]);
const newMessageToSend = ref([]);
// const isAuthorized = ref();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const route = useRoute();
const { ioSocket } = useSocket();

if (!user.value) {
  await authStore.authenticateUser();
}

ioSocket.emit("join", { senderId: user.value.id, receiverId: route.params.id });
ioSocket.on("loadMessages", (data) => {
  messages.value = data;
});

ioSocket.on("receiveMessage", (data) => {
  messages.value.push(data);
  console.log(messages.value);
});
onMounted(() => {
  ioSocket.on("newMessage", (data) => {
    console.log("socket newMessage");
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
  ioSocket.emit("sendMessage", dataToSend);
  messages.value.push({ ...dataToSend, sender: user.value });
  newMessageToSend.value = "";
};
</script>
<template>
  <div
    class="relative flex h-[90svh] flex-col items-center justify-between rounded-md bg-gray-200"
  >
    <div
      class="flex h-full w-full flex-col justify-end gap-2 overflow-y-scroll p-2"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="user mb-4 rounded-bl-lg rounded-br-lg rounded-tl-lg bg-[#056162] px-4 py-2 text-gray-200"
        :class="{
          'self-start bg-[#056162]': message.senderId === user?.id,
          'self-end bg-[#262d31]': message.senderId !== user?.id,
        }"
      >
        {{ message.text }}
        <span class="inline-block text-xs"
          >{{ new Date(message.createdAt).getUTCHours() }}:{{
            new Date(message.createdAt).getUTCMinutes()
          }}
        </span>
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
