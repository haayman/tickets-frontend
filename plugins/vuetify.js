import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";
import { md3 } from "vuetify/blueprints";
import { nl, en } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// import "~/assets/scss/main.scss";

// const ticketsStyle = { ...md3 };

// if (ticketsStyle.defaults) {
//   ticketsStyle.defaults.VBtn = {
//     elevation: 0,
//     rounded: "xl",
//   };
//   ticketsStyle.defaults.VCard = {};
//   ticketsStyle.defaults.VTextField = {
//     variant: "outlined",
//   };
//   ticketsStyle.defaults.VSelect = {
//     variant: "outlined",
//   };
// }

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: { ...components, VDataTable },
    directives,
    blueprint: md3,
    ssr: true,
    locale: {
      locale: "nl",
      fallback: "en",
      messages: { nl, en },
    },
    theme: {
      defaultTheme: "dark",
      themes: {
        light: {
          colors: {
            primary: "#f0940a",
          },
        },
        dark: {
          colors: {
            background: "#1e1e1e",
            surface: "#3e3e3e",
            primary: "#f0940a",
            secondary: "#272727",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
