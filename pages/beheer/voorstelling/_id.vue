<template>
  <div class="py-3">
    Voorstelling
    <div class="alert alert-danger" v-if="errors['general']">
      {{ errors.general }}
    </div>
  </div>
</template>

<script>
import { User } from '~/models/User'
import { RoleList } from '~/models/Role'
import { mapGetters } from 'vuex'

export default {
  name: 'UsersEdit',
  data() {
    return {
      roles: RoleList,
      errors: {},
      passwordType: 'password'
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    user() {
      return User.find(this.$route.params.id)
    }
  },

  methods: {
    async save() {
      this.user
        .save()
        .then(() => {
          this.$router.push({
            path: '.'
          })
        })
        .catch(error => {
          let errors = error.errors || {}

          if (error.message) {
            errors.general = error.message
          }
          this.errors = errors
        })
    }
  }
}
</script>
