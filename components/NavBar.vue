<template>
  <nav>
    <v-app-bar app>
      <v-container class="py-0 fill-height">
        <v-toolbar-title>
          <nuxt-link :to="{ name: 'index' }" class="v-toolbar__brand">
            {{ title }}
          </nuxt-link>
        </v-toolbar-title>

        <v-spacer />

        <v-btn v-for="link in links" :key="link.title" text :to="{ path: link.link }">
          {{ link.title }}
        </v-btn>

        <v-spacer />

        <v-btn v-if="isAuthenticated" @click="logout" text>Log uit {{ userName }}</v-btn>
        <v-btn v-else :to="{ name: 'login' }" text>Leden login</v-btn>
      </v-container>
    </v-app-bar>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAdmin", "isAuthenticated", "isKassa", "isSpeler", "loggedInUser"]),
    title() {
      return "Theater tickets";
    },

    userName() {
      return this.loggedInUser?.name || "";
    },
    links() {
      const links = [];
      if (this.isAuthenticated) {
        links.push({
          title: "Bestellen",
          link: "/reserveren/",
        });
      }
      if (this.isKassa) {
        links.push({
          title: "Kassa",
          link: "/kassa/",
        });
      }
      if (this.isSpeler) {
        links.push({
          title: "Reserveringen",
          link: "/beheer/reserveringen/",
        });
        links.push({
          title: "Logs",
          link: "/beheer/logs/",
        });
      }
      if (this.isAdmin) {
        links.push({
          title: "Voorstelling",
          link: "/beheer/voorstelling/",
        });
        links.push({
          title: "Gebruikers",
          link: "/beheer/gebruiker",
        });
        links.push({
          title: "Verstuur e-mail",
          link: "/beheer/mail",
        });
      }
      return links;
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style lang="scss">
.v-app-bar {
  .v-btn--round::before,
  .v-btn--active {
    background-color: transparent;
  }
}
</style>
