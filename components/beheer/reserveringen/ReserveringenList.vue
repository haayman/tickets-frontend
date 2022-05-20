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
      <template v-slot:[`item.actions`]="{ item }">
        <span>
          <v-icon small v-if="item.ingenomen">fa-check-square ></v-icon>
          <v-icon v-if="isAdmin" @click.stop="resend(item)" title="ticket opnieuw versturen"
            >fa-ticket-alt</v-icon
          >
          <v-icon
            v-if="isAdmin && item.openstaandBedrag > 0"
            @click.stop="reminder(item)"
            title="betalingsverzoek versturen"
            >fa-credit-card</v-icon
          >
        </span>
      </template>

      <template v-slot:[`item.tickets`]="{ item }">
        <td class="d-flex flex-column">
          <span class="mr-3" v-for="ticket in item.tickets" :key="ticket.id">{{
            ticket.aantal ? ticket.toString() : ""
          }}</span>
        </td>
      </template>

      <template #[`item.uitvoering`]="{ item }">
        {{ item.uitvoering ? formatUitvoering(item.uitvoering) : "" }}
      </template>

      <template #[`item.created_at`]="{ item }">
        {{ item.created_at | formatDate }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import formatter from "date-fns/format";
import nl from "date-fns/locale/nl";

export default {
  name: "Reserveringen",
  props: ["reserveringen", "uitvoering_id"],
  data() {
    return {
      sortColumn: "created_at",
      ascending: false,
      filter: "",
    };
  },
  computed: {
    ...mapGetters(["isAdmin"]),
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
          sortable: false,
        },
        {
          text: "Kaarten",
          value: "tickets",
          classes: "d-flex flex-column",
          sortable: false,
        },
        { text: "Status", value: "status", sortable: false },

        ...(this.hasOpmerkingen
          ? [
              {
                text: "Opmerking",
                value: "opmerking_gebruiker",
                sortable: false,
              },
            ]
          : []),
        ...(this.hasAantekeningen
          ? [
              {
                text: "Aantekeningen",
                value: "opmerking",
                sortable: false,
              },
            ]
          : []),
      ];
      return headers;
    },
  },
  methods: {
    formatUitvoering(uitvoering) {
      return formatter(uitvoering.aanvang, "eeee", { locale: nl });
    },
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
      this.$router.push({ name: "reserveren-id-details", params: { id: reservering.id } });
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
