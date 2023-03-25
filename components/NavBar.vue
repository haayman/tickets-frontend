<template>
  <nav>
    <v-app-bar app>
      <v-container class="py-0 fill-height">
        <v-toolbar-title>
          <nuxt-link :to="{ name: 'index' }" class="v-toolbar__brand"> {{ title }} </nuxt-link>
        </v-toolbar-title>

        <v-spacer />

        <v-btn v-for="link in links" :key="link.title" :to="{ path: link.link }">
          {{ link.title }}
        </v-btn>

        <v-spacer />

        <v-btn v-if="user" @click="logout">Log uit {{ userName }}</v-btn>

        <v-btn v-else :to="{ name: 'login' }">Leden login</v-btn>
      </v-container>
    </v-app-bar>
  </nav>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const title = config.public.app.title;

const { user, isAdministrator, logout } = useAuth();

const userName = computed(() => {
  return user.value?.username || "";
});

const links = computed(() => {
  const links = [
    {
      title: "Bestellen",
      link: "/reserveren",
    },
  ];

  if (user.value) {
    links.push({
      title: "Reserveringen",
      link: "/beheer/reserveringen",
    });
    links.push({
      title: "Logs",
      link: "/beheer/logs",
    });
  }

  if (isAdministrator.value) {
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
});
</script>

<style lang="scss">
.v-app-bar {
  .v-btn--round::before,
  .v-btn--active {
    background-color: transparent;
  }
}
.v-tool-bar {
  &__brand {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }
}
</style>
