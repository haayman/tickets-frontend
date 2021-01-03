<template>
  <tr>
    <td>
      <v-text-field v-model.number="uitvoering.aantal_plaatsen" type="number" />
    </td>
    <td>
      <input-date
        type="datetime-local"
        v-model="uitvoering.aanvang"
        class="form-control"
        required
      />
    </td>
    <td>
      <input-date
        type="datetime-local"
        v-model="uitvoering.deur_open"
        class="form-control"
        required
      />
    </td>
    <td><input class="form-control" v-model="uitvoering.extra_text" /></td>

    <td>
      <v-btn v-if="deletable" color="warning" @click.prevent="remove">
        Verwijderen
      </v-btn>
      <v-btn v-else color="primary" @click.prevent="save"> Toevoegen </v-btn>
    </td>
  </tr>
</template>

<script>
import { Uitvoering } from "@/models/Uitvoering";
import inputDate from "@/components/inputDate.vue";
import { subMinutes } from "date-fns";

export default {
  name: "Uitvoering",
  props: {
    uitvoering: {
      type: Uitvoering,
      required: true,
    },
    deletable: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    inputDate,
  },
  computed: {
    changed: function () {
      return this.uitvoering.changed();
    },
  },
  watch: {
    "uitvoering.aanvang": function (aanvang) {
      this.uitvoering.deur_open = subMinutes(this.uitvoering.aanvang, 30);
    },
  },
  methods: {
    save() {
      this.$emit("save", this.uitvoering);
    },
    remove() {
      this.$emit("delete", this.uitvoering);
    },
  },
};
</script>

<style scoped></style>
