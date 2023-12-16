<template>
  <div class="relative min-h-[60vh] w-full">
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
    <div v-if="userImages.length" class="grid">
      <div class="flex items-center justify-between px-1">
        <div class="font-medium">{{ $t("name") }}</div>
        <div class="font-medium">{{ $t("owners") }}</div>
      </div>
      <div
        v-for="(image, index) in userImages"
        :key="index"
        class="group flex flex-wrap items-center justify-between border-b border-b-black py-2 text-black first:border-t first:border-t-black md:flex-nowrap"
      >
        <md-modal
          :show="openImage === image.id"
          @close="
            () => {
              openImage = false;
            }
          "
        >
          <div class="aspect-square p-4">
            <img class="h-full w-full object-contain" :src="image.url" alt="" />
          </div>
        </md-modal>
        <div
          class="flex cursor-pointer items-center gap-x-1 p-1 md:w-3/4"
          @click="openImage = image.id"
        >
          <Icon name="uil:image" color="black" />
          <span v-if="image.originalName">{{ image.originalName }}</span>
        </div>

        <div
          class="flex w-full items-center gap-x-[1.2em] opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:w-1/4 md:justify-end"
        >
          <Icon
            class="cursor-pointer text-xl font-medium lg:text-2xl"
            name="uil:user-plus"
          />
          <Icon
            class="cursor-pointer text-xl font-medium lg:text-2xl"
            name="uil:image-download"
          />
          <Icon
            class="cursor-pointer text-xl font-medium lg:text-2xl"
            name="uil:edit"
            @click="editImageName(image)"
          />
          <div class="absolute left-0 top-full w-full">
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex min-h-[60vh] w-full items-center justify-center">
      <div
        class="flex min-h-[20vh] animate-bounce items-center justify-center rounded-md p-4 text-red-600 shadow-md"
      >
        {{ $t("you don't have images") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { user, userImages, users } = storeToRefs(authStore);
const config = useRuntimeConfig();
const { t } = useI18n();
const message = ref();
const openImage = ref();
const selectUsers = ref();

selectUsers.value = userImages.value.map(
  (image: any) => image.userId === user.value?.id && user.value?.id
);

definePageMeta({
  layout: "user",
  middleware: "auth",
});

if (!users.value?.length) {
  await authStore.getUsers();
}
await authStore.normalizeImages();

const editImageName = async (image: any) => {
  const prmpt = prompt(t("rename image", image.originalName));
  console.log(image.originalName);

  console.log(
    image.originalName.slice(
      image.originalName.length - 3,
      image.originalName.length
    )
  );
  if (!prmpt) {
    return alert(t("please fill the field with valid name"));
  }
  const { data, error } = await useFetch(config.public.apiUrl + "/upload", {
    method: "PUT",
    headers: new Headers({
      Authorization: "Bearer " + useCookie("token").value,
    }),
    body: {
      id: image.id,
      originalName:
        prmpt +
        image.originalName.slice(
          image.originalName.length - 4,
          image.originalName.length
        ),
    },
  });

  console.log(data);
  console.log(error);
  if (data.value) {
    alert(t("image renamed successfully"));
    await authStore.normalizeImages();
  }
  if (error.value) {
    alert(error.value);
  }
};
</script>
