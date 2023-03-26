<template>
  <Reserveren
    v-if="reservering && voorstelling"
    :reservering="reservering"
    :voorstelling="voorstelling"
  />
</template>
<script setup lang="ts">
import { IReservering, IVoorstelling, Reservering, Voorstelling } from "~~/models";

const { get } = useAPI();
const reservering = ref<Reservering>();
const voorstelling = ref<Voorstelling>();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const reserveringData = await get<IReservering>(`/reservering/${route.params.id}`, {
      params: {
        include: ["tickets", "payments", "uitvoering"],
      },
    });
    reservering.value = new Reservering(reserveringData);
    if (!reservering.value) throw new Error("not found");
    if (typeof reservering.value.uitvoering?.voorstelling === "number") {
      const voorstellingData = await get<IVoorstelling>(
        `/voorstelling/${reserveringData.uitvoering.voorstelling}`,
      );
      voorstelling.value = new Voorstelling(voorstellingData);
    } else {
      voorstelling.value = reservering.value.uitvoering?.voorstelling;
    }
  } catch (e) {
    router.replace({ name: "not-found", params: { id: route.params.id } });
  }
});
</script>
