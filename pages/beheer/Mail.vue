<template>
  <div>
    <div class="card">
      <form class="form" @submit.prevent="submit">
        <div class="form-group" v-if="uitvoeringen.models.length">
          <label>Uitvoeringen</label>
          <div v-for="uitvoering in uitvoeringen" :key="uitvoering.id">
            <label>
              <input
                type="checkbox"
                v-model="uitvoeringIds"
                :value="uitvoering.id"
              />
              {{ uitvoering.toString() }} ({{ uitvoering.gereserveerd }}
              kaarten)
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>Onderwerp</label>
          <input
            required
            v-model="subject"
            @change="saveSubject"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Inhoud</label>
          <textarea
            required
            @change="saveContent"
            v-model="content"
            class="form-control"
          ></textarea>
        </div>
        <div class="form-group">
          <label>Test verzending</label>
          <input type="checkbox" v-model="test" />
        </div>
        <div class="form-group">
          <input type="submit" value="Versturen" />
        </div>
      </form>
    </div>
    <div class="card" v-if="result" v-html="result"></div>

    <div class="alert alert-fatal" v-if="error">{{ error }}</div>
  </div>
</template>
<script>
import { Uitvoering } from '~/models/Uitvoering'

const defaultMessage = `Hallo <%=naam%>,

Je kunt hier je bestelling <a href="<%=reservering.getEditLink()%>">wijzigen</a>
`

export default {
  data() {
    return {
      uitvoeringen: [],
      uitvoeringIds: [],
      subject: localStorage.customMailSubject || '',
      content: localStorage.customMailContent || defaultMessage,
      test: true,
      error: '',
      result: ''
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      Uitvoering.get('/uitvoering')
    },
    async submit() {
      try {
        const result = await this.$http.post('/api/mail', {
          uitvoeringIds: this.uitvoeringIds,
          subject: this.subject,
          content: this.content,
          test: this.test
        })
        this.result = result.data
        this.$notify('mail verstuurd')
      } catch (error) {
        this.error = error
      }
    },
    saveSubject() {
      localStorage.setItem('customMailSubject', this.subject)
    },
    saveContent() {
      localStorage.setItem('customMailContent', this.content)
    }
  }
}
</script>
<style scoped>
textarea {
  min-height: 20rem;
}
</style>
