<template>
  <div>
    <v-card v-if="uitvoeringen">
      <uitvoeringen :uitvoeringen="uitvoeringen" :uitvoering_id="uitvoering_id"></uitvoeringen>
    </v-card>
    <reserveringen-list
      class="mt-3"
      :loading="loading"
      :reserveringen="gereserveerd"
      :uitvoering_id="uitvoering_id"
      >Gereserveerd</reserveringen-list
    >
    <reserveringen-list
      v-if="wachtlijst.length"
      class="mt-3"
      :loading="loading"
      :reserveringen="wachtlijst"
      :uitvoering_id="uitvoering_id"
      >Wachtlijst</reserveringen-list
    >
  </div>
</template>
<script>
import { Uitvoering } from "@/models/Uitvoering";
import { Reservering } from "@/models/Reservering";
import Uitvoeringen from "@/components/beheer/uitvoering/UitvoeringenList";
import ReserveringenList from "@/components/beheer/reserveringen/ReserveringenList";

export default {
  middleware: "auth",
  components: {
    Uitvoeringen,
    ReserveringenList,
  },
  data() {
    return {
      uitvoering_id: "",
      loading: false,
      uitvoeringen: null,
      reserveringen: [],
    };
  },
  watch: {
    $route: {
      handler() {
        this.uitvoering_id = this.$route.query?.uitvoering_id || "";
        this.fetch();
      },
      immediate: true,
    },
  },
  computed: {
    gereserveerd: function () {
      return this.reserveringen.filter((r) => !r.wachtlijst);
    },

    wachtlijst: function () {
      return this.reserveringen.filter((r) => r.wachtlijst);
    },
  },
  methods: {
    async fetch() {
      this.loading = true;
      let params = {
        params: {
          include: ["tickets"],
          order: "-created_at",
        },
      };
      if (this.uitvoering_id) {
        params.params.uitvoering_id = this.uitvoering_id;
        params.params.order = "naam";
      }
      const { data: reserveringen } = await this.$axios.get("/reservering", params);
      this.reserveringen = reserveringen.map((r) => new Reservering(r));

      const { data: uitvoeringen } = await this.$axios.get("/uitvoering");
      this.uitvoeringen = uitvoeringen.map((u) => new Uitvoering(u));

      this.loading = false;
    },
  },
};
</script>
