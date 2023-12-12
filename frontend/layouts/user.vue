<script setup lang="ts">
const authStore = useAuthStore();
const { user, error, loading } = storeToRefs(authStore);
const localePath = useLocalePath();
const token = useCookie("token");

const isMenuOpen = ref<boolean>(false);
const sidebar = ref<HTMLElement>();
const sidebarTrigger = ref<HTMLElement>();

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const logout = () => {
  authStore.logout();
};
console.log(user);
if (!user.value) {
  await authStore.authenticateUser();
}
useClickOutSide([sidebar], () => (isMenuOpen.value = false), sidebarTrigger);
</script>
<template>
  <div>
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
        <div v-if="error" class="p-3 lg:p-6">
          <div>{{ error }}</div>
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
      <div class="h-full overflow-y-auto bg-gray-50 px-3 py-4">
        <div
          class="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white sm:hidden"
          @click="isMenuOpen = false"
        >
          x
        </div>
        <div>
          <nuxt-link
            class="relative mb-4 mt-2 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-600 focus:bg-gray-900"
            :to="localePath('/dashboard/profile')"
          >
            <span
              v-if="user?.username"
              class="font-medium uppercase text-white"
            >
              {{ user?.username?.slice(0, 2) }}</span
            >
          </nuxt-link>
        </div>
        <ul class="space-y-2 font-medium">
          <li>
            <nuxt-link
              :to="localePath('/dashboard/chat')"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
            >
              <Icon name="uil:chat" color="black" />
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("chat")
              }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              :to="localePath('/dashboard/media')"
            >
              <Icon name="uil:images" color="black" />
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("my media")
              }}</span></nuxt-link
            >
          </li>
          <li>
            <nuxt-link
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              :to="useLocalePath()('/dashboard/media/upload')"
            >
              <Icon name="uil:upload" color="black" />
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("upload media")
              }}</span>
            </nuxt-link>
          </li>
          <li>
            <a
              href="#"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              @click.stop="logout"
            >
              <Icon name="uil:exit" color="black" />
              <span class="ms-3 flex-1 whitespace-nowrap">{{
                $t("layout.logout")
              }}</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>

    <div class="p-4 sm:ml-64" :class="{ 'blur-sm': isMenuOpen }">
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
