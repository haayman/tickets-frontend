<template>
  <v-container>
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-text>
        <h2 class="display-1 mb-5">Login</h2>

        <v-alert v-if="error" type="error">
          {{ error }}
        </v-alert>

        <v-form method="post" @submit.prevent="login">
          <v-text-field
            v-model="username"
            type="text"
            label="gebruikersnaam"
            data-test="username"
          />
          <v-text-field
            v-model="password"
            type="password"
            label="wachtwoord"
            data-test="password"
          />

          <v-btn type="submit" depressed color="success">Log In</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    }
  },

  methods: {
    async login() {
      this.error = null

      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })

        this.$router.push('/')
      } catch (e) {
        if (e.response !== undefined) {
          this.error = e.response.data.message
        } else {
          this.error = `Server problem: ${e}`
        }
      }
    }
  }
}
</script>
