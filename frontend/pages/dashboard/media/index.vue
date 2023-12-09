<template>
  <div class="relative h-screen w-full">
    <md-modal
      :show="!!message"
      @close="
        () => {
          message = null;
        }
      "
    >
      <div v-if="message" class="p-3 lg:p-6">
        <div v-if="message.warning">{{ message.warning }}</div>
        <div v-if="message.success">
          image {{ message.success?.data?.name || message }} uploaded
          successfully !!
        </div>
        <div v-if="message.error">
          <span>something went wrong try again!</span> <br />
          {{ message.error }}
        </div>
      </div>
    </md-modal>
    <div
      v-if="userImages.length"
      class="container grid grid-cols-2 gap-2 lg:grid-cols-3"
    >
      <div v-for="(image, index) in userImages" :key="index">
        <img class="min-h-[3rem] w-full" :src="image.url" />
      </div>
    </div>
    <div v-else class="flex h-screen w-full items-center justify-center">
      <div
        class="flex min-h-[20vh] animate-bounce items-center justify-center rounded-md p-4 text-red-600 shadow-md"
      >
        {{ $t("pages.dashboard.media.noImages") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { user, userImages } = storeToRefs(authStore);
const message = ref();

definePageMeta({
  layout: "user",
  middleware: "auth",
});

if (!user.value) {
  await authStore.authenticateUser();
}

await authStore.normalizeImages();
</script>
