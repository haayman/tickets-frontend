<template>
  <div>
    <component
      v-if="headerComponent && reservering"
      :is="headerComponent"
      :reservering="reservering"
    ></component>

    <!-- alleen bezoekers voorstelling tonen -->
    <voorstelling v-if="!loggedInUser"></voorstelling>

    <v-card class="mt-3" v-if="reservering">
      <v-card-title>Kaarten</v-card-title>
      <v-card-text>
        <v-alert class="warning" v-if="reservering.ingenomen">
          Deze kaart{{ reservering.aantal > 1 ? "en zijn" : " is" }} gezien op
          {{ reservering.ingenomen | formatDate("dddd D MMMM YYYY H:mm") }}
        </v-alert>

        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <th>Naam</th>
                <td>{{ reservering.naam }}</td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>{{ reservering.email }}</td>
              </tr>
              <tr>
                <th>Uitvoering</th>
                <td>{{ reservering.uitvoering.toString() }}</td>
              </tr>
              <tr>
                <th>Kaarten</th>
                <td>
                  <div v-for="ticket in reservering.tickets" :key="ticket.id">
                    {{ ticket.aantal ? ticket.toString() : "" }}
                  </div>
                </td>
              </tr>
              <tr v-if="reservering.opmerking_gebruiker">
                <th>Opmerking</th>
                <td>{{ reservering.opmerking_gebruiker }}</td>
              </tr>
              <tr v-if="reservering.wachtlijst">
                <th></th>
                <td>Je staat op de wachtlijst</td>
              </tr>
              <tr v-if="!reservering.wachtlijst && reservering.saldo">
                <th>{{ reservering.saldo > 0 ? "Tegoed" : "Nog bijbetalen" }}</th>
                <td>
                  <span>{{ Math.abs(reservering.saldo) | formatMoney }}</span>
                  <span v-html="bijbetalingStatus"></span>
                </td>
              </tr>
              <tr v-if="reservering.opmerking">
                <th>Aantekening</th>
                <td>{{ reservering.opmerking }}</td>
              </tr>
              <tr>
                <td>
                  <v-btn color="primary" v-if="wordtIngenomen" @click="innemen">
                    Gezien bij kassa
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    v-if="!reservering.ingenomen"
                    color="primary"
                    :to="{ name: 'reservering', params: { id: reservering.id } }"
                    >Wijzigen</v-btn
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <payments
      class="mt-3"
      :payments="reservering.payments"
      v-if="reservering && showPayments && reservering.payments"
    ></payments>
    <logs
      class="mt-3"
      :logs="reservering.logs"
      v-if="reservering && showLogs && reservering.logs"
    ></logs>
  </div>
</template>

<script>
import { Reservering } from "../models/Reservering";
import { mapGetters } from "vuex";
const payments = () => import(/* webpackChunkName: "PaymentsVue" */ "./Payments.vue");
const logs = () => import(/* webpackChunkName: "LogsVue" */ "./Logs.vue");
const Voorstelling = () => import(/* webpackChunkName: "VoorstellingVue" */ "./Voorstelling.vue");

export default {
  props: {
    headerComponent: {
      default: null,
    },
    showPayments: {
      default: false,
    },
    showLogs: {
      default: false,
    },
    title: {
      default: "Reservering",
    },
  },
  data() {
    return {
      reservering: null,
      errors: {},
    };
  },
  watch: {
    $route: {
      handler: "get",
      immediate: true,
    },
  },

  computed: {
    ...mapGetters(["loggedInUser"]),
    bijbetalingStatus: function () {
      const saldo = this.reservering.saldo;
      if (saldo > 0) {
        if (this.reservering.teruggeefbaar) {
          return "Het bedrag zal z.s.m. teruggestort worden";
        } else {
          return "Het bedrag zal teruggestort worden zodra de kaarten opnieuw verkocht zijn";
        }
      } else if (saldo < 0) {
        return `<a href="/reserveren/${this.reservering.id}/betalen">Graag nog overmaken</a>`;
      }
    },
    wordtIngenomen: function () {
      return (
        this.reservering.id &&
        !this.reservering.ingenomen &&
        this.activeUser &&
        this.activeUser.isKassa()
      );
    },
  },

  components: {
    payments: payments,
    Voorstelling,
    logs,
  },

  methods: {
    async get() {
      try {
        const { data } = await this.$axios.get(`/reservering/${this.$route.params.id}`, {
          params: {
            include: ["tickets", "payments", "logs"],
          },
        });
        this.reservering = new Reservering(data);
      } catch (e) {
        console.error(e);
        this.$router.replace({ name: "not-found" }, this.$route.params);
      }
    },
    async innemen() {
      // meld terug dat de kaarten zijn ingenomen
      const response = await this.$http.put(`/api/reservering/${this.reservering.id}/ingenomen`, {
        ingenomen: new Date(),
      });
      this.reservering.ingenomen = response.data.ingenomen;
    },
  },
};
</script>
