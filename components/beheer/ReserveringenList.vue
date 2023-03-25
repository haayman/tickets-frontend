<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card v-if="reserveringen.length" class="mx-auto">
    <v-card-title>
      <!-- 'Gereserveerd' of 'Wachtlijst' -->

      <slot>Titel</slot>
    </v-card-title>

    <!-- zoek-formulier -->

    <div class="m-3 form-inline noprint">
      <v-text-field v-model="filter" placeholder="zoek" @focus="$event.target.select()" />

      <div v-if="aantalIngenomen" class="ml-3">
        {{ aantalIngenomen }} van de {{ totaalAantal }} ingenomen
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="reserveringen"
      item-key="id"
      :search="filter"
      :disable-pagination="true"
      :hide-default-footer="true"
      :items-per-page="0"
      locale="nl - NL"
      @click:row="gotoReservation"
    >
      <template #item.actions="{ item }">
        <span>
          <v-icon v-if="item.ingenomen" small>mdi-check-circle </v-icon>

          <v-icon
            v-if="isAdministrator"
            title="ticket opnieuw versturen"
            @click.stop="resend(item)"
          >
            mdi-ticket-outline
          </v-icon>

          <v-icon
            v-if="isAdministrator && item.openstaandBedrag > 0"
            title="betalingsverzoek versturen"
            @click.stop="reminder(item)"
          >
            mdi-credit-card
          </v-icon>
        </span>
      </template>

      <template #item.tickets="{ item }">
        <td class="d-flex flex-column">
          <span v-for="ticket in item.raw.tickets" :key="ticket.id" class="mr-3">
            {{ ticket.aantal ? ticket.toString() : "" }}
          </span>
        </td>
      </template>

      <template #item.uitvoering="{ item }">
        {{ item.raw.uitvoering ? formatUitvoering(item.raw.uitvoering) : "" }}
      </template>

      <template #item.created_at="{ item }">
        {{ formatDate(item.raw.created_at) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { Reservering, Uitvoering } from "~~/models";

const { get, del } = useAPI();
const { isAdministrator } = useAuth();

const props = defineProps<{
  reserveringen: Reservering[];
  uitvoering_id: number | null;
}>();

const sortColumn = ref<string>("created_at");
const ascending = ref(false);
const filter = ref("");

const hasOpmerkingen = computed(() => props.reserveringen.find((r) => r.opmerking_gebruiker));
const hasAantekeningen = computed(() => props.reserveringen.find((r) => r.opmerking));
const totaalAantal = computed(() =>
  props.reserveringen.reduce((totaal, reservering) => totaal + reservering.aantal, 0),
);

const aantalIngenomen = computed(() => {
  return props.reserveringen
    .filter((r) => r.ingenomen)
    .reduce((totaal, reservering) => totaal + reservering.aantal, 0);
});

const headers = computed(() => {
  const headers = [
    {
      key: "actions",
      sortable: false,
    },
    {
      title: "Naam",
      key: "naam",
    },
    {
      title: "E-mail",
      key: "email",
    },
    ...(!props.uitvoering_id
      ? [
          {
            title: "Voorstelling",
            key: "uitvoering",
            sortable: false,
          },
        ]
      : []),
    {
      title: "Tijdstip",
      key: "created_at",
      sortable: false,
    },
    {
      title: "Kaarten",
      key: "tickets",
      classes: "d-flex flex-column",
      sortable: false,
    },
    { title: "Status", key: "status", sortable: false },

    ...(hasOpmerkingen.value
      ? [
          {
            title: "Opmerking",
            key: "opmerking_gebruiker",
            sortable: false,
          },
        ]
      : []),
    ...(hasAantekeningen.value
      ? [
          {
            title: "Aantekeningen",
            key: "opmerking",
            sortable: false,
          },
        ]
      : []),
  ];
  return headers;
});

function formatUitvoering(uitvoering: Uitvoering) {
  return formatDate(uitvoering.aanvang, "eeee");
}

function remove(reservering: Reservering) {
  if (confirm("Weet je zeker dat je deze reservering wilt verwijderen")) {
    del(`/api/reservering/${reservering.id}`);
  }
}

async function reminder(reservering: Reservering) {
  await get(`/api/reservering/${reservering.id}/resend`);
  useNotifyBus.emit({ message: `Betalingsherinnering ${reservering.email} verzonden` });
}

async function resend(reservering: Reservering) {
  await get(`/api/reservering/${reservering.id}/resend`);
  useNotifyBus.emit({ message: `Ticket ${reservering.email} verzonden` });
}

function gotoReservation(pointerEvent, { item }) {
  const reservering = item.raw;
  const router = useRouter();
  router.push({ name: "reserveren-id-details", params: { id: reservering.id } });
}
</script>

<style scoped>
.sortable {
  cursor: pointer;
}
th {
  white-space: nowrap;
}
</style>
