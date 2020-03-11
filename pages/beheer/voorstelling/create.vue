<template>
  <v-container>
    Create
  </v-container>
</template>

<script>
import { User } from '~/models/User'
import { RoleList } from '~/models/Role'
import { mapGetters } from 'vuex'

export default {
  name: 'UsersEdit',
  data() {
    return {
      user: new Voorstelling(),
      errors: {},
      showPassword: false
    }
  },

  computed: {
    ...mapGetters(['isAdmin'])
  },

  methods: {
    async save() {
      try {
        const result = await User.api().post('/user', this.user)
        this.$router.push({ name: 'beheer-gebruiker' })
      } catch (error) {
        let errors = error.errors || {}

        if (error.message) {
          errors.general = error.message
        }
        this.errors = errors
      }
    }
  }
}
</script>
