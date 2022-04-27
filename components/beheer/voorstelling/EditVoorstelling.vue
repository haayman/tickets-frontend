<template>
  <v-container v-if="voorstelling">
    <v-form @submit.prevent="save" v-if="voorstelling">
      <v-card class="mx-auto">
        <v-card-title>Voorstelling</v-card-title>
        <v-card-text>
          <v-alert v-if="errors['general']">
            {{ errors.general }}
          </v-alert>
          <v-text-field v-model="voorstelling.title" required label="Titel" />
          <v-text-field v-model="voorstelling.description" required label="Omschrijving" />
          <v-text-field v-model="voorstelling.url" label="URL" type="url" />
          <v-text-field v-model="voorstelling.locatie" label="Locatie" />
          <v-textarea v-model="voorstelling.opmerkingen" label="Opmerkingen" />
          <v-text-field v-model="voorstelling.poster" label="Poster" type="url" />
          <img v-if="voorstelling.poster" :src="voorstelling.poster" class="mh-300 mt-2" />
          <v-text-field v-model="voorstelling.thumbnail" label="Thumbnail" type="url" />
          <img
            v-if="voorstelling.thumbnail"
            :src="voorstelling.thumbnail"
            class="mh-300 mt-2 thumbnail"
          />
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-card-title>Prijzen</v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
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
                    <v-text-field v-model="prijs.description" />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="prijs.prijs"
                      prefix="€"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <v-select v-model="prijs.role" :items="roles"> </v-select>
                  </td>
                  <td>
                    <v-btn color="warning" @click.prevent="deletePrijs(prijs)"> Verwijderen </v-btn>
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-text-field v-model="prijs.description" />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="prijs.prijs"
                      prefix="€"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <v-select v-model="prijs.role" :items="roles"> </v-select>
                  </td>
                  <td>
                    <v-btn color="primary" @click.prevent="addPrijs()"> Toevoegen </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-card-title>Uitvoeringen</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>Aantal plaatsen</th>
                <th>Aanvang</th>
                <th>Deur open</th>
                <th>extra tekst</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <EditUitvoering
                v-for="uitvoering in voorstelling.uitvoeringen"
                :uitvoering="uitvoering"
                :deletable="true"
                :key="uitvoering.id"
                @delete="deleteUitvoering"
              >
              </EditUitvoering>
              <EditUitvoering :uitvoering="uitvoering" @save="addUitvoering" :deletable="false" />
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-alert type="error" v-if="errors['general']">
          {{ errors.general }}
        </v-alert>
        <v-card-text>
          <v-btn type="submit" color="primary">
            {{ !voorstelling.id ? "Toevoegen" : "Bijwerken" }}
          </v-btn>
          <router-link :to="{ name: 'beheer-voorstelling' }" color="secondary">
            annuleren
          </router-link>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import { Prijs } from "~/models/Prijs";
import { Uitvoering } from "~/models/Uitvoering";
import { RoleList } from "~/models/Role";

import { addDays } from "date-fns";
import EditUitvoering from "./EditUitvoering.vue";

export default {
  name: "VoorstellingEdit",
  props: {
    voorstelling: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      prijs: new Prijs(),
      uitvoering: new Uitvoering(),
      errors: {},
    };
  },
  components: {
    EditUitvoering,
    EditUitvoering,
    EditUitvoering,
  },

  beforeRouteLeave(to, from, next) {
    if (!this.dirty) {
      next();
      return;
    }

    if (confirm("Nog niet opgeslagen\n. Weet je zeker dat je de pagina wilt verlaten?")) {
      next();
    } else {
      next(false);
    }
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
    roles() {
      return [
        { text: "Iedereen", value: null },
        ...RoleList.map((role) => ({ text: role.description, value: role.id })),
      ];
    },
  },

  mounted() {
    this.copyUitvoering();
  },

  methods: {
    async addPrijs() {
      this.voorstelling.prijzen.push(this.prijs);
      this.voorstelling.prijzen = [...this.voorstelling.prijzen].sort((a, b) => b.prijs - a.prijs);

      this.prijs = new Prijs();
    },

    deletePrijs(prijs) {
      if (!prijs.id || confirm("Weet je zeker dat je deze prijs wilt verwijderen?")) {
        this.voorstelling.prijzen = this.voorstelling.prijzen
          .filter((p) => p !== prijs)
          .sort((a, b) => b.prijs - a.prijs);
      }
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
      this.voorstelling.uitvoeringen.push(uitvoering);
      this.voorstelling.uitvoeringen = [...this.voorstelling.uitvoeringen].sort(
        (a, b) => a.aanvang - b.aanvang,
      );

      this.copyUitvoering();
    },

    deleteUitvoering(uitvoering) {
      this.voorstelling.uitvoeringen = this.voorstelling.uitvoeringen
        .filter((u) => u !== uitvoering)
        .sort((a, b) => a.aanvang - b.aanvang);
    },

    async save() {
      let stayOnPage = !this.voorstelling.id;
      const voorstelling = this.voorstelling;
      try {
        if (this.voorstelling.id) {
          await this.$axios.put(`/voorstelling/${voorstelling.id}`, voorstelling.serialize());
        } else {
          await this.$axios.post(`/voorstelling/`, voorstelling.serialize());
        }
        if (stayOnPage) {
          this.$router.push({
            name: "beheer-voorstelling-id",
            params: { id: this.voorstelling.id },
          });
        } else {
          this.$router.push({
            name: "beheer-voorstelling",
          });
        }
      } catch (error) {
        let errors = error.errors || {};

        if (error.message) {
          errors.general = error.message;
        }
        this.errors = errors;
      }
    },
  },
};
</script>
<style>
.thumbnail {
  max-height: 100px;
}
</style>
