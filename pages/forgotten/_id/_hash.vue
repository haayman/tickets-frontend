<template>
  <v-form @submit.prevent="save" class="{saving:user.saving}">
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title>Wachtwoord instellen</v-card-title>
      <v-card-text>
        <v-alert color="error" v-if="errors['general']">{{ errors.general }}</v-alert>
        <v-text-field v-model="user.username" label="Gebruikersnaam" readonly />
        <v-text-field v-model="user.name" label="Naam" readonly />
        <v-text-field v-model="user.email" label="E-mail" readonly />
        <v-alert v-if="errors.password">{{ errors.password }}</v-alert>
        <v-text-field
          label="Wachwoord"
          v-model="user.password"
          :rules="[rules.required, rules.strength]"
          validate-on-blur
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-progress-linear
          :background-opacity="opacity"
          :color="color.color"
          :value="color.value"
          :height="8"
          rounded
        ></v-progress-linear>
        <div class="mt-3 text-muted font-italic" v-if="showSuggestions">
          <ul>
            <li v-if="warning">{{ warning }}</li>
            <li v-if="crackTime">Hacked within {{ crackTime }}</li>
            <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
          </ul>
        </div>

        <v-alert v-if="saved">
          Wachtwoord opgeslagen. <nuxt-link to="/login">log in</nuxt-link> in om verder te gaan
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="mt-3" v-if="!saved" type="submit" :disabled="score < 3" color="primary">
          Opslaan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { User } from "~/models/User";
import axios from "axios";
import parseError from "~/components/parseError";

export default {
  name: "UsersPassword",
  data() {
    return {
      user: {},
      errors: {},
      showPassword: false,
      saved: false,
      score: 0,
      warning: "",
      suggestions: [],
      crackTime: 0,
      rules: {
        required: (value) => !!value || "Vul een wachtwoord in",
        strength: (v) => this.score >= 3 || "Wachtwoord is niet sterk genoeg",
      },
      opacity: 0.75,
    };
  },

  computed: {
    color() {
      const score = this.score;
      if (score >= 4) return { color: "light-blue", value: 100 };
      if (score == 3) return { color: "light-green", value: 75 };
      if (score == 2) return { color: "yellow", value: 50 };
      if (score == 1) return { color: "orange", value: 20 };
      return { color: "red", value: 0 };
    },
    showSuggestions() {
      return this.user.password && this.suggestions && !this.saved;
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
            userInputs: [...this.user.name, this.user.email, this.user.username],
          })
          .then((response) => response.data);
        this.score = result.score;
        this.warning = result.feedback?.warning;
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
