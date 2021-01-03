<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title>Voorstellingen</v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="voorstellingen"
        :options.sync="options"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.description }}</td>
            <td>
              <img v-if="props.item.thumbnail" :src="props.item.thumbnail" />
            </td>
            <td>
              <nuxt-link
                :to="{
                  name: 'beheer-voorstelling-id',
                  params: { id: props.item.id },
                }"
              >
                <v-icon>fa-edit</v-icon></nuxt-link
              >
              <a href="#delete" @click.prevent="remove(props.item)">
                <v-icon>fa-trash</v-icon>
              </a>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-btn :to="{ name: 'beheer-voorstelling-create' }" color="primary"
          >Voorstelling toevoegen</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from "vuex";
import { Voorstelling } from "@/models/Voorstelling";

export default {
  data() {
    return {
      loading: false,
      options: {},
      headers: [
        { text: "Titel", value: "title", sortable: false },
        { text: "Omschrijving", value: "description", sortable: false },
        { text: "", value: "thumbnail", sortable: false },
        { text: "actions", value: "name", sortable: false },
      ],
      voorstellingen: [],
    };
  },

  computed: {
    ...mapGetters(["isAdmin"]),
  },
  mounted() {
    this.fetch();
  },

  methods: {
    async fetch() {
      this.loading = true;
      const { data: voorstellingen } = await this.$axios.get("/voorstelling", {
        params: {
          include: ["prijzen", "uitvoeringen"],
        },
      });
      this.voorstellingen = voorstellingen;
      this.loading = false;
    },

    async remove(voorstelling) {
      if (confirm(`Weet je zeker dat je de voorstelling wilt verwijderen?`)) {
        await this.$axios.delete(`/voorstelling/${voorstelling.id}`);
        this.voorstellingen = this.voorstellingen.filter(
          (v) => v.id !== voorstelling.id
        );
      }
    },
  },
};
</script>
