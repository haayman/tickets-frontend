<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th>Voorstelling</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="uitvoering in uitvoeringen"
          :key="uitvoering.id"
          @click="radioButtonValue = uitvoering.id"
        >
          <td>
            <v-radio
              :value="uitvoering.id"
              :disabled="!uitvoering.verkoopbaar"
              :label="`${formatDate(uitvoering.aanvang)} ${uitvoering.extra_text}`"
            />
          </td>
          <td>
            <uitvoering-status :uitvoering="uitvoering"></uitvoering-status>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import UitvoeringStatus from "./UitvoeringStatus";
import { Uitvoering } from "@/models/Uitvoering";
import { formatDate } from "@/plugins/filters";

export default {
  name: "UitvoeringRadio",
  components: { UitvoeringStatus },
  props: ["value"],
  data() {
    return {
      updater: null,
      uitvoeringen: [],
    };
  },
  computed: {
    radioButtonValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  component: {
    UitvoeringStatus,
  },
  mounted() {
    this.checkReserveringen();
    // this.updater = setInterval(() => {
    //   this.checkReserveringen();
    // }, 10000); // elke 10 seconden bijwerken
  },
  beforeDestroy() {
    if (this.updater) clearInterval(this.updater);
  },
  methods: {
    async checkReserveringen() {
      const { data: uitvoeringen } = await this.$axios.get("/uitvoering");
      this.uitvoeringen = uitvoeringen.map((u) => new Uitvoering(u));
    },
    formatDate(date) {
      return formatDate(date, "EEEE d MMMM HH:mm");
    },
  },
};
</script>
