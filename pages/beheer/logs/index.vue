<script>
export default {
  auth: true,
  beforeCreate() {
    this.$router.push({ path: "1" });
  },
  render() {
    return null;
  },
};
</script>
