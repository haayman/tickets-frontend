<template>
  <v-table>
    <template #default>
      <v-radio-group v-model="uitvoering_id" :rules="rules">
        <tbody>
          <tr v-for="uitvoering in uitvoeringen" :key="uitvoering.id">
            <td>
              <v-radio
                :value="uitvoering.id"
                :disabled="!uitvoering.verkoopbaar"
                :label="`${formatDate(uitvoering.aanvang)} ${uitvoering.extra_text}`"
              />
            </td>

            <td>
              <uitvoering-status :uitvoering="uitvoering" />
            </td>
          </tr>
        </tbody>
      </v-radio-group>
    </template>
  </v-table>
</template>

<script setup lang="ts">
/* eslint-disable vue/prop-name-casing */
/* eslint-disable camelcase */
import { IUitvoering, Uitvoering } from "@/models/Uitvoering";

const props = defineProps<{
  uitvoering_id: number | null;
}>();

const emit = defineEmits<{
  (event: "update:uitvoering_id", value: number): void;
}>();

const uitvoering_id = useVModel(props, "uitvoering_id", emit);

const uitvoeringen = ref<Uitvoering[]>([]);
const { get } = useAPI();

const rules = [required];

async function updateUitvoeringen() {
  const data = await get<IUitvoering[]>("/uitvoering");
  uitvoeringen.value = data.map((u) => new Uitvoering(u));
}

let updater: any;
onMounted(() => {
  updateUitvoeringen();
  updater = setInterval(() => {
    updateUitvoeringen();
  }, 10000); // elke 10 seconden
});

onUnmounted(() => {
  if (updater) {
    clearInterval(updater);
  }
});
</script>
