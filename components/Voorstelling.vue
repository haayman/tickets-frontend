<template>
  <v-card class="mt-3" v-if="voorstelling">
    <v-card-title>Voorstelling</v-card-title>
    <v-card-text>
      <h1>{{ voorstelling.title }}</h1>
      <img
        v-if="voorstelling.poster"
        :src="voorstelling.poster"
        class="float-right img-fluid"
        style="max-height: 200px"
      />
      <p
        style="white-space: pre-wrap"
        v-if="voorstelling.description"
        v-html="voorstelling.description"
      ></p>
      <p v-if="voorstelling.locatie" v-html="voorstelling.locatie"></p>
      <p>
        <a :href="voorstelling.url" target="_blank">Meer informatie</a>
      </p>
      <p v-if="voorstelling.opmerkingen" v-html="voorstelling.opmerkingen"></p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Voorstelling",
  data() {
    return {
      voorstelling: null,
    };
  },
  async fetch() {
    const { data: voorstellingen } = await this.$axios.get("/voorstelling");
    this.voorstelling = voorstellingen?.length ? voorstellingen[0] : null;
  },
};
</script>
