<script setup lang="ts">
const localePath = useLocalePath();

useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
</script>
<template>
  <!--

    Template below is intended to be removed..

  -->
  <div class="container mx-auto max-w-screen-lg px-8">
    <header class="mb-5">
      <nav class="flex flex-row justify-between pb-5 pt-10">
        <NuxtLink to="/" aria-label="Home" class="min-w-fit">
          <nuxt-img
            class="h-6 dark:hidden sm:ml-3 lg:ml-0"
            src="nuxt/full-logo-green-dark.svg"
            densities="x1 x2"
            alt="nuxt-logo"
            style="height: 24px; width: 99px"
          />
          <nuxt-img
            class="hidden h-6 dark:block"
            src="nuxt/full-logo-green-light.svg"
            densities="x1 x2"
            alt="nuxt-logo"
            style="height: 24px; width: 99px"
          />
        </NuxtLink>
        <div
          class="flex flex-col space-x-3 space-y-4 rtl:space-x-reverse sm:flex-row sm:space-y-0"
        >
          <nuxt-link
            class="bg-slate-300 px-3 py-2 hover:bg-slate-200 lg:px-5"
            :to="localePath('dashboard')"
            >{{ $t("pages.dashboard.name") }}</nuxt-link
          >
          <LanguageSelector />
        </div>
      </nav>
    </header>
    <slot />

    <footer
      class="dark:text-300 py-20 text-center text-sm text-gray-500 dark:bg-slate-900"
    >
      <p>© {{ new Date().getFullYear() }} - {{ $t("site.name") }}</p>
    </footer>
  </div>
</template>
<style lang="postcss">
ul .router-link-exact-active {
  @apply border-slate-400 bg-slate-500 text-white hover:border-slate-500 hover:bg-slate-500 dark:border-slate-600 dark:bg-slate-700;
}
</style>
