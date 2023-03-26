<template>
  <v-container>
    <VoorstellingSummary
      v-for="voorstelling in voorstellingen"
      :key="voorstelling.id"
      :voorstelling="voorstelling"
    />
  </v-container>
</template>
<script setup lang="ts">
import { Voorstelling } from "~~/models";

defineProps<{
  voorstellingen: Voorstelling[];
}>();
</script>
