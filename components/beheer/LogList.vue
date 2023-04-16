<template>
  <div class="container">
    <v-row
      v-for="log in logs"
      :key="log.id"
      :style="log.reservering ? 'cursor: pointer' : ''"
      @click="goto(log)"
    >
      <v-col md="2">{{ formatDate(log.created_at, "dd-MM-yyyy H:mm") }}</v-col>
      <v-col v-if="log.reservering" md="4">
        {{ log.reservering.naam }} {{ log.reservering.email }}
      </v-col>
      <v-col v-else md="4">(geannuleerd)</v-col>
      <v-col md="4">{{ log.message }}</v-col>
      <v-col md="1">
        <a
          v-if="log.reservering"
          :href="href(log)"
          target="_blank"
          title="Open in nieuw window"
          @click.stop=""
        >
          <v-icon>mdi-link</v-icon>
        </a>
      </v-col>
    </v-row>
    <InfiniteLoading @infinite="load" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import InfiniteLoading from "v3-infinite-loading";
import { ILog, Log } from "~~/models";
import "v3-infinite-loading/lib/style.css";

const route = useRoute();
const router = useRouter();
const logs = ref<Log[]>([]);
const { get } = useAPI();

const page = ref<number>(1);

// watch(page, (value) => {
//   router.replace({
//     name: route.name as string,
//     params: { page: value },
//   });
// });

const load = async ($state) => {
  try {
    const data = await get<ILog[]>("/log", {
      params: {
        limit: 20,
        page: page.value - 1,
        include: ["reservering"],
      },
    });
    logs.value.push(...data.map((l) => new Log(l)));
    if (data.length < 20) {
      $state.complete();
    } else {
      page.value = page.value + 1;
      $state.loaded();
    }
  } catch (error) {
    console.error(error);
    $state.error();
  }
};

function getLink(row: Log) {
  if (row.reservering) {
    return {
      name: "reserveren-id-details",
      params: { id: row.reservering.id },
    };
  } else {
    return "";
  }
}

function href(row: Log) {
  const routeData = router.resolve(getLink(row));
  return routeData.href;
}

function goto(row: Log) {
  const link = getLink(row);
  if (link) router.push(link);
}
</script>

<style scoped>
.v-row:nth-of-type(even) .v-col {
  background-color: #424242;
}
.v-row:nth-of-type(odd) .v-col {
  background: #383838;
}

.v-row:hover .v-col {
  background: rgb(105, 105, 105);
}

.v-row a {
  text-decoration: none;
}
</style>
