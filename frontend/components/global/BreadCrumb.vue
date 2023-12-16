<template>
  <div
    v-if="nodes.length > 1"
    class="bread-crumb container relative z-50 py-4 lg:py-6"
  >
    <nav
      class="mx-auto flex rounded-lg border border-gray-200 bg-gray-50 px-5 py-2.5 text-black"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li
          v-for="(el, i) in nameDictionary != undefined
            ? map(nodes, nameDictionary)
            : nodes"
          :key="i"
          class="inline-flex items-center"
        >
          <a
            class="hover:text-brand inline-flex cursor-pointer items-center text-sm font-medium text-black"
            @click.prevent="goTo(i)"
          >
            <svg
              v-if="i < 1"
              class="mr-2.5 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
              />
            </svg>
            <svg
              v-else
              class="mx-1 h-3 w-3 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span v-if="el" class="text-sm uppercase">
              {{ $t(`crumb.${String(el)}`) }}
            </span>
          </a>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { Router } from "#vue-router";

const props = defineProps<{
  route: RouteLocationNormalizedLoaded;
  router: Router;
  nameDictionary?: {
    [key: string]: string;
  };
}>();

const { locales } = useI18n();
const undiseredPages = [];
const fullpath = computed(() => {
  return props.route.fullPath;
});

const nodes = computed(() => {
  const rootName = "/";
  if (fullpath.value === "/") return [rootName];
  const preLoaded = props.router?._routePreloaded;
  let nodes = fullpath.value.split("/");
  console.log(props.route);
  console.log(props.router);
  console.log(props.router.hasRoute(useLocalePath()("dashboard-chat-id")));
  console.log(useLocalePath()("/"));

  nodes[0] = rootName;
  nodes = nodes.map((node, i) =>
    locales.value[i]?.code?.includes(node) ? "" : node
  );
  if (nodes.length > 3) {
    delete nodes[2];
    delete nodes[3];
  }

  nodes.filter((node) =>
    preLoaded?.has(node)
      ? console.log([...preLoaded]?.find((i) => i.includes(node)))
      : false
  );
  console.log(nodes);
  return nodes.filter((node) => node !== "");
});

const map = (items: string[], nameDictionary: { [key: string]: string }) =>
  items.map((el) =>
    nameDictionary[el] !== undefined ? nameDictionary[el] : el
  );
const goTo = (endIndex: number) => {
  nodes.value[0] = "";
  const path = nodes.value.slice(0, endIndex + 1).join("/");
  // eslint-disable-next-line vue/no-mutating-props
  props.router.push(path === "" ? "/" : path);
};
</script>

<style>
.breadcrumbs .item {
  background-color: transparent;
  border-style: none;
}
</style>
