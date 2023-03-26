<template>
  <div class="overzicht">
    <div class="aantal">
      <v-icon>mdi-ticket-outline</v-icon> {{ aantalKaarten }} {{ kaarten(aantalKaarten) }}
      <span v-if="aantalTekoop" class="tekoop">
        waarvan {{ aantalTekoop }} {{ kaarten(aantalTekoop) }} in de verkoop {{ staat }}
      </span>
    </div>
    <div class="totaal">{{ formatMoney(totaalBedrag) }}</div>
    <div v-if="teBetalen" class="bedrag">
      {{ saldoTekst }} {{ formatMoney(Math.abs(teBetalen)) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Reservering } from "~~/models";

const props = defineProps<{
  reservering: Reservering;
}>();

const originalAantal = ref(0);
const originalBedrag = ref(0);
const originalTekoop = ref(0);

const aantalKaarten = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantal, 0),
);

const aantalTekoop = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantalTekoop, 0),
);

const teBetalen = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.tebetalen, 0),
);

const totaalBedrag = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.totaal, 0),
);

const saldoTekst = computed(() => {
  if (!props.reservering.id || teBetalen.value === 0) return "bedrag";
  return teBetalen.value < 0 ? "teruggave" : "bijbetalen";
});

function kaarten(aantal: number) {
  return aantal === 1 ? "kaart" : "kaarten";
}

const staat = computed(() => (aantalTekoop.value === 1 ? "staat" : "staan"));

onMounted(() => {
  originalAantal.value = aantalKaarten.value;
  originalBedrag.value = teBetalen.value;
  originalTekoop.value = aantalTekoop.value;
});
</script>
<style lang="scss">
.overzicht {
  font-size: large;
}
</style>
