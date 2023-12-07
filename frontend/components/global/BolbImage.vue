<template>
  <img ref="image" :src="blobUrl" @load="loaded" />
</template>

<script setup>
/**
 * Load an image url as a blob
 */
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
});

const image = ref();
const blobUrl = ref();
const token = useCookie("token");

async function load(src) {
  const response = await useFetch(src, {
    method: "get",
    headers: {
      Authorization: "Bearer " + token.value,
    },
    responseType: "blob",
  });
  return response.data; // the blob
}

watch(
  () => props.src,
  () => {
    if (!src) return;
    load(src).then((blob) => {
      blobUrl.value = URL.createObjectURL(blob);
      console.log(blobUrl.value);
    });
  }
);

const loaded = () => {
  console.log(blobUrl);
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
};
</script>

<style scoped></style>
