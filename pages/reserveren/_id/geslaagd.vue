<template>
  <Details>
    <template v-slot:default="slotProps">
      <v-card class="mt-3">
        <v-card-title>Bestelling geslaagd </v-card-title>
        <v-card-text>
          <p class="card-text">
            Bedankt voor je reservering.<br />
            Je krijgt een mail met de bevestiging naar {{ slotProps.reservering.email }}
          </p>

          <p class="card-text" v-if="slotProps.reservering.wachtlijst">
            Helaas sta je op de wachtlijst. Zodra er voldoende plaatsen beschikbaar komen krijg je
            een mail.<br />
            Dan pas hoef je te betalen.<br />
          </p>
        </v-card-text>
      </v-card>
    </template>
  </Details>
</template>
