<template>
  <v-card class="mt-3" v-if="reservering">
    <v-card-title>QR code</v-card-title>
    <v-card-text>
      <img :src="url" />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    reservering: {
      type: Object,
      require: true,
    },
  },
  computed: {
    url() {
      return `/api/reservering/${this.reservering.id}/qr`;
    },
  },
};
</script>
