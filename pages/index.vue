<script>
export default {
  auth: false,
  beforeCreate() {
    this.$router.push({ name: "reserveren" });
    // this.$router.push({ name: "beheer-reserveringen-list" });
  },
  render() {
    return null;
  },
};
</script>
