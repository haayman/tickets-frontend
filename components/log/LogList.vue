<template>
  <div class="container">
    <v-row
      v-for="log in logs"
      @click="goto(log)"
      :key="log.id"
      :style="log.reservering ? 'cursor: pointer' : ''"
    >
      <v-col md="2">{{ log.created_at | formatDate("dd-MM-yyyy H:mm") }}</v-col>
      <v-col md="4" v-if="log.reservering">
        {{ log.reservering.naam }} {{ log.reservering.email }}
      </v-col>
      <v-col md="4" v-else>(geannuleerd)</v-col>
      <v-col md="4">{{ log.message }}</v-col>
      <v-col md="1">
        <a
          v-if="log.reservering"
          :href="href(log)"
          @click.stop=""
          target="_blank"
          title="Open in nieuw window"
        >
          <v-icon>fa-external-link-alt</v-icon>
        </a>
      </v-col>
    </v-row>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="spinner">Laden...</div>
      <div slot="no-more"></div>
      <div slot="no-results">Geen logs gevonden</div>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "Logs",
  components: { InfiniteLoading },
  data() {
    return {
      page: +this.$route.params.page,
      logs: [],
    };
  },
  methods: {
    goto(row) {
      let link;
      if ((link = this.link(row))) {
        this.$router.push(link);
      }
    },
    link(row) {
      if (row.reservering) {
        return {
          name: "reserveren-id-details",
          params: { id: row.reservering.id },
        };
      } else {
        return "";
      }
    },
    href(row) {
      const routeData = this.$router.resolve(this.link(row));
      return routeData.href;
    },
    async infiniteHandler($state) {
      const { data } = await this.$axios.get(`/log/`, {
        params: {
          limit: 20,
          page: this.page - 1,
          include: ["reservering"],
        },
      });
      this.logs.push(...data);
      this.page += 1;
      if (data.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
};
</script>

<style scoped>
.row {
  padding: 2px;
}

.row:nth-of-type(odd) {
  background: #ddd;
}

.row:hover {
  background: #aaa;
}
</style>
