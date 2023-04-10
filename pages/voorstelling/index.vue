<template>
  <v-card>
    <VoorstellingList v-if="voorstellingen" :voorstellingen="voorstellingen" />
  </v-card>
</template>
<script setup lang="ts">
import { IVoorstelling, Voorstelling } from "~~/models";

const { get } = useAPI();
const router = useRouter();
const voorstellingen = ref<Voorstelling[]>();
const data = await get<IVoorstelling[]>("/voorstelling");
if (data.length === 1) {
  router.replace({ name: "voorstelling-id", params: { id: data[0].id } });
} else {
  voorstellingen.value = data.map((v) => new Voorstelling(v));
}
</script>
