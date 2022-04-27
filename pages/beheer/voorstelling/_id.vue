<template>
  <EditVoorstelling v-if="voorstelling" :voorstelling="voorstelling" />
</template>

<script>
import { Voorstelling } from "~/models/Voorstelling";
import EditVoorstelling from "~/components/beheer/voorstelling/EditVoorstelling.vue";

export default {
  data() {
    return {
      voorstelling: null,
    };
  },
  components: {
    EditVoorstelling,
    EditVoorstelling,
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  mounted() {
    this.get();
  },

  methods: {
    get: async function () {
      if (this.id) {
        await this.getVoorstelling();
      }
    },

    async getVoorstelling() {
      const { data: voorstelling } = await this.$axios.get(`/voorstelling/${this.id}`, {
        params: {
          include: ["prijzen", "uitvoeringen"],
        },
      });
      this.voorstelling = new Voorstelling(voorstelling);
    },
  },
};
</script>
