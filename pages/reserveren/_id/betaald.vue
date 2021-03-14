<template>
  <Details>
    <template v-slot:default="slotProps">
      <v-card>
        <v-card-title>Ticket is betaald</v-card-title>
        <v-card-text>
          Het ticket is betaald.<br />
          Er is een e-mail met het ticket verstuurd naar
          <strong>{{ slotProps.reservering.email }}</strong>
        </v-card-text>
        <v-card-text>
          <h3 class="mb-3">Niet ontvangen?</h3>
          <v-btn @click="resend(slotProps.reservering.id)">Opnieuw versturen</v-btn>
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
