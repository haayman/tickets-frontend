<template>
  <div class="ticket-summary">
    <v-table density="comfortable">
      <tr class="totaal">
        <td class="text-right"></td>
        <td class="money text-right">{{ formatMoney(ticket.totaal) }}</td>
      </tr>
      <tr v-if="ticket.betaald" class="betaald">
        <td class="text-right">betaald</td>
        <td class="money text-right">{{ formatMoney(ticket.betaald) }}</td>
      </tr>
      <tr v-if="ticket.betaald" class="tebetalen">
        <td class="text-right">{{ saldoTekst }}</td>
        <td class="money text-right text-high-emphasis">
          {{ formatMoney(ticket.tebetalen) }}
        </td>
      </tr>
    </v-table>
  </div>
</template>
<script setup lang="ts">
import { Ticket } from "~~/models";

const props = defineProps<{
  ticket: Ticket;
}>();

const saldoTekst = computed(() => (props.ticket.tebetalen >= 0 ? "" : "terug"));
</script>
<style lang="scss">
.money {
  font-weight: bold;
}
.ticket-summary {
  margin: 4px !important;
  .tebetalen td.money {
    border-top: 1px solid grey;
  }

  td.money {
    width: 30%;
  }
}
</style>
