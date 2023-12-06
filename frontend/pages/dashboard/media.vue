<!-- pages/index.vue -->
<template>
  <div>
    <div
      v-if="user.images"
      class="container grid grid-cols-2 gap-2 lg:grid-cols-3"
    >
      <div v-for="(image, index) in user.images" :key="index">
        <img
          :src="config.public.apiUrl + '/uploads/' + image.originalName"
          alt=""
          srcset=""
        />
      </div>
    </div>
    <form enctype="multipart/form-data" @submit.prevent="uploadImage">
      <input
        ref="imageInput"
        name="image"
        type="file"
        @change="handleFileChange"
      />
      <button type="submit">Upload Image</button>
    </form>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const imageInput = ref();
const fileToUpload = ref();
const config = useRuntimeConfig();
const userImages = user.value?.images.map((image) => {
  return {
    id: image.id,
    originalName: image.originalName,
    createdAt: image.createdAt,
  };
});
console.log(userImages);
const handleFileChange = (event) => {
  const file = event.target.files[0];
  fileToUpload.value = file;
  console.log("Selected File:", file);
};
definePageMeta({
  layout: "user",
  middleware: "auth",
});
if (!user.value) {
  authStore.authenticateUser();
}
// const { data, error } = await useFetch(config.public.apiUrl+"/uploads", {});

const uploadImage = async () => {
  if (!fileToUpload.value) {
    console.error("No file selected");
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
    // eslint-disable @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResponse({ request, response, options }) {
      // Process the response data
      console.log(response);
    },
  });
  if (error.value) {
    alert(error.value);
  }
  console.log("uploaded with success", data);
};
</script>
