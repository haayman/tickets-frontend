<template>
  <nav>
    <v-app-bar app>
      <nuxt-link :to="{ name: 'index' }" style="height: 100%">
        <img :src="config.public.logo" style="height: 100%" />
      </nuxt-link>

      <v-btn v-for="link in links" :key="link.title" :to="{ path: link.link }">
        {{ link.title }}
      </v-btn>

      <v-spacer />

      <v-btn v-if="user" @click="logout">log uit {{ userName }}</v-btn>

      <v-btn v-else :to="{ name: 'login' }">leden login</v-btn>
    </v-app-bar>
  </nav>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const { user, isAdministrator, logout } = useAuth();

const userName = computed(() => {
  return user.value?.name || "";
});

const links = computed(() => {
  const links = [
    {
      title: "bestellen",
      link: "/reserveren",
    },
  ];

  if (user.value) {
    links.push({
      title: "reserveringen",
      link: "/beheer/reserveringen",
    });
    links.push({
      title: "logs",
      link: "/beheer/logs",
    });
  }

  if (isAdministrator.value) {
    links.push({
      title: "voorstelling",
      link: "/beheer/voorstelling/",
    });
    links.push({
      title: "gebruikers",
      link: "/beheer/gebruiker",
    });
    links.push({
      title: "e-mail",
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
