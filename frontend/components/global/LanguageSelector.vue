<template>
  <div
    ref="switcher"
    class="relative flex cursor-pointer items-center justify-center bg-slate-200 px-3 py-0.5 lg:px-5"
    @click="changelocale(appLocale)"
  >
    <span class="uppercase">{{ appLocale }}</span>
    <span class="inline-block px-2">
      <Icon name="material-symbols-light:language" size="1.5em" />
    </span>
    <div
      v-show="islangMenuOpen"
      ref="list"
      class="absolute right-1/2 top-[120%] flex min-w-[6rem] max-w-[10rem] flex-col gap-y-1 bg-white text-black transition-all"
    >
      <div
        v-for="(lang, index) in locales"
        :key="index"
        :class="locale === lang.code ? 'bg-primary text-white' : ''"
        class="p-2 text-center uppercase"
        @click="() => (appLocale = lang.code as string)"
      >
        {{ lang.code }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { locales, locale }: any = useI18n();

const appLocale = ref<string | null>(null);
const switcher = ref();
const list = ref();
const islangMenuOpen = ref<boolean>(false);
const changelocale = (loc: string | null) => {
  islangMenuOpen.value = !islangMenuOpen.value;
  const locPath = useSwitchLocalePath();
  // @ts-ignore
  localStorage.setItem("lang", loc);
  // useGeneral().setLocale(loc);
  // @ts-ignore
  useRouter().push(locPath(loc));
};
onMounted(() => {
  appLocale.value = locale.value;
});
</script>
<style scoped></style>
