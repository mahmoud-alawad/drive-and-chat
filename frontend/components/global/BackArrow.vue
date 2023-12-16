<script lang="ts" setup>
const router = useRouter();
const back = () => {
  router.back();
};
</script>

<template>
  <div
    class="mt-3 w-fit rounded-md bg-gray-200 px-6 py-1 hover:bg-gray-100"
    @click="back"
  >
    <Icon class="text-lg font-bold" name="carbon:arrow-left" />
  </div>
</template>

<style scoped></style>
