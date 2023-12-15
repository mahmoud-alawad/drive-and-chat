<template>
  <div>
    <div>{{ user }}</div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: "auth",
});
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>
<style lang=""></style>
