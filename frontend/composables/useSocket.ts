import { io } from "socket.io-client";

export const useSocket = () => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const isNotInChat = router.currentRoute.value.matched.some(
    (i) => i.path !== useLocalePath()("/dashboard/chat/:id()")
  );

  // const userConnected = ref(false);
  const ioSocket = io(config.public.apiUrl, {
    extraHeaders: {
      Authorization: `Bearer ${useCookie("token").value}`,
    },
  });
  ioSocket.on("receiveMessage", (_data) => {
    if (isNotInChat) {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2841/2841-preview.mp3"
      );
      audio.play();
      // eslint-disable-next-line no-new
      const notification = new Notification("New message", {
        body: "You have a new message!",
        icon: "https://icons8.com/icon/124405/message-link",
      });
      notification.addEventListener("click", () => {
        navigateTo(useLocalePath()("/dashboard/chat"));
      });
    }
  });
  // ioSocket.on("connect", (data) => {
  //   userConnected.value = data;
  // });
  return { ioSocket, isNotInChat };
};
