<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

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
