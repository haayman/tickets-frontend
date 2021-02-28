<template>
  <v-card class="mt-3" v-if="payments && payments.length">
    <!--{{payments}}-->
    <v-card-title>Betaalgeschiedenis</v-card-title>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>ticket</th>
              <th>betaald</th>
              <th>status</th>
              <th>bedrag</th>
              <th v-if="hasRefunds">Teruggestort</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.description }}</td>
              <td>{{ payment.paidAt | formatDate("Pp") }}</td>
              <td>{{ payment.status }}</td>
              <td>{{ payment.amount | formatMoney }}</td>
              <td v-if="payment.amountRefunded">
                {{ payment.amountRefunded | formatMoney }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Payments",
  props: ["payments"],
  computed: {
    hasRefunds: function () {
      return this.payments.find((p) => p.amountRefunded);
    },
  },
};
</script>
