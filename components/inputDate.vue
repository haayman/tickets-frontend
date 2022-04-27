<template>
  <v-text-field
    :type="type"
    class="input-date"
    :value="asString()"
    @change="updateValue($event.target)"
  />
</template>

<script>
import formatter from "date-fns/format";
export default {
  props: {
    value: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  methods: {
    updateValue: function (target) {
      this.$emit("input", new Date(target.value));
    },
    asString() {
      try {
        switch (this.type) {
          // 2018-08-26T04:06:37
          case "datetime-local":
            return formatter(this.value, "yyyy-MM-dd'T'HH:mm");
          case "time":
            return this.value.toLocaleTimeString();
          case "date":
          default:
            // yyyy-MM-dd
            return this.value.toISOString().substring(0, 10);
        }
      } catch (e) {
        return this.value.toString();
      }
    },
  },
};
</script>
