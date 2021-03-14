<template>
  <div>
    <v-card v-if="uitvoeringen">
      <uitvoeringen :uitvoeringen="uitvoeringen" :uitvoeringId="uitvoeringId"></uitvoeringen>
    </v-card>
    <reserveringen-list
      class="mt-3"
      :loading="loading"
      :reserveringen="gereserveerd"
      :uitvoeringId="uitvoeringId"
      >Gereserveerd</reserveringen-list
    >
    <reserveringen-list
      class="mt-3"
      :loading="loading"
      :reserveringen="wachtlijst"
      :uitvoeringId="uitvoeringId"
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
      uitvoeringId: "",
      loading: false,
      uitvoeringen: null,
      reserveringen: [],
    };
  },
  watch: {
    $route: {
      handler() {
        this.uitvoeringId = this.$route.query?.uitvoeringId || "";
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
          order: "-createdAt",
        },
      };
      if (this.uitvoeringId) {
        params.params.uitvoeringId = this.uitvoeringId;
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
