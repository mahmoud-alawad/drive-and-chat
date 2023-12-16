<script setup lang="ts">
const { locale, t } = useI18n();
const { error } = storeToRefs(useAuthStore());

useHead({
  htmlAttrs: {
    lang: locale,
    dir: computed(() => {
      return t("locale.dir") as "ltr" | "rtl" | "auto";
    }),
  },
  script: [{ children: "console.log('Hello, world!');" }],
  titleTemplate(title) {
    return title ? `${title} - ${t("site.name")}` : `${t("site.name")}`;
  },
});
</script>
<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#FF4A01" />
    <page-spinner />
    <template v-if="error">
      <md-modal
        :show="!!error"
        @close="
          () => {
            error = null;
          }
        "
      >
        <div v-if="error" class="p-3 lg:p-6">
          {{ error.data }}
        </div>
      </md-modal>
    </template>
    <CookieBanner />
    <NuxtPage />
  </NuxtLayout>
</template>
