// export const useSocketStore = defineStore("socket", async () => {
//   const authStore = useAuthStore();
//   const { user, users } = storeToRefs(authStore);
//   const { ioSocket } = useSocket();

//   const previewMessages = ref<any>([]);
//   const onlineUsers = ref<string[]>();
//   if (!user.value) await authStore.authenticateUser();
//   if (!users.value?.length) await authStore.getUsers();

//   ioSocket.on("connect", () => {
//     ioSocket.emit("otherUsersMessages", {
//       userId: user.value?.id,
//       usersId: users.value
//         ?.filter((singleUser) => singleUser.id !== user.value?.id)
//         .map((singleUser) => singleUser.id),
//     });
//   });

//   ioSocket.on("updateOnlineUsers", (data) => {
//     console.log("updateOnlineUsers");
//     onlineUsers.value = data;
//   });

//   ioSocket.on("otherUsersMessages", (data) => {
//     console.log("otherUsersMessages");
//     console.log(data);
//     previewMessages.value = data;
//   });

//   const logOut = () => {
//     ioSocket.emit("logoutUser", ioSocket.id);
//   };

//   return {
//     onlineUsers,
//     previewMessages,
//     logOut,
//   };
// });
