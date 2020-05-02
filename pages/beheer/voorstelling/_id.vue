<template>
  <v-card class="mx-auto">
    <v-card-title>Voorstelling {{ dirty ? "*" : "" }}</v-card-title>
    <v-card-text>
      <v-alert v-if="errors['general']">
        {{ errors.general }}
      </v-alert>
      <v-form @submit.prevent="save" v-if="voorstelling">
        <v-text-field v-model="voorstelling.title" required label="Titel" />
        <v-text-field
          v-model="voorstelling.description"
          required
          label="Omschrijving"
        />
        <v-text-field v-model="voorstelling.url" label="URL" type="url" />
        <v-text-field v-model="voorstelling.locatie" label="Locatie" />
        <v-textarea v-model="voorstelling.opmerkingen" label="Opmerkingen" />
        <v-text-field v-model="voorstelling.poster" label="Poster" type="url" />
        <img
          v-if="voorstelling.poster"
          :src="voorstelling.poster"
          class="mh-300 mt-2"
        />
        <v-text-field
          v-model="voorstelling.thumbnail"
          label="Thumbnail"
          type="url"
        />
        <img
          v-if="voorstelling.thumbnail"
          :src="voorstelling.thumbnail"
          class="mh-300 mt-2"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { Voorstelling } from "~/models/Voorstelling";
import { Prijs } from "~/models/Prijs";
import { Uitvoering } from "~/models/Uitvoering";
import { RoleList } from "~/models/Role";

import { mapGetters } from "vuex";
import { addDays } from "date-fns";

export default {
  name: "UsersEdit",
  data() {
    return {
      voorstelling: null,
      prijs: new Prijs(),
      uitvoering: new Uitvoering(),
      errors: {}
    };
  },

  watch: {
    $route: {
      handler: this.get,
      immediate: true
    }
  },

  beforeRouteLeave(to, from, next) {
    if (!this.dirty) {
      next();
      return;
    }

    if (
      confirm(
        "Nog niet opgeslagen\n. Weet je zeker dat je de pagina wilt verlaten?"
      )
    ) {
      next();
    } else {
      next(false);
    }
  },

  computed: {
    dirty() {
      this.voorstelling && this.voorstelling.isDirty;
    }
  },

  methods: {
    get: async function() {
      if (this.$route.params.id) {
        await this.getVoorstelling();
        this.copyUitvoering();
      }
    },

    async getVoorstelling() {
      let voorstelling = new Voorstelling(this.$route.params);
      await voorstelling.fetch({
        params: { include: ["uitvoeringen", "prijzen"] }
      });
      this.voorstelling = voorstelling;
    },

    async addPrijs() {
      this.voorstelling.prijzen.add(this.prijs);

      this.prijs = new Prijs({});
    },

    deletePrijs(prijs) {
      this.voorstelling.prijzen.remove(prijs);
    },

    copyUitvoering() {
      const lastUitvoering = this.voorstelling.uitvoeringen.last();
      if (lastUitvoering) {
        this.uitvoering = new Uitvoering({
          aantal_plaatsen: lastUitvoering.aantal_plaatsen,
          aanvang: addDays(lastUitvoering.aanvang, 1),
          deur_open: addDays(lastUitvoering.deur_open, 1)
        });
      } else {
        this.uitvoering = new Uitvoering();
      }
    },

    async addUitvoering(uitvoering) {
      this.voorstelling.uitvoeringen.add(uitvoering);
      this.voorstelling.uitvoeringen.sort("aanvang");

      this.copyUitvoering();
    },

    deleteUitvoering(uitvoering) {
      this.voorstelling.uitvoeringen.remove(uitvoering);
    },

    async save() {
      let stayOnPage = !this.voorstelling.id;
      this.voorstelling
        .save()
        .then(() => {
          if (stayOnPage) {
            this.$router.push({
              name: "voorstelling-edit",
              params: { id: this.voorstelling.id }
            });
          } else {
            this.$router.push({
              name: "voorstelling-list"
            });
          }
        })
        .catch(error => {
          let errors = error.errors || {};

          if (error.message) {
            errors.general = error.message;
          }
          this.errors = errors;
        });
    }
  }
};
</script>
