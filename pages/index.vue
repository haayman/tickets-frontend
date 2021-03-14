<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },

  beforeCreate() {
    if (!this.isAuthenticated) {
      this.$router.push({ name: "reserveren" });
    } else {
      this.$router.push({ name: "beheer-reserveringen" });
    }
  },
  render() {
    return null;
  },
};
</script>
