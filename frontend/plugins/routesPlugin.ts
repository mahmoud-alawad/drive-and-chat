export default defineNuxtPlugin((nuxtApp) => {
  console.log(nuxtApp);

  nuxtApp.hook("pages:extend", (pages: any) => {
    console.log(pages);

    // pages.map((page) => {
    //   nuxtApp.forEach((seoRoute) => {
    //     if (seoRoute.name === page.name) {
    //       Object.assign(page, { path: seoRoute.path });
    //     }
    //   });
    // });
  });
});
