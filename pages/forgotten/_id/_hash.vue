<template>
  <v-card>
    <v-card-title>Wachtwoord herstellen</v-card-title>
    <v-card-text>
      <v-alert color="error" v-if="errors['general']">{{ errors.general }}</v-alert>
      <v-form @submit.prevent="save" class="{saving:user.saving}">
        <v-text-field v-model="user.username" label="Gebruikersnaam" readonly />
        <v-text-field v-model="user.name" label="Naam" readonly />
        <v-text-field v-model="user.email" label="E-mail" readonly />
        <v-alert v-if="errors.password">{{ errors.password }}</v-alert>
        <v-text-field
          v-model="user.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.strength]"
          validate-on-blur
          :type="showPassword ? 'text' : 'password'"
          label="Wachwoord"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-progress-linear
          :background-opacity="opacity"
          :color="color"
          :value="score"
        ></v-progress-linear>
        <div class="mt-3 text-muted font-italic" v-if="suggestions && !saved">
          <ul>
            <li v-if="crackTime">Hacked within {{ crackTime }}</li>
            <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
          </ul>
        </div>

        <v-alert v-if="saved">
          Wachtwoord opgeslagen. <nuxt-link to="/login">log in</nuxt-link> in om verder te gaan
        </v-alert>

        <v-btn v-if="!saved" type="submit" :disabled="score < 3" color="primary"> Bijwerken </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { User } from "~/models/User";
import { mapGetters } from "vuex";
import axios from "axios";
import parseError from "~/components/parseError";

export default {
  name: "UsersPassword",
  data() {
    return {
      user: {},
      errors: {},
      showPassword: false,
      hash: this.$route.params.hash,
      saved: false,
      score: 0,
      suggestions: "",
      crackTime: 0,
      rules: {
        required: (value) => !!value || "Vul een wachtwoord in",
        strength: (v) => this.score >= 3 || "Wachtwoord is niet sterk genoeg",
      },
      opacity: 0.75,
    };
  },

  computed: {
    ...mapGetters(["activeUser"]),
    color() {
      const score = this.score;
      if (score >= 4) return "light-blue";
      if (score == 3) return "light-green";
      if (score == 2) return "yellow";
      if (score == 1) return "orange";
      return "red";
    },
  },

  mounted: function () {
    this.get();
  },

  watch: {
    $route: "get",
    "user.password"(password) {
      this.updateStrength(password, Object.values(this.user));
    },
  },

  methods: {
    get: function () {
      this.getUser();
    },

    async getUser() {
      try {
        const { id, hash } = this.$route.params;
        const { data: user } = await this.$axios.get(`/user/${id}?hash=${hash}`);
        this.user = new User(user);

        // standaard heeft User geen password.
        this.user.password = "";
      } catch (e) {
        this.errors.general = parseError(e);
      }
    },

    async save() {
      try {
        const { id, hash } = this.$route.params;
        await this.$axios.put(`/user/${id}?hash=${hash}`, this.user);
        this.saved = true;
      } catch (error) {
        const errors = error.errors || {};

        if (error.message) {
          errors.general = error.message;
        }
        this.errors = errors;
      }
    },

    async updateStrength(password, userInputs) {
      try {
        const result = await axios
          .post("/api/auth/checkPassword", {
            password: password,
          })
          .then((response) => response.data);
        this.score = result.score;
        this.suggestions = result.feedback.suggestions;
        this.crackTime = result.crack_times_display?.offline_slow_hashing_1e4_per_second;
      } catch (ex) {
        this.errors.general = parseError(ex);
        this.score = 0;
      }
    },
  },
};
</script>
