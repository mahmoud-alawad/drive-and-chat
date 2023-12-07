<!-- pages/index.vue -->
<template>
  <div>
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
          image {{ message.success?.data?.name }} uploaded successfully !!
        </div>
        <div v-if="message.error">
          <span>something went wrong try again!</span> <br />
          {{ message.error }}
        </div>
      </div>
    </md-modal>
    <div v-if="user" class="container grid grid-cols-2 gap-2 lg:grid-cols-3">
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
const message = ref();
const config = useRuntimeConfig();
const token = useCookie("token");

const imageNormalizer = async (imagePath) => {
  const baseUrl = config.public.apiUrl + "/api/upload?id=";
  const { data, error } = await useFetch(baseUrl + imagePath, {
    headers: {
      Authorization: "Bearer " + token.value,
    },
    onResponse: (response) => {
      console.log(response);
    },
  });
  console.log(data.value);
  console.log(error);

  return data;
};
const userImages = user.value?.images.map((image) => {
  imageNormalizer(image.id);
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

const uploadImage = async () => {
  if (!fileToUpload.value) {
    console.error("No file selected");
    message.value = {
      warning: "no image selected",
    };
    return;
  }

  const formData = new FormData();
  formData.append("image", fileToUpload.value);

  const { data, error } = await useFetch(config.public.apiUrl + "/api/upload", {
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
    message.value = {
      error,
    };
  }
  if (data.value) {
    console.log("success");
    message.value = {
      success: data.value,
    };
  }
};
</script>
