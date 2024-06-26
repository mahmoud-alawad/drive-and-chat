<script setup lang="ts">
const authStore = useAuthStore();
const { error, loading } = storeToRefs(authStore);
// const localePath = useLocalePath();
const token = useCookie("token");
await authStore.authenticateUser();
</script>
<template>
  <div class="flex h-screen text-gray-800 antialiased">
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
    <div class="flex h-full w-full flex-row overflow-x-hidden">
      <div class="flex w-64 flex-shrink-0 flex-col bg-white py-8 pl-6 pr-2">
        <div class="flex h-12 w-full flex-row items-center justify-center">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div class="ml-2 text-2xl font-bold">QuickChat</div>
        </div>
        <div
          class="mt-4 flex w-full flex-col items-center rounded-lg border border-gray-200 bg-indigo-100 px-4 py-6"
        >
          <div class="h-20 w-20 overflow-hidden rounded-full border">
            <img
              src="https://avatars3.githubusercontent.com/u/2763884?s=128"
              alt="Avatar"
              class="h-full w-full"
            />
          </div>
          <div class="mt-2 text-sm font-semibold">Aminos Co.</div>
          <div class="text-xs text-gray-500">Lead UI/UX Designer</div>
          <div class="mt-3 flex flex-row items-center">
            <div
              class="flex h-4 w-8 flex-col justify-center rounded-full bg-indigo-500"
            >
              <div class="mr-1 h-3 w-3 self-end rounded-full bg-white"></div>
            </div>
            <div class="ml-1 text-xs leading-none">Active</div>
          </div>
        </div>
        <div class="mt-8 flex flex-col">
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">Active Conversations</span>
            <span
              class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300"
              >4</span
            >
          </div>
          <div class="-mx-2 mt-4 flex h-48 flex-col space-y-1 overflow-y-auto">
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200"
              >
                H
              </div>
              <div class="ml-2 text-sm font-semibold">Henry Boyd</div>
            </button>
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
              >
                M
              </div>
              <div class="ml-2 text-sm font-semibold">Marta Curtis</div>
              <div
                class="ml-auto flex h-4 w-4 items-center justify-center rounded bg-red-500 text-xs leading-none text-white"
              >
                2
              </div>
            </button>
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200"
              >
                P
              </div>
              <div class="ml-2 text-sm font-semibold">Philip Tucker</div>
            </button>
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-200"
              >
                C
              </div>
              <div class="ml-2 text-sm font-semibold">Christine Reid</div>
            </button>
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200"
              >
                J
              </div>
              <div class="ml-2 text-sm font-semibold">Jerry Guzman</div>
            </button>
          </div>
          <div class="mt-6 flex flex-row items-center justify-between text-xs">
            <span class="font-bold">Archivied</span>
            <span
              class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300"
              >7</span
            >
          </div>
          <div class="-mx-2 mt-4 flex flex-col space-y-1">
            <button
              class="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200"
              >
                H
              </div>
              <div class="ml-2 text-sm font-semibold">Henry Boyd</div>
            </button>
          </div>
        </div>
      </div>
      <div class="flex h-full flex-auto flex-col p-6">
        <div
          class="flex h-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4"
        >
          <div class="mb-4 flex h-full flex-col overflow-x-auto">
            <div class="flex h-full flex-col">
              <div class="grid grid-cols-12 gap-y-2">
                <div class="col-start-1 col-end-8 rounded-lg p-3">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow"
                    >
                      <div>Hey How are you today?</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 rounded-lg p-3">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Vel ipsa commodi illum saepe numquam maxime
                        asperiores voluptate sit, minima perspiciatis.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 rounded-lg p-3">
                  <div class="flex flex-row-reverse items-center justify-start">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow"
                    >
                      <div>I'm ok what about you?</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 rounded-lg p-3">
                  <div class="flex flex-row-reverse items-center justify-start">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow"
                    >
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 rounded-lg p-3">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow"
                    >
                      <div>Lorem ipsum dolor sit amet !</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 rounded-lg p-3">
                  <div class="flex flex-row-reverse items-center justify-start">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow"
                    >
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                      <div
                        class="absolute bottom-0 right-0 -mb-5 mr-2 text-xs text-gray-500"
                      >
                        Seen
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 rounded-lg p-3">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow"
                    >
                      <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Perspiciatis, in.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 rounded-lg p-3">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow"
                    >
                      <div class="flex flex-row items-center">
                        <button
                          class="flex h-8 w-10 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-800"
                        >
                          <svg
                            class="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            ></path>
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </button>
                        <div class="ml-4 flex flex-row items-center space-x-px">
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-4 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-10 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-10 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-12 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-10 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-6 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-5 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-4 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-3 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-10 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-10 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-1 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-1 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-8 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-2 w-1 rounded-lg bg-gray-500"></div>
                          <div class="h-4 w-1 rounded-lg bg-gray-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4"
          >
            <div>
              <button
                class="flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="ml-4 flex-grow">
              <div class="relative w-full">
                <input
                  type="text"
                  class="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                />
                <button
                  class="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="ml-4">
              <button
                class="flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
              >
                <span>Send</span>
                <span class="ml-2">
                  <svg
                    class="-mt-px h-4 w-4 rotate-45 transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
