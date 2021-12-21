<template>
  <v-app>
    <Navbar />
    <notifications position="top left" />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/NavBar.vue";

// TODO: Remove when Nuxt bug is fixed and apply in nuxt.config.js
// See: https://github.com/nuxt/nuxt.js/issues/4219
// import '@/assets/variables.scss'

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.v-main .container {
  max-width: 1000px;
}
</style>
