<template>
  <v-container>
    <VoorstellingSummary
      v-for="voorstelling in voorstellingen"
      :key="voorstelling.id"
      :voorstelling="voorstelling"
      class="voorstelling-summary p-3"
      @click="toVoorstelling(voorstelling.id)"
    />
  </v-container>
</template>
<script setup lang="ts">
import { ExistingVoorstelling } from "~~/models";

const router = useRouter();

defineProps<{
  voorstellingen: ExistingVoorstelling[];
}>();

function toVoorstelling(id: number) {
  router.push({ name: "voorstelling-id", params: { id } });
}
</script>
<type lang="scss">
.voorstelling-summary {
  cursor: pointer;
}
</type>
