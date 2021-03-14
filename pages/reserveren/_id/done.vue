<template></template>

<script>
export default {
  watch: {
    $route: {
      handler: "get",
      immediate: true,
    },
  },

  methods: {
    async get() {
      try {
        const { data: reservering } = await this.$axios.get(
          `/reservering/${this.$route.params.id}`,
        );
        if (reservering.status === "paid") {
          this.$router.push({ name: "reserveren-id-geslaagd" });
        } else {
          this.$router.push({ name: "reserveren-id-mislukt" });
        }
      } catch (e) {
        console.error(e);
        this.$router.replace({ name: "not-found" }, this.$route.params);
      }
    },
  },
};
</script>
