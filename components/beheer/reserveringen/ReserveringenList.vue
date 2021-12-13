<template>
  <v-card v-if="reserveringen.length" class="mx-auto">
    <v-card-title>
      <!-- 'Gereserveerd' of 'Wachtlijst' -->
      <slot>Titel</slot>
    </v-card-title>

    <!-- zoek-formulier -->
    <div class="m-3 form-inline noprint">
      <v-text-field v-model="filter" placeholder="zoek" @focus="$event.target.select()" />
      <div v-if="aantalIngenomen" class="ml-3">
        {{ aantalIngenomen }} van de {{ totaalAantal }} ingenomen
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="reserveringen"
      item-key="id"
      :search="filter"
      :disable-pagination="true"
      :hide-default-footer="true"
      :items-per-page="0"
      locale="nl - NL"
      @click:row="gotoReservation"
    >
      <template v-slot:top>
        <v-text-field v-model="filter" label="zoek" class="mx-4"></v-text-field>
      </template>

      <!-- <template v-slot:[`item.actions`]="{ item }">
          <span>
            <v-icon small v-if="reservering.ingenomen"> far fa-check-square ></v-icon>
            <v-icon v-if="isAdmin" @click.prevent="resend(item)" title="ticket opnieuw versturen"
              >far fa-ticket-alt</v-icon
            >
            <v-icon
              v-if="isAdmin && item.openstaandBedrag > 0"
              @click.prevent="reminder(item)"
              title="betalingsverzoek versturen"
              >far fa-credit-card</v-icon
            >
          </span>
        </template> -->

      <template v-slot:[`item.tickets`]="{ item }">
        <td class="d-flex flex-column">
          <span class="mr-3" v-for="ticket in item.tickets" :key="ticket.id">{{
            ticket.aantal ? ticket.toString() : ""
          }}</span>
        </td>
      </template>

      <template #[`item.uitvoering`]="{ item }">
        {{ item.uitvoering ? item.uitvoering.toString() : "" }}
      </template>

      <template #[`item.created_at`]="{ item }">
        {{ item.created_at | formatDate }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Reserveringen",
  props: ["reserveringen", "uitvoering_id"],
  data() {
    return {
      sortColumn: "created_at",
      ascending: false,
      filter: "",
      isAdmin: true, // @TODO
    };
  },
  computed: {
    // ...mapGetters(["isAdmin"]),
    hasOpmerkingen: function () {
      return this.reserveringen.find((r) => r.opmerking_gebruiker);
    },
    hasAantekeningen: function () {
      return this.reserveringen.find((r) => r.opmerking);
    },

    totaalAantal() {
      return this.reserveringen.reduce((totaal, reservering) => totaal + reservering.aantal, 0);
    },

    aantalIngenomen() {
      return this.reserveringen
        .filter((r) => r.ingenomen)
        .reduce((totaal, reservering) => totaal + reservering.aantal, 0);
    },

    headers() {
      const headers = [
        {
          value: "actions",
          sortable: false,
        },
        {
          text: "Naam",
          value: "naam",
        },
        {
          text: "E-mail",
          value: "email",
        },
        ...(!this.uitvoering_id
          ? [
              {
                text: "Voorstelling",
                value: "uitvoering",
                sortable: false,
              },
            ]
          : []),
        {
          text: "Tijdstip",
          value: "created_at",
        },
        {
          text: "Kaarten",
          value: "tickets",
          classes: "d-flex flex-column",
        },
        { text: "Status", value: "status" },

        ...(this.hasOpmerkingen
          ? [
              {
                text: "Opmerking",
                value: "opmerking_gebruiker",
              },
            ]
          : []),
        ...(this.hasAantekeningen
          ? [
              {
                text: "Aantekeningen",
                value: "opmerking",
              },
            ]
          : []),
      ];
      return headers;
    },
  },
  methods: {
    remove(reservering) {
      if (confirm("Weet je zeker dat je deze reservering wilt verwijderen")) {
        reservering.delete();
      }
    },

    reminder(reservering) {
      fetch(`/api/reservering/${reservering.id}/resend`).then(() => {
        this.$notify({
          text: `Betalingsherinnering ${reservering.email} verzonden`,
        });
      });
    },

    resend(reservering) {
      fetch(`/api/reservering/${reservering.id}/resend`).then(() => {
        this.$notify({ text: `Ticket ${reservering.email} verzonden` });
      });
    },

    gotoReservation(reservering) {
      this.$router.push({ name: "reserveren-id", params: { id: reservering.id } });
    },

    ignore() {
      // nothing
    },
  },
};
</script>
<style scoped>
.sortable {
  cursor: pointer;
}
th {
  white-space: nowrap;
}
</style>
