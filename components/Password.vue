<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="alert alert-danger" v-if="errors['general']">{{ errors.general }}</div>
      <form @submit.prevent="save" class="{saving:user.saving}">
        <div class="form-group">
          <label for="user-username">Gebruikersnaam</label>
          <input
            id="user-username"
            v-model="user.username"
            type="text"
            readonly
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="user-name">Naam</label>
          <input id="user-name" v-model="user.name" type="text" readonly class="form-control" />
        </div>
        <div class="form-group">
          <label for="user-phone">E-mail</label>
          <input id="user-phone" v-model="user.email" type="email" readonly class="form-control" />
        </div>
        <div class="form-group">
          <div class="alert alert-danger" v-if="errors['password']">{{ errors.password }}</div>
          <label for="password">Wachtwoord</label>
          <vue-password
            id="password"
            v-model="user.password"
            :userInputs="[user.username, user.name, user.email]"
            :disableToggle="false"
            :score="score"
            @input="updateScore"
            :strengthMessages="['Zeer zwak', 'Zwak', 'Middelmatig', 'Sterk', 'Zeer sterk']"
          >
          </vue-password>
          <div class="text-muted font-italic" v-if="suggestions" v-html="suggestions"></div>
        </div>

        <div class="alert alert-secondary" v-if="saved">
          Wachtwoord opgeslagen. Log in om verder te gaan
        </div>

        <button v-if="!saved" type="submit" :disabled="score < 3" class="btn btn-primary">
          Bijwerken
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { User } from "../models/User";
import { mapGetters } from "vuex";
import parseError from "./parseError";
import axios from "axios";

export default {
  name: "UsersPassword",
  data() {
    return {
      user: {},
      errors: {},
      passwordType: "password",
      hash: this.$route.params.hash,
      saved: false,
      score: 0,
      suggestions: "",
    };
  },

  computed: {
    ...mapGetters(["activeUser"]),
  },

  mounted: function () {
    this.get();
  },

  watch: {
    $route: "get",
  },

  methods: {
    get: function () {
      this.getUser();
    },

    async getUser() {
      try {
        this.user = new User(this.$route.params);
        await this.user.fetch({ params: this.$route.params });

        // standaard heeft User geen password.
        this.user.set("password", "");
      } catch (e) {
        this.errors.general = parseError(e);
      }
    },

    async save() {
      this.user
        .save({ params: { hash: this.hash } })
        .then(() => {
          this.user.password = ""; // voorkom dat hash wordt getoond
          this.saved = true;
        })
        .catch((error) => {
          let errors = error.errors || {};

          if (error.message) {
            errors.general = error.message;
          }
          this.errors = errors;
        });
    },

    async updateStrength(password, userInputs) {
      try {
        const result = await axios
          .post("/api/auth/checkPassword", {
            password: password,
            userInputs: userInputs,
          })
          .then((response) => response.data);
        this.score = result.score;
        this.suggestions = result.feedback.suggestions.join("<br />");
      } catch (ex) {
        this.errors.general = parseError(ex);
        this.score = 0;
      }
    },
  },
};
</script>
