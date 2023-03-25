<template>
  <v-card v-if="voorstelling" class="mt-3">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <h1>{{ voorstelling.title }}</h1>

            <p
              v-if="voorstelling.description"
              class="mt-3"
              style="white-space: pre-wrap"
              v-html="voorstelling.description"
            ></p>

            <p v-if="voorstelling.locatie" v-html="voorstelling.locatie"></p>

            <p v-if="voorstelling.url">
              <a :href="voorstelling.url" target="_blank">Meer informatie</a>
            </p>

            <p v-if="voorstelling.opmerkingen" v-html="voorstelling.opmerkingen"></p>
          </v-col>

          <v-col v-if="voorstelling.poster" md="4">
            <img :src="voorstelling.poster" style="max-height: 400px" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { IVoorstelling } from "~~/models";

const { get } = useAPI();

const voorstelling = ref<IVoorstelling | null>();

onMounted(async () => {
  const data = await get<IVoorstelling[]>("/voorstelling");
  voorstelling.value = data[0];
});
</script>
