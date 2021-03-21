<template>
  <div class="container">
    <v-card>
      <v-card-title>Verstuur e-mail naar klanten</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-checkbox
            v-for="uitvoering in uitvoeringen"
            :key="uitvoering.id"
            v-model="uitvoeringIds"
            :value="uitvoering.id"
            :label="`${uitvoering.toString()} (${uitvoering.gereserveerd} gereserveerd)`"
          />
          <v-text-field label="Onderwerp" required v-model="subject" />
          <v-textarea label="Inhoud" required v-model="content"></v-textarea>

          <v-checkbox label="Test verzending" v-model="test" />
          <v-btn :disabled="!valid" color="primary" type="submit">Versturen</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-if="result" class="mt-3">
      <v-card-title>Resultaat</v-card-title>
      <v-card-text v-html="result" />
    </v-card>

    <v-alert color="error" v-if="error">{{ error }}</v-alert>
  </div>
</template>
<script>
import { Uitvoering } from "~/models/Uitvoering";

const defaultMessage = `Hallo <%=naam%>,

Je kunt hier je bestelling <a href="<%=reservering.getEditLink()%>">wijzigen</a>
`;

export default {
  middleware: "auth",
  data() {
    return {
      uitvoeringIds: [],
      subject: process.browser ? localStorage.customMailSubject || "" : "",
      content: process.browser ? localStorage.customMailContent || defaultMessage : defaultMessage,
      test: true,
      error: "",
      result: "",
    };
  },
  async asyncData({ app }) {
    const { data: uitvoeringen } = await app.$axios.get("/uitvoering");
    return { uitvoeringen: uitvoeringen.map((u) => new Uitvoering(u)) };
  },
  computed: {
    valid() {
      return this.subject && this.content && this.uitvoeringIds.length;
    },
  },
  watch: {
    subject(value) {
      localStorage.setItem("customMailSubject", value);
    },
    content(value) {
      localStorage.setItem("customMailContent", value);
    },
  },
  methods: {
    async submit() {
      try {
        const result = await this.$axios.post("/mail", {
          uitvoeringIds: this.uitvoeringIds,
          subject: this.subject,
          content: this.content,
          test: this.test,
        });
        this.result = result.data;
        // this.$notify("mail verstuurd");
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>
<style scoped>
textarea {
  min-height: 20rem;
}
</style>
