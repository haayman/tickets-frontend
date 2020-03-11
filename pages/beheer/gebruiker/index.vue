<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title>Gebruikers</v-card-title>
      <v-data-table
        class="user-management"
        :loading="loading"
        :headers="headers"
        :items="users"
        :options.sync="options"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.name }}</td>
            <td>
              <div class="text-muted" v-if="props.item.role">
                {{ props.item.role }}
              </div>
            </td>
            <td>
              <nuxt-link :to="{ path: props.item.id }" append>
                <v-icon>fa-edit</v-icon></nuxt-link
              >
              <a href="#delete" @click.prevent="remove(props.item)">
                <v-icon>fa-trash</v-icon>
              </a>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-btn :to="{ name: 'beheer-gebruiker-create' }" color="primary"
          >Gebruiker toevoegen</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
import { User } from '@/models/User'

export default {
  name: 'Users',

  data() {
    return {
      loading: false,
      options: {},
      headers: [
        { text: 'account', value: 'username', sortable: false },
        { text: 'naam', value: 'name', sortable: false },
        { text: 'rol', value: 'role', sortable: false },
        { text: 'actions', value: 'name', sortable: false }
      ]
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    users() {
      return User.all()
    }
  },

  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const { entities } = await User.api().get('/user')
      // this.users = entities.user
      this.loading = false
    },
    async remove(user) {
      if (confirm(`Weet je zeker dat je ${user.name} wilt verwijderen?`)) {
        await User.api().delete(`/user/${user.id}`)
        user.$delete()
      }
    }
  }
}
</script>
