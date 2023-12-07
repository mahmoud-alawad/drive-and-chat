<!-- pages/index.vue -->
<template>
  <div class="relative w-full">
    <div
      class="absolute right-0 top-0 cursor-pointer rounded-sm bg-primary px-2 py-1 ring-nuxt-green"
      @click="isUpload = true"
    >
      upload media
    </div>
    <button @click="getUserImages">images</button>
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
    <div v-for="(image, index) in user?.images" :key="index">
      <bolb-image
        :src="config.public.apiUrl + `/api/user/images/${image.filename}`"
      />
    </div>
    <div
      v-if="user?.images.length"
      class="container grid grid-cols-2 gap-2 lg:grid-cols-3"
    >
      <div v-for="(image, index) in images" :key="index">
        <img :src="image" alt="" srcset="" />
      </div>
    </div>
    <div v-else>you don't have images</div>
    <md-modal
      :show="!!isUpload"
      @close="
        () => {
          fileToUpload = null;
          isUpload = false;
        }
      "
    >
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
    </md-modal>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const imageInput = ref();
const fileToUpload = ref();
const isUpload = ref();
const message = ref();
const userImages = ref();
const images = ref<string[]>([]);
const config = useRuntimeConfig();
const token = useCookie("token");
// const baseUrl = config.public.apiUrl + "/api/user/images";

const nomalizeImage = async (filename: string) => {
  const baseUrl = (config.public.apiUrl +
    `/api/user/images/${filename}`) as string;
  // fetch(baseUrl, {
  //   headers: {
  //     Authorization: "Bearer " + token.value,
  //   },
  // })
  //   .then((response) => response.blob())
  //   .then((myBlob) => {
  //     const objectURL = URL.createObjectURL(myBlob);
  //     console.log(objectURL);
  //     images.value.push(objectURL);
  //     result = objectURL;
  //   });
  // return result;
  const { data, error }: any = await useFetch(baseUrl, {
    query: {
      filename,
    },
    headers: {
      Authorization: "Bearer " + token.value,
    },
    onResponse: async (ctx) => {
      console.log(ctx.response.json());

      images.value.push(URL.createObjectURL(await ctx.response.blob()));
    },
  });
  console.log(data.value);
  console.log(error);
  if (!data.value) {
    return "";
  }
  // return URL.createObjectURL(data.value.blob());
};

userImages.value = await user.value?.images.forEach(async (image: any) => {
  const url = await nomalizeImage(image.filename);
  console.log(url);

  return {
    id: image.id,
    originalName: image.originalName,
    createdAt: image.createdAt,
    url,
  };
});
console.log(userImages);
const getUserImages = async () => {
  await user.value?.images.forEach(async (image: any) => {
    const url = await nomalizeImage(image.filename);
    console.log(url);
    images.value = [...images.value, ...url];
    return {
      id: image.id,
      originalName: image.originalName,
      createdAt: image.createdAt,
      url,
    };
  });
};
const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  fileToUpload.value = file;
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
    // eslint-disable @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResponse({ request, response, options }) {
      // Process the response data
      console.log(response);
    },
  });

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
