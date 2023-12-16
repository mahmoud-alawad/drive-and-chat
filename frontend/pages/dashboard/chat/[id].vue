<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: "auth",
});
useHead({
  bodyAttrs: {
    class: "single-chat",
  },
});
const messages = ref<{ [key: string]: any }[]>([]);
const newMessageToSend = ref<string>();
const chatContainer = ref<Element>();
const inputChat = ref<HTMLInputElement>();
const { t } = useI18n();
const scrollIntoDiv = (element?: Element) => {
  element?.scroll({
    top: element?.scrollHeight + 200,
    behavior: "smooth",
  });

  console.log("scrolled");
};

// const isAuthorized = ref();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const route = useRoute();
const { ioSocket } = useSocket();

if (!user.value) {
  await authStore.authenticateUser();
}

ioSocket.emit("join", {
  senderId: user.value?.id,
  receiverId: route.params?.id,
});
ioSocket.on("loadMessages", (data) => {
  messages.value = data;
});

ioSocket.on("receiveMessage", (data) => {
  messages.value.push(data);
  console.log(messages.value);
});

onMounted(() => {
  nextTick(() => {
    if (chatContainer.value !== undefined) {
      setTimeout(() => {
        scrollIntoDiv(chatContainer.value);
      }, 200);
    }
  });
  ioSocket.on("newMessage", (data) => {
    console.log("socket newMessage");
    messages.value.push(data);
    // eslint-disable-next-line no-new
    new Notification("Example notification");
  });
});
const sendMessage = () => {
  const dataToSend = {
    senderId: user.value?.id,
    text: newMessageToSend.value,
    receiverId: route.params.id,
  };
  ioSocket.emit("sendMessage", dataToSend);
  messages.value.push({ ...dataToSend, sender: user.value });
  newMessageToSend.value = "";
  console.log(chatContainer.value);
  inputChat.value?.focus();
  if (chatContainer.value !== undefined) {
    setTimeout(() => {
      scrollIntoDiv(chatContainer.value);
    }, 200);
  }
};
</script>
<template>
  <div
    ref="chatContainer"
    class="relative flex h-[73svh] flex-col items-center justify-between overflow-y-scroll rounded-md bg-gray-200"
  >
    <div class="flex w-full flex-col justify-end gap-2 p-2">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="user mb-4 p-2 text-gray-200"
        :class="{
          'rounded-bt-lg self-start rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#056162]':
            message.senderId === user?.id,
          'self-end rounded-bl-lg rounded-br-lg rounded-tl-lg bg-[#262d31]':
            message.senderId !== user?.id,
        }"
      >
        {{ message.text }}
        <span v-if="message.createdAt" class="inline-block text-xs"
          >{{ new Date(message.createdAt).getUTCHours() }}:{{
            new Date(message.createdAt).getUTCMinutes()
          }}
        </span>
      </div>
    </div>
    <div
      class="fixed bottom-0 left-0 flex w-full items-center gap-x-2 bg-[#f0f2f5] px-1 py-2 rtl:right-0 md:w-[calc(100%-256px)]"
    >
      <input
        ref="inputChat"
        v-model="newMessageToSend"
        class="w-10/12 rounded-sm bg-white px-0.5 py-2 text-gray-900 placeholder:px-2 rtl:order-1"
        :placeholder="t('Type your message') + '...'"
        @keyup.enter="sendMessage"
      />
      <button
        class="w-2/12 cursor-pointer bg-primary px-1 py-2 text-white hover:bg-primary/90"
        @click.stop="sendMessage"
      >
        <Icon name="simple-line-icons:cursor" />
      </button>
    </div>
  </div>
</template>
<style>
body.single-chat .cookieControl__ControlButton {
  display: none !important;
}

body.single-chat .bread-crumb {
  display: none;
}
</style>
