<script lang="ts" setup></script>

<template>
  <div
    id="loading"
    class="flex min-h-screen items-center justify-center bg-black"
  >
    <div class="loader flex space-x-3 rounded-full bg-white p-5">
      <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
      <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
      <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
    </div>
  </div>
</template>

<style scoped>
.loader div {
  animation-duration: 0.5s;
}

.loader div:first-child {
  animation-delay: 0.1s;
}

.loader div:nth-child(2) {
  animation-delay: 0.3s;
}

.loader div:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
