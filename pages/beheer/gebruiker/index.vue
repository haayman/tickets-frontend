<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>Gebruikers</v-card-title>

      <v-data-table class="user-management" :loading="pending" :headers="headers" :items="users">
        <template #item.actions="{ item }">
          <nuxt-link :to="{ name: 'beheer-gebruiker-id', params: { id: item.raw.id } }">
            <v-icon size="small" class="me-2">mdi-pencil</v-icon>
          </nuxt-link>

          <a href="#delete" @click.prevent="remove(item.raw)">
            <v-icon size="small" class="me-2">mdi-delete</v-icon>
          </a>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-btn :to="{ name: 'beheer-gebruiker-create' }" color="primary">Gebruiker toevoegen</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { User } from "@/models/User";

const headers = [
  { title: "Account", key: "username", sortable: false },
  { title: "Naam", key: "name", sortable: false },
  { title: "Rol", key: "role", sortable: false },
  { title: "", key: "actions", sortable: false },
];

const users = ref<User[]>([]);
const pending = ref(true);

onMounted(async () => {
  const { data } = await useFetch<User[]>("/api/user");
  users.value = data.value || [];
  pending.value = false;
});

async function remove(user: User) {
  if (confirm(`Weet je zeker dat je ${user.name} wilt verwijderen?`)) {
    await useFetch(`/user/${user.id}`, { method: "DELETE" });
    users.value = users.value?.filter((u) => u.id !== user.id) || [];
  }
}
</script>
