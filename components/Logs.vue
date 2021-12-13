<template>
  <v-card>
    <v-card-title>Voortgang</v-card-title>
    <v-card-text>
      <!-- <button class="btn btn-primary" @click="showLog=!showLog">{{showLog?'Verberg':'Toon'}} Log</button> -->
      <v-simple-table>
        <thead>
          <tr>
            <th>tijdstip</th>
            <th>melding</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in sortedLogs" :key="log.id">
            <td>{{ log.created_at | formatDate("EEEE dd MMM HH:mm") }}</td>
            <td>{{ log.message }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
import _ from "lodash";

export default {
  props: ["logs"],
  computed: {
    sortedLogs: function () {
      return this.logs.sort((a, b) => b.id - a.id);
    },
  },
};
</script>
