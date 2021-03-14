<template>
  <Details>
    <template v-slot:default="slotProps">
      <v-card>
        <v-card-title>Ticket is betaald</v-card-title>
        <v-card-text>
          Het ticket is betaald.<br />
          Er is een e-mail met het ticket verstuurd naar {{ slotProps.reservering.email }}

          Niet ontvangen?
          <a href="#" @click.prevent="resend(slotProps.reservering.id)">Klik hier</a> om opnieuw op
          te laten sturen
        </v-card-text>
      </v-card>
    </template>
  </Details>
</template>

<script>
export default {
  methods: {
    resend(id) {
      fetch(`/api/reservering/${id}/resend`).then(() => {
        this.$route.push({ name: "reserveren-id-done" }, { id });
      });
    },
  },
};
</script>
