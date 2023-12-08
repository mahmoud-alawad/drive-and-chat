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
  console.log("upload image start");

  if (!fileToUpload.value) {
    message.value = {
      warning: "no image selected",
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
  console.log(data, error);

  if (error.value) {
    isUpload.value = false;
    message.value = {
      error,
    };
  }

  if (data.value) {
    console.log("success");
    isUpload.value = false;
    message.value = {
      success: data.value,
    };
  }
};
</script>
<template>
  <div class="container">
    <md-modal :show="!!message" @close="onCloseModal">
      <div class="p-2 shadow-md">
        {{ message }}
      </div>
    </md-modal>
    <div class="p-2 shadow-md">
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
        <button class="bg-primary p-1" type="submit">Upload Image</button>
      </form>
    </div>
  </div>
</template>
