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
  const { data, error } = await useFetch(src, {
    method: "get",
    headers: {
      Authorization: "Bearer " + token.value,
    },
  });

  if (error.value) {
    return;
  }

  return data.value; // the blob
}

watch(
  () => props.src,
  () => {
    if (!src) return;
    console.log(src);
    blobUrl.value = URL.createObjectURL(load(src));
  }
);

const loaded = () => {
  console.log(blobUrl);
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
};
</script>

<style scoped></style>
