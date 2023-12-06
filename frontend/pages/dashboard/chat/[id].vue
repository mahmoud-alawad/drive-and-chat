<template>
  <div
    class="relative flex h-[90svh] flex-col items-center justify-between rounded-md bg-gray-200"
  >
    <div class="flex h-[94%] w-full flex-col justify-end p-2">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex max-w-sm items-center justify-between break-all rounded-sm bg-slate-500 px-2 py-1 text-white"
      >
        {{ message.text }}
      </div>
    </div>
    <div class="flex w-full items-center gap-x-2 px-1 py-2">
      <input
        v-model="newMessage"
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

<script setup>
import { io } from "socket.io-client";
const messages = ref([]);
const newMessage = ref("");
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const route = useRoute();
definePageMeta({
  layout: "user",
  middleware: "auth",
});

const userReciver = await authStore.getUserById(route.params.id);
console.log(userReciver);

const ioSocket = io(config.public.apiUrl);

ioSocket.on("message", (message) => {
  // messages.value.push({
  //   senderId: user.value.id,
  //   text: message,
  // });
  console.log(message);
});

const sendMessage = () => {
  const dataToSend = {
    senderId: user.value.id,
    text: newMessage.value,
    receiverId: route.params.id,
  };
  ioSocket.emit("message", dataToSend);
  messages.value.push(dataToSend);
};
</script>
