<template>
  <v-container>
    <v-card class="mx-auto">
      <v-form @submit.prevent="save">
        <v-card-title>Nieuwe gebruiker</v-card-title>

        <v-card-text>
          <v-text-field v-model="user.username" type="text" label="Gebruikersnaam" required />

          <v-text-field v-model="user.name" type="text" label="Naam" required />

          <v-text-field v-model="user.email" type="email" label="E-mail" required />

          <v-text-field
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            label="Wachtwoord"
            required
            :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
            @click:append="() => (showPassword = !showPassword)"
          />

          <v-select v-if="isAdmin" v-model="user.role" :items="roleOptions" label="Rol" />

          <v-text-field v-else v-model="user.role" readonly label="Rol" />
        </v-card-text>

        <v-card-actions>
          <v-alert v-if="errors['general']" type="error"> {{ errors.general }} </v-alert>

          <v-btn type="submit" color="primary"> Opslaan </v-btn>

          <v-btn :to="{ name: 'beheer-gebruiker' }" color="secondary"> annuleren </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { User } from "~~/models/User";
import { RoleList } from "~~/models/Role";

export default {
  name: "UsersEdit",
  data() {
    return {
      user: new User(),
      roles: RoleList,
      errors: {},
      showPassword: false,
    };
  },

  computed: {
    ...mapGetters(["isAdmin"]),
    roleOptions() {
      return RoleList.map((r) => ({ value: r.id, text: r.description }));
    },
  },

  methods: {
    async save() {
      try {
        await this.$axios.post("/user", this.user);
        this.$router.push({ name: "beheer-gebruiker" });
      } catch (error) {
        const errors = error.errors || {};

        if (error.message) {
          errors.general = error.message;
        }
        this.errors = errors;
      }
    },
  },
};
</script>
