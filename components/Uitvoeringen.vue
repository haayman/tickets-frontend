<template>
  <v-table>
    <template #default>
      <v-radio-group v-model="uitvoeringId" :rules="rules">
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
import { IVoorstelling, Uitvoering, Voorstelling } from "~~/models";

const props = defineProps<{
  voorstelling: Voorstelling;
  uitvoeringId: number | null;
}>();

const emit = defineEmits<{
  (event: "update:uitvoering_id", value: number): void;
}>();

const uitvoeringId = useVModel(props, "uitvoeringId", emit);

const uitvoeringen = ref<Uitvoering[]>([]);
const { get } = useAPI();

const rules = [required];

async function updateUitvoeringen() {
  const voorstelling = await get<IVoorstelling>(`/voorstelling/${props.voorstelling.id}`);
  uitvoeringen.value = voorstelling?.uitvoeringen?.map((u) => new Uitvoering(u)) || [];
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
