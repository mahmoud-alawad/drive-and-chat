<template>
  <div class="relative h-screen w-full">
    <a
      class="block cursor-pointer rounded-md bg-primary py-2 text-center text-lg font-bold text-white ring-nuxt-green"
      @click.prevent="navigateTo(useLocalePath()('/dashboard/media/upload'))"
    >
      upload media
    </a>
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
      v-if="userImages"
      class="container grid grid-cols-2 gap-2 lg:grid-cols-3"
    >
      <div v-for="(image, index) in userImages" :key="index">
        <img class="min-h-[3rem] w-full" :src="image.url" />
      </div>
    </div>
    <div v-else>you don't have images</div>
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
