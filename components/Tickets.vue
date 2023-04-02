<template>
  <v-container class="tickets">
    <ticket
      v-for="ticket in reservering.tickets"
      :key="ticket.prijs.id"
      v-model:aantal-tekoop="aantalTekoop"
      v-model:aantal="ticket.aantal"
      :ticket="ticket"
      :reservering="reservering"
      :factor="factor"
      :rules="rules"
    >
    </ticket>
    <v-text-field v-model="aantal" type="hidden" :rules="rules" variant="solo"/>
  </v-container>
</template>

<script setup lang="ts">
import { Reservering } from "~~/models";
import { Rule } from "~~/types/rule";

const props = defineProps<{
  reservering: Reservering;
  rules: Rule[];
}>();

const aantalTekoop = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantalTekoop, 0),
);

const aantal = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantal, 0),
);

const totaalBedrag = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.tebetalen, 0),
);

const saldoTekst = computed(() => {
  if (!props.reservering.id || totaalBedrag.value === 0) return "bedrag";
  return totaalBedrag.value < 0 ? "teruggave" : "bijbetalen";
});

const factor = computed(() => (saldoTekst.value === "teruggave" ? -1 : 1));
</script>
<style lang="scss">
.tickets {
  .totaal {
    font-size: large;
  }
}
</style>
