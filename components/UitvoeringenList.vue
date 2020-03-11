<template>
  <table class="table table-hover">
    <tbody>
      <router-link tag="tr" :to="{name: 'reservering-list'}">
        <td>Alle voorstellingen</td>
        <td>{{totaalGereserveerd}} gereserveerd</td>
        <td>
          <uitvoering-status :uitvoering="totaalUitvoering"></uitvoering-status>
        </td>
      </router-link>
      <router-link
        v-for="uitvoering in uitvoeringen.models"
        :key="uitvoering.id"
        tag="tr"
        :class="classes(uitvoering.id)"
        :to="{name: 'reservering-list-uitvoering', params:{uitvoeringId: uitvoering.id}}"
      >
        <td>{{uitvoering.aanvang|formatDate("EEEE d MMMM HH:mm")}}</td>
        <td>{{uitvoering.gereserveerd}} gereserveerd</td>
        <td>
          <uitvoering-status :uitvoering="uitvoering"></uitvoering-status>
        </td>
      </router-link>
    </tbody>
  </table>
</template>

<script>
import { UitvoeringList } from '../../../../models/Uitvoering';
import UitvoeringStatus from '../../../../views/UitvoeringStatus.vue';

export default {
  name: 'UitvoeringenList',
  props: ['uitvoeringen', 'uitvoeringId'],
  components: {
    UitvoeringStatus
  },
  computed: {
    totaalUitvoering() {
      return {
        wachtlijst: this.totaalWachtlijst,
        vrije_plaatsen: this.totaalVrijePlaatsen,
        verkoopbaar: true
      };
    },
    totaalGereserveerd: function() {
      return this.uitvoeringen.reduce((total, u) => total + u.gereserveerd, 0);
    },

    totaalVrijePlaatsen: function() {
      return this.uitvoeringen.reduce(
        (total, u) => total + u.vrije_plaatsen,
        0
      );
    },

    totaalWachtlijst: function() {
      return this.uitvoeringen.reduce((total, u) => total + u.wachtlijst, 0);
    }
  },

  methods: {
    classes: function(uitvoeringId) {
      if (uitvoeringId && this.uitvoeringId == uitvoeringId) {
        return ['table-active'];
      } else {
        return ['noprint'];
      }
    }
  }
};
</script>
<style scoped>
tr {
  cursor: pointer;
}
</style>
