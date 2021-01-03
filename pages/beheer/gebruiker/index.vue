<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title>Gebruikers</v-card-title>
      <v-data-table
        v-if="users.length"
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
import { mapGetters } from "vuex";
import { User } from "@/models/User";

export default {
  name: "Users",

  data() {
    return {
      loading: false,
      options: {},
      headers: [
        { text: "account", value: "username", sortable: false },
        { text: "naam", value: "name", sortable: false },
        { text: "rol", value: "role", sortable: false },
        { text: "actions", value: "name", sortable: false },
      ],
      users: [],
    };
  },

  computed: {
    ...mapGetters(["isAdmin"]),
  },

  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const { data: users } = await this.$axios.get("/user");
      this.users = users;
      this.loading = false;
    },
    async remove(user) {
      if (confirm(`Weet je zeker dat je ${user.name} wilt verwijderen?`)) {
        await this.$axios.delete(`/user/${user.id}`);
        this.users = this.users.filter((u) => u.id !== user.id);
      }
    },
  },
};
</script>
