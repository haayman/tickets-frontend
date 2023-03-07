<template>
  <nuxt-link to="/beheer/gebruiker">Gebruikers</nuxt-link>
</template>
<script setup lang="ts">
const { isAuthenticated } = useAuth();

const router = useRouter();
if (!isAuthenticated) {
  router.push({ name: "reserveren" });
} else {
  router.push({ name: "beheer-gebruiker" });
}
</script>
