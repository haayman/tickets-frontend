<template>
  <v-container v-if="voorstelling">
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
          <v-text-field
            v-model="voorstelling.poster"
            label="Poster"
            type="url"
          />
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
    <v-card class="mx-auto">
      <v-card-title>Prijzen</v-card-title>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th>Omschrijving</th>
              <th>Prijs</th>
              <th>Benodigde rol voor uitgifte</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prijs in voorstelling.prijzen" :key="prijs.id">
              <td>
                <v-input v-model="prijs.description" />
              </td>
              <td>
                <v-input
                  v-model.number="prijs.prijs"
                  prepend-icon="euro"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </td>
              <td>
                <v-select v-model="prijs.role" :items="roles"> </v-select>
              </td>
              <td>
                <button
                  class="btn btn-danger"
                  @click.prevent="deletePrijs(prijs)"
                >
                  Verwijderen
                </button>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
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
      prijs: new Prijs(),
      uitvoering: new Uitvoering(),
      errors: {},
    };
  },

  mounted() {
    this.get();
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
    id() {
      return this.$route.params.id;
    },
    dirty() {
      this.voorstelling && this.voorstelling.isDirty;
    },
    roles() {
      return [
        { text: "Iedereen", value: null },
        ...RoleList.map((role) => ({ text: role.description, value: role.id })),
      ];
    },
    voorstelling() {
      return Voorstelling.query()
        .with("prijzen")
        .with("uitvoeringen")
        .find(this.$route.params.id);
    },
  },

  methods: {
    get: async function () {
      if (this.id) {
        await this.getVoorstelling();
        this.copyUitvoering();
      }
    },

    async getVoorstelling() {
      const { entities } = await Voorstelling.api().get(
        `/voorstelling/${this.id}`,
        {
          params: {
            include: ["prijzen", "uitvoeringen"],
          },
        }
      );
    },

    async addPrijs() {
      this.voorstelling.prijzen.add(this.prijs);

      this.prijs = new Prijs({});
    },

    deletePrijs(prijs) {
      this.voorstelling.prijzen.remove(prijs);
    },

    copyUitvoering() {
      const lastUitvoering = [...this.voorstelling.uitvoeringen].pop();
      if (lastUitvoering) {
        this.uitvoering = new Uitvoering({
          aantal_plaatsen: lastUitvoering.aantal_plaatsen,
          aanvang: addDays(lastUitvoering.aanvang, 1),
          deur_open: addDays(lastUitvoering.deur_open, 1),
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
              params: { id: this.voorstelling.id },
            });
          } else {
            this.$router.push({
              name: "voorstelling-list",
            });
          }
        })
        .catch((error) => {
          let errors = error.errors || {};

          if (error.message) {
            errors.general = error.message;
          }
          this.errors = errors;
        });
    },
  },
};
</script>
