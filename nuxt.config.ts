import vuetify from "vite-plugin-vuetify";

process.env.title = "Frontend";

const config = defineNuxtConfig({
  ssr: false,
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
//      titleTemplate: "%s - " + process.env.APP_TITLE,
      title: process.env.APP_TITLE || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: process.env.npm_package_description || "",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: process.env.APP_FAVICON || "/favicon.ico" },
      ],
    },

    // pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    public: {
      app: {
        title: process.env.APP_TITLE || "Theater tickets",
      },
      api: {
        base: `${process.env.API_BASE || ""}/api`,
        routes: {
          auth: {
            login: "/auth/login",
          },
          profile: {
            index: "/auth/me",
          },
        },
      },
      client: process.env.APP_CLIENT,
      logo: process.env.APP_LOGO,
      teruggave_termijn: process.env.TERUGGAVE_TERMIJN,
    },
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    "@vueuse/nuxt",
    // // Doc: https://axios.nuxtjs.org/usage
    // "@nuxtjs/axios",
    // // Doc: https://github.com/nuxt-community/dotenv-module
    // "@nuxtjs/proxy",
    // "@nuxtjs/auth",
    // "@nuxtjs/vuetify",
    (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config, { isClient }) => {
        if (isClient && config.plugins) {
          config.plugins.push(
            vuetify({
              autoImport: true,
              styles: {
                configFile: "assets/scss/settings.scss",
              },
            }),
          );
        }
      });
    },
  ],

  // proxy: {
  //   options: {
  //     target: process.env.API_BASEURL,
  //     pathFilter: "/api",
  //   },
  // },

  auth: {
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/",
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/",
            method: "post",
            propertyName: "token",
          },
          user: {
            url: "/auth/me",
            method: "get",
            propertyName: "user",
          },
          logout: false,
        },
      },
    },
  },

  nitro: {
    devProxy: {
      "/api": {
        target: process.env.API_BASEURL,
        changeOrigin: true,
      },
    },
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** SSR debuging
     * https://medium.com/js-dojo/debugging-nuxt-js-with-vs-code-60a1a9e75cf6
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  },
});

// console.log(config);
export default config;
