<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th>Voorstelling</th>
          <th></th>
          <!-- <th class="text-center">Wachtlijst</th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="uitvoering in uitvoeringen"
          :key="uitvoering.id"
          @click="radioButtonValue = uitvoering.id"
        >
          <td>
            <label class="mb-0">
              <input
                type="radio"
                required
                name="uitvoering"
                v-model="radioButtonValue"
                :value="uitvoering.id"
                :disabled="!uitvoering.verkoopbaar"
                :rules="rules"
              />
              {{ uitvoering.aanvang | formatDate("EEEE d MMMM HH:mm") }}
              {{ uitvoering.extra_text }}
            </label>
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
import { required } from "@/lib/validation";

export default {
  name: "UitvoeringRadio",
  components: { UitvoeringStatus },
  props: ["value"],
  data() {
    return {
      updater: null,
      uitvoeringen: [],
      rules: [required],
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
  },
};
</script>
