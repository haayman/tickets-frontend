<template>
  <nav>
    <v-app-bar app flat>
      <v-toolbar-title>
        <nuxt-link :to="{ name: 'index' }" class="v-toolbar__brand">
          {{ title }}
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <template v-if="isAuthenticated">
        <v-btn icon :to="{ name: 'index' }">
          <v-icon>fa-map</v-icon>
        </v-btn>

        <v-menu transition="slide-y-transition" left bottom offset-y>
          <template v-slot:activator="{ on }">
            <v-btn id="btn-admin" icon exact v-on="on">
              <v-icon>fa-tachometer-alt</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item nuxt :to="{ path: '/beheer' }">
              <v-list-item-title>
                Admin panel
              </v-list-item-title>
            </v-list-item>
            <v-list-item nuxt :to="{ path: '/beheer/voorstelling' }">
              <v-list-item-title>
                Voorstellingen
              </v-list-item-title>
            </v-list-item>
            <v-list-item nuxt :to="{ path: '/beheer/gebruiker' }">
              <v-list-item-title>
                Gebruikers
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu transition="slide-y-transition" left bottom offset-y>
          <template v-slot:activator="{ on }">
            <v-btn id="btn-account" icon exact v-on="on">
              <v-icon>fa-user-circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn :to="{ name: 'login' }" text>
          Login
        </v-btn>
      </template>
    </v-app-bar>
  </nav>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAdmin', 'isAuthenticated']),
    title() {
      return 'Theater tickets'
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>

<style lang="scss">
.v-app-bar {
  .v-btn--round::before,
  .v-btn--active {
    background-color: transparent;
  }

  .cart-link {
    position: relative;
  }

  .cart-counter {
    position: absolute;
    top: -10px;
    right: 0;
    width: 16px;
    height: 16px;
    padding-left: 1px;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    background-color: #be1818;
    color: #fff;
    border-radius: 100%;
  }
}
</style>
