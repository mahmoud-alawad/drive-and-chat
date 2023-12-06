<script setup>
const { loading } = storeToRefs(useAuthStore());
</script>
<template>
  <div v-if="loading" class="bg-gray h-2">
    <div
      class="duration-400 animate-loader bg-brandAccent h-2 transition-all"
    ></div>
  </div>
</template>
<style>
@keyframes spin {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
