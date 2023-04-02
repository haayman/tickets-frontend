<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container>
        <slot />
      </v-container>
      <NotifcationRenderer />
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

.v-main .v-container {
  max-width: 1000px;
}
</style>
