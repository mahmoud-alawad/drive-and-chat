<template>
  <div>
    <div>dashboard</div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: "auth",
});
// const authStore = useAuthStore();
// const { user, onlineUsers } = storeToRefs(authStore);

onMounted(async () => {
  await Notification.requestPermission();
});
</script>
<style lang=""></style>
