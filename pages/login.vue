<template>
  <v-container>
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title>Login</v-card-title>
      <v-card-text>
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

          <v-btn type="submit" depressed color="primary">Log In</v-btn>
          <v-btn color="secondary" @click="forgotten = !forgotten">Wachtwoord vergeten</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card v-if="forgotten" class="mx-auto mt-2" max-width="400" outlined>
      <v-card-title>Wachtwoord vergeten</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendForgotten">
          <v-text-field v-model="username" required label="gebruikersnaam" />
          <v-btn color="primary" type="submit">Stuur link</v-btn>
        </v-form>
        <v-alert v-if="forgottenSent">Controleer je e-mail</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
      forgotten: false,
      forgottenSent: false,
    };
  },

  methods: {
    async login() {
      this.error = null;

      try {
        await this.$auth.loginWith("local", {
          data: {
            username: this.username,
            password: this.password,
          },
        });

        this.$router.push("/");
      } catch (e) {
        if (e.response !== undefined) {
          this.error = e.response.data.message;
        } else {
          this.error = `Server problem: ${e}`;
        }
      }
    },
    sendForgotten() {
      this.error = false;
      this.$axios
        .post("/user/forgotten", {
          username: this.username,
        })
        .then((request) => {
          this.forgottenSent = true;
        })
        .catch((e) => {
          this.error = e.response.statusText || e.message;
        });
    },
  },
};
</script>
