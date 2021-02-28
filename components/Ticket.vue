<template>
  <tr v-if="shouldBeDisplayed">
    <td>{{ ticket.prijs.description }}</td>
    <td class="money">{{ ticket.prijs.prijs | formatMoney() }}</td>
    <td>
      <v-text-field
        v-if="isAuthorized"
        type="number"
        v-model.number="aantal"
        min="0"
        @focus="selectAll($event)"
        required
      />
      <v-select v-else v-model.number="aantal" required :items="availableOptions" />
    </td>
    <td v-if="aantalTeKoop">
      {{ ticket.aantalTeKoop }}
    </td>
    <td v-if="reservering.id" class="text-center">{{ ticket.betaald | formatMoney }}</td>
    <td class="money text-center">
      {{ ticket.tebetalen | formatMoney }}
    </td>
  </tr>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Reserveren",

  props: ["ticket", "reservering", "aantalTeKoop"],
  data() {
    return {
      originalAantal: this.ticket.aantal - this.ticket.aantalTekoop,
      originalTekoop: this.ticket.aantalTekoop,
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    isAuthorized() {
      return (
        !this.ticket.prijs.role ||
        (this.loggedInUser && this.loggedInUser.isAuthorised(this.ticket.prijs.role))
      );
    },
    shouldBeDisplayed() {
      return this.isAuthorized || this.originalAantal;
    },
    aantal: {
      get: function () {
        return Math.max(this.ticket.aantal - this.ticket.aantalTekoop);
      },
      set: function (value) {
        if (this.originalTekoop) {
          this.ticket.aantalTekoop = Math.max(this.originalTekoop + this.originalAantal - value, 0);
        }
        this.ticket.aantal = value + this.ticket.aantalTekoop;
        this.$emit("change", this.aantal);
      },
    },
    availableOptions() {
      // genereer een array van [0..originalAantal]
      return [...Array(this.originalAantal).keys()];
    },
  },
  methods: {
    selectAll(event) {
      event.target.select();
    },
  },
};
</script>
