<template>
  <EditVoorstelling :voorstelling="voorstelling" />
</template>

<script>
import { Voorstelling } from "~/models/Voorstelling";
import EditVoorstelling from "~/components/beheer/voorstelling/EditVoorstelling.vue";

export default {
  data() {
    return {
      voorstelling: new Voorstelling(),
    };
  },
  components: {
    EditVoorstelling,
  },
};
</script>
