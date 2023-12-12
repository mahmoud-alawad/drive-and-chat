import { io } from "socket.io-client";

export const useSocket = () => {
  const config = useRuntimeConfig();
  // const userConnected = ref(false);
  const ioSocket = io(config.public.apiUrl, {
    extraHeaders: {
      Authorization: `Bearer ${useCookie("token").value}`,
    },
  });
  // ioSocket.on("connect", (data) => {
  //   userConnected.value = data;
  // });
  return { ioSocket };
};
