<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th>omschrijving</th>
          <th>prijs</th>
          <th>aantal</th>
          <th v-if="aantalTeKoop">aantal te koop</th>
          <th class="text-center" v-if="reservering.id">betaald</th>
          <th class="text-center">{{ reservering.id ? "bijbetalen" : "bedrag" }}</th>
        </tr>
      </thead>
      <tbody>
        <ticket
          v-for="ticket in reservering.tickets"
          :ticket="ticket"
          :reservering="reservering"
          :aantalTeKoop="aantalTeKoop"
          :key="ticket.prijs.id"
        >
        </ticket>
        <tr class="total">
          <td colspan="2">Totaal</td>
          <td>
            {{ aantalKaarten }}
          </td>
          <td v-if="aantalTeKoop">{{ aantalTeKoop }}</td>
          <td v-if="reservering.id"></td>
          <td class="money text-center">
            {{ totaalBedrag | formatMoney }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import Ticket from "./Ticket";

export default {
  props: ["reservering"],
  components: {
    ticket: Ticket,
  },
  computed: {
    aantalKaarten: function () {
      return this.reservering.tickets.reduce((aantal, t) => aantal + +t.aantal, 0);
    },
    aantalTeKoop: function () {
      return this.reservering.tickets.reduce((aantal, t) => aantal + +t.aantalTekoop, 0);
    },

    subTotaal: function () {
      return this.reservering.prijs.prijs * (this.aantalKaarten - this.reservering.aantalBetaald);
    },

    totaalBedrag: function () {
      return this.reservering.tickets.reduce((totaal, t) => totaal + t.tebetalen, 0);
    },
  },
};
</script>
