import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";
import { md3 } from "vuetify/blueprints";
import { nl, en } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

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
            primary: "#ffb400",
          },
        },
        dark: {
          colors: {
            background: "#1e1e1e",
            surface: "#3e3e3e",
            primary: "#ffb400",
            secondary: "#272727",
            anchor: "#ffb400",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
