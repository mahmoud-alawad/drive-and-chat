<script setup lang="ts">
const router = useRouter();
const authStore = useAuthStore();
const { user, error, loading } = storeToRefs(authStore);
const localePath = useLocalePath();
const token = useCookie("token");

const isMenuOpen = ref<boolean>(false);
const sidebar = ref<HTMLElement>();
const sidebarTrigger = ref<HTMLElement>();

authStore.authenticateUser();

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const logout = () => {
  authStore.logout();
};

useClickOutSide([sidebar], () => (isMenuOpen.value = false), sidebarTrigger);
</script>
<template>
  <div class="">
    <template v-if="error">
      <md-modal
        :show="!!error"
        @close="
          () => {
            error = null;
            token = null;
          }
        "
      >
        <div v-if="error && error.data" class="p-3 lg:p-6">
          {{ error.data || error.data?.message }}
        </div>
      </md-modal>
    </template>
    <div v-if="loading">
      <loading-state />
    </div>
    <button
      ref="sidebarTrigger"
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      class="ms-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      @click.stop="toggleMenu"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="h-6 w-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
    <aside
      id="default-sidebar"
      ref="sidebar"
      :class="{
        'translate-x-0': isMenuOpen,
        '-translate-x-full': !isMenuOpen,
      }"
      class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
        <div
          class="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
          @click="isMenuOpen = false"
        >
          x
        </div>
        <ul class="space-y-2 font-medium">
          <li>
            <nuxt-link
              class="relative mb-4 mt-2 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
              :to="localePath('/dashboard/profile')"
            >
              <span class="font-medium text-gray-600 dark:text-gray-300">
                {{ user?.username.slice(0, 2) }}</span
              >
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              :to="localePath('/dashboard/chat')"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"
                  @click.stop="router.replace(localePath('/dashboard/chat'))"
                />
              </svg>
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("chat")
              }}</span>
              <!-- <span
                class="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >3</span
              > -->
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              :to="localePath('/dashboard/media')"
              ><svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path
                  d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
                />
              </svg>
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("my media")
              }}</span></nuxt-link
            >
          </li>
          <li>
            <a
              href="#"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              @click.stop="logout"
            >
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("layout.logout")
              }}</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>

    <div class="p-4 sm:ml-64">
      <slot />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
