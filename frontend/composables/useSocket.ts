import { io } from "socket.io-client";

export const useSocket = () => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const permessions = ref<string>();
  const isConntected = ref<boolean>();
  const isNotInChat = router.currentRoute.value.matched.some(
    (i) => i.path !== useLocalePath()("/dashboard/chat/:id()")
  );

  const ioSocket = io(config.public.apiUrl, {
    // reconnection: false,
    extraHeaders: {
      Authorization: `Bearer ${useCookie("token").value}`,
    },
  });
  console.log(ioSocket);
  isConntected.value = ioSocket.connected;
  ioSocket.on("receiveMessage", (_data) => {
    if (isNotInChat && permessions.value === "granted") {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2841/2841-preview.mp3"
      );
      audio.play();

      const notification = new Notification("New message", {
        body: "You have a new message!",
        icon: "https://icons8.com/icon/124405/message-link",
      });
      notification.addEventListener("click", () => {
        navigateTo(useLocalePath()("/dashboard/chat"));
      });
    }
  });
  // ioSocket.on("connect_error", (err) => {
  //   console.log(`connect_error due to ${err}`);
  // });
  // ioSocket.on("connect", (data) => {
  //   userConnected.value = data;
  // });
  return { ioSocket, isNotInChat, isConntected, permessions };
};
