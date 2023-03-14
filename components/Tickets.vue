<template>
  <v-table>
    <template #default>
      <thead>
        <tr>
          <th>omschrijving</th>

          <th>prijs</th>

          <th>aantal</th>

          <th v-if="aantalTekoop">aantal te koop</th>

          <th v-if="reservering.id" class="text-center">betaald</th>

          <th class="text-center">{{ saldoTekst }}</th>
        </tr>
      </thead>

      <tbody>
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

        <tr class="total">
          <td colspan="2">Totaal</td>

          <td>{{ aantalKaarten }}</td>

          <td v-if="aantalTekoop">{{ aantalTekoop }}</td>

          <td v-if="reservering.id"></td>

          <td class="money text-center">{{ formatMoney(factor * totaalBedrag) }}</td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>

<script setup lang="ts">
import { Reservering } from "~~/models";
import { Rule } from "~~/types/rule";

const props = defineProps<{
  reservering: Reservering;
  rules: Rule[];
}>();

const aantalKaarten = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantal, 0),
);

const aantalTekoop = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantalTekoop, 0),
);

const totaalBedrag = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.tebetalen, 0),
);

const saldoTekst = computed(() => {
  if (!props.reservering.id) return "bedrag";
  return totaalBedrag.value < 0 ? "teruggave" : "bijbetalen";
});

const factor = computed(() => (saldoTekst.value === "teruggave" ? -1 : 1));
</script>
