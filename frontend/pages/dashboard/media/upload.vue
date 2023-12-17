<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: "auth",
});

const config = useRuntimeConfig();
const imageInput = ref();
const fileToUpload = ref();
const isUpload = ref();
const message = ref();
const { t } = useI18n();

const onCloseModal = () => {
  fileToUpload.value = null;
  isUpload.value = false;
  message.value = null;
};
const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  fileToUpload.value = file;
};

const uploadImage = async () => {
  if (!fileToUpload.value) {
    message.value = {
      warning: t("no image selected"),
    };
    return;
  }

  const formData = new FormData();
  formData.append("image", fileToUpload.value);

  const { data, error } = await useFetch(config.public.apiUrl + "/upload", {
    method: "POST",
    headers: new Headers({
      Authorization: "Bearer " + useCookie("token").value,
    }),
    body: formData,
  });

  if (error.value) {
    isUpload.value = false;
    message.value = {
      error,
    };
  }

  if (data.value) {
    isUpload.value = false;
    message.value = {
      success: data.value,
    };
  }
};
</script>
<template>
  <div class="container flex min-h-[60vh] items-center justify-center">
    <md-modal :show="!!message" @close="onCloseModal">
      <div class="p-2 shadow-md">
        <span v-if="message.success" class="mx-auto block w-fit"
          ><span>{{ message.success.originalName }}</span> <br />
          {{ $t("uploaded") }}!!</span
        >
        <span v-else class="mx-auto block w-fit">{{ message.warning }}</span>
      </div>
    </md-modal>
    <div class="p-4 shadow-lg">
      <form
        class="grid gap-4"
        enctype="multipart/form-data"
        @submit.prevent="uploadImage"
      >
        <input
          ref="imageInput"
          class="w-full"
          name="image"
          type="file"
          @change="handleFileChange"
        />
        <button class="bg-primary p-1" type="submit">
          {{ $t("Upload image") }}
        </button>
      </form>
    </div>
  </div>
</template>
