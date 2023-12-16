export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:finish", () => {
    const loadingElement = document.querySelector("#loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  });
});
