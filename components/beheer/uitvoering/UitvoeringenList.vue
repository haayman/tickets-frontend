<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <router-link tag="tr" :to="{ name: 'beheer-reserveringen' }">
          <td>Alle voorstellingen</td>
          <td>{{ totaalGereserveerd }} gereserveerd</td>
          <td>
            <uitvoering-status :uitvoering="totaalUitvoering"></uitvoering-status>
          </td>
        </router-link>
        <router-link
          v-for="uitvoering in uitvoeringen"
          :key="uitvoering.id"
          tag="tr"
          :class="classes(uitvoering.id)"
          :to="{
            name: 'beheer-reserveringen',
            query: { uitvoering_id: uitvoering.id },
          }"
        >
          <td>{{ uitvoering.aanvang | formatDate("Pp") }}</td>
          <td>{{ uitvoering.gereserveerd }} gereserveerd</td>
          <td>
            <uitvoering-status :uitvoering="uitvoering"></uitvoering-status>
          </td>
        </router-link>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import UitvoeringStatus from "@/components/UitvoeringStatus.vue";

export default {
  name: "UitvoeringenList",
  props: ["uitvoeringen", "uitvoering_id"],
  components: {
    UitvoeringStatus,
  },
  computed: {
    totaalUitvoering() {
      return {
        wachtlijst: this.totaalWachtlijst,
        vrije_plaatsen: this.totaalVrijePlaatsen,
        verkoopbaar: true,
      };
    },
    totaalGereserveerd: function () {
      return this.uitvoeringen.reduce((total, u) => total + u.gereserveerd, 0);
    },

    totaalVrijePlaatsen: function () {
      return this.uitvoeringen.reduce((total, u) => total + u.vrije_plaatsen, 0);
    },

    totaalWachtlijst: function () {
      return this.uitvoeringen.reduce((total, u) => total + u.wachtlijst, 0);
    },
  },

  methods: {
    classes: function (uitvoering_id) {
      if (uitvoering_id && this.uitvoering_id == uitvoering_id) {
        return ["table-active"];
      } else {
        return ["noprint"];
      }
    },
  },
};
</script>
<style scoped>
tr {
  cursor: pointer;
}

.table-active {
  background-color: #333;
}
</style>
