<template>
  <div>
    <voorstelling-header v-if="!isAuthenticated" />

    <v-card v-if="reservering" class="mt-3">
      <v-card-title>
        Kaarten
        <v-icon class="float-right ml-3" @click="hoewerkthet = true">
          mdi-help-circle-outline
        </v-icon>
      </v-card-title>

      <v-card-text>
        <v-alert v-if="reservering.ingenomen" color="danger">
          Deze kaart{{ reservering.aantal > 1 ? "en zijn" : " is" }} al ingenomen op
          {{ formatDate(reservering.ingenomen, "Pp") }}
        </v-alert>

        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-card>
            <v-card-text>
              <v-card-subtitle>Je gegevens</v-card-subtitle>

              <v-alert v-if="displayErrors['general']" dense type="error">{{
                displayErrors.general
              }}</v-alert>

              <v-text-field
                v-model="reservering.naam"
                label="Naam"
                :rules="rules.naam"
                validate-on-blur
                required
              />

              <v-text-field
                v-model="reservering.email"
                label="E-mail"
                type="email"
                :rules="rules.email"
                validate-on-blur
                required
              />
            </v-card-text>
          </v-card>

          <v-card class="mt-3">
            <v-card-subtitle>Voorstelling</v-card-subtitle>

            <v-card-text>
              <div v-if="displayErrors.uitvoering" class="invalid-feedback">
                {{ displayErrors.uitvoering }}
              </div>

              <uitvoeringen
                v-if="voorstelling"
                v-model:uitvoering_id="uitvoering_id"
                :uitvoeringen="voorstelling.uitvoeringen"
              />
            </v-card-text>
          </v-card>

          <v-card class="mt-3">
            <v-card-text>
              <tickets
                v-if="reservering.tickets"
                :reservering="reservering"
                :rules="rules.aantal"
              ></tickets>
            </v-card-text>
          </v-card>

          <v-card class="mt-3">
            <v-card-text>
              <tickets-summary :reservering="reservering" />
            </v-card-text>
          </v-card>

          <transition name="fade">
            <v-alert v-if="wachtrijNodig" type="warning" dense>
              <h4 class="alert-heading">Let op!</h4>
              Er zijn onvoldoende plaatsen beschikbaar. Je komt op de wachtlijst
              <v-icon small @click="wachtrijHelp = true"> mdi-help-circle-outline</v-icon>

              <br />

              <v-checkbox
                v-model="reservering.wachtlijst"
                :rules="rules.wachtlijst"
                label="Akkoord"
              />
            </v-alert>
          </transition>

          <transition name="fade">
            <v-alert v-if="wachtlijst" type="info" dense>
              Je staat op de wachtlijst
              <v-icon small @click="wachtrijHelp = true">mdi-help-circle-outline</v-icon>
            </v-alert>
          </transition>

          <transition name="fade">
            <v-alert
              v-if="bijbetalingStatus && !loading"
              type="warning"
              v-html="bijbetalingStatus"
            />
          </transition>

          <v-card class="mt-3">
            <v-card-text>
              <v-textarea v-model="reservering.opmerking_gebruiker" label="Opmerking" />

              <v-textarea v-if="isAuthenticated" v-model="reservering.opmerking" label="Reactie" />
            </v-card-text>
          </v-card>

          <v-alert v-if="displayErrors['general']" type="error">{{
            displayErrors.general
          }}</v-alert>

          <v-row>
            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="!!reservering.ingenomen"
            >
              {{ submitText }}
            </v-btn>

            <v-spacer />

            <v-btn
              v-if="reservering.id"
              color="secondary"
              :disabled="!!reservering.ingenomen"
              @click.prevent="annuleren"
            >
              Alle kaarten annuleren
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <payments
      v-if="reservering && reservering.payments"
      :payments="reservering.payments"
    ></payments>

    <v-dialog v-model="wachtrijHelp" max-width="600px">
      <v-card>
        <v-card-title>Hoe werkt de wachtlijst?</v-card-title>

        <v-card-text>
          <p>
            Je komt op de wachtlijst als er voor de voorstelling die je wilt zien onvoldoende
            plaatsen beschikbaar zijn.
          </p>

          <p>
            Mocht het voorkomen dat iemand zijn/haar reservering nog wijzigt, waardoor er alsnog
            voldoende plaatsen vrijkomen, dan krijg je daarvan automatisch bericht en wordt je
            reservering definitief. Pas dan hoef je te betalen.
          </p>

          <p>
            Let wel: je komt pas aan de beurt als het gewenste aantal kaarten vrijkomt. Als je
            bijvoorbeeld 8 kaarten besteld hebt, maar er komen er 2 vrij, dan gaan mensen die 2 of
            minder besteld hebben voor.
          </p>

          <p>
            Als onvoldoende mensen annuleren, kun je naar de voorstelling komen en hopen dat er
            iemand niet op komt dagen. De overgebleven plaatsen worden dan vergeven aan de mensen in
            de wachtlijst, in de volgorde waarin ze in de lijst staan. De lijst wordt gesorteerd op
            het tijdstip waarop de reservering is bevestigd met de bevestigings e-mail die je
            toegestuurd krijgt.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="wachtrijHelp = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="hoewerkthet" max-width="600px">
      <v-card>
        <v-card-title>Hoe werkt het?</v-card-title>

        <v-card-text>
          <h3>Hoe werkt het?</h3>

          <h4>Makkelijk aan te passen</h4>

          <p>
            Je kunt kaarten kopen, maar je zit niet aan je aankoop vast. Het is altijd mogelijk om
            aanpassingen te doen:
          </p>

          <ul>
            <li v-if="datumAanpasbaar">Datum aanpassen</li>

            <li>Kaarten annuleren (zie hieronder)</li>

            <li>Kaarten bijkopen</li>
          </ul>

          <h4>Annuleren</h4>

          <strong>Tot 7 dagen voor de voorstelling</strong>
          :
          <ul>
            <li>Je kunt gratis annuleren (1 of meerdere kaarten)</li>

            <li>Het geld wordt teruggestort</li>
          </ul>

          <strong>minder dan 7 dagen voor de voorstelling: </strong>

          <ul>
            <li>De kaarten worden voor doorverkoop aangeboden</li>

            <li>Zodra iemand anders de kaarten koopt krijg je je geld terug</li>
          </ul>

          <h3>Hoe annuleren?</h3>

          <ul>
            <li>Als je alle kaarten wilt annuleren, klik dan op de knop 'Alle kaarten annuleren</li>

            <li>
              Als je bv. maar één kaart wilt annuleren, verander dan het aantal kaarten dat je
              gekocht hebt. Maak bijvoorbeeld van 3 kaarten een 2. Het verschil zal teruggestort of
              verkocht worden.
            </li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="hoewerkthet = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import { Uitvoering, Ticket } from "~~/models";
import { IReservering, Reservering } from "~~/models/Reservering";
import { IVoorstelling, Voorstelling } from "~~/models/Voorstelling";

const { isAuthenticated } = useAuth();
const form = ref();

const route = useRoute();
const router = useRouter();
const { get } = useAPI();

const reservering = ref<Reservering | null>(null);
const valid = ref(true);
const displayErrors: any = ref({});
const voorstelling = ref<Voorstelling | null>(null);
const uitvoering_id = ref<number | null>(null);
const originalUitvoeringId = ref<number | null>(null);
const originalAantal = ref<number>(0);
const wachtrijHelp = ref(false);
const hoewerkthet = ref(false);
const loading = ref(false);

const aantalKaarten = computed(
  () => reservering.value?.tickets?.reduce((aantal, t) => aantal + +t.aantal, 0) || 0,
);
const teveelKaarten = computed(() => {
  if (!reservering.value?.uitvoering) return false;
  return aantalKaarten.value > reservering.value.uitvoering.aantal_plaatsen;
});

const totaalBedrag = computed(
  () => reservering.value?.tickets?.reduce((totaal, t) => totaal + t.tebetalen, 0) || 0,
);

const wachtlijst = computed(() => {
  return (
    reservering.value?.id &&
    reservering.value?.wachtlijst &&
    uitvoering_id.value === originalUitvoeringId.value
  );
});

const uitvoering = computed(() => {
  return voorstelling.value?.uitvoeringen.find((u) => u.id === uitvoering_id.value);
});

const wachtrijNodig = computed(() => {
  if (wachtlijst.value) return false;
  let retval = false;
  if (uitvoering.value) {
    if (uitvoering_id !== originalUitvoeringId) {
      retval =
        aantalKaarten.value > uitvoering.value.vrije_plaatsen + (uitvoering.value.te_koop || 0);
    } else {
      retval =
        aantalKaarten.value - originalAantal.value >
        uitvoering.value.vrije_plaatsen + (uitvoering.value.te_koop || 0);
    }
  }
  return retval;
});

const betaling = computed(() => totaalBedrag.value > 0);

const rules = {
  naam: [required],
  email: [required, email],
  wachtlijst: [required],
  aantal: [
    () => aantalKaarten.value > 0 || "Geen kaarten geselecteerd",
    () => !teveelKaarten.value || "Teveel kaarten",
  ],
};

const submitText = computed(() => {
  if (betaling.value && !wachtrijNodig.value && !wachtlijst.value) {
    return "Betalen";
  } else {
    return "Opslaan";
  }
});

const datumAanpasbaar = computed(() => voorstelling.value?.uitvoeringen?.length || 0 > 1);

const bijbetalingNodig = computed(() => totaalBedrag.value > 0 && !wachtrijNodig.value);

const bijbetalingStatus = computed(() => {
  if (reservering.value?.id && !wachtlijst?.value) {
    const bedrag = totaalBedrag.value;
    if (bedrag < 0) {
      if (reservering.value.teruggeefbaar) {
        return "Het bedrag zal z.s.m. teruggestort worden";
      } else {
        return "Het bedrag zal teruggestort worden zodra de kaarten opnieuw verkocht zijn";
      }
    } else if (bijbetalingNodig.value) {
      return "Er is bijbetaling nodig";
    }
  }
  return "";
});

watch(
  uitvoering_id,
  (uitvoering_id) => {
    if (!reservering.value || !uitvoering_id) return;
    reservering.value.uitvoering_id = uitvoering_id;
    reservering.value.uitvoering = uitvoering.value as Uitvoering;
  },
  { immediate: true },
);

onMounted(async () => {
  if (route.params.id) {
    try {
      const data = await get<IReservering>(`/reservering/${route.params.id}`, {
        query: {
          include: ["tickets", "payments"],
        },
      });
      reservering.value = new Reservering(data);
    } catch (e) {
      router.replace({ name: "not-found", params: { id: route.params.id } });
    }
  } else {
    reservering.value = new Reservering();
    if (route.query.uitvoeringId) {
      uitvoering_id.value = +route.query.uitvoeringId;
    }
  }

  const voorstellingen = await get<IVoorstelling[]>("/voorstelling", {
    query: {
      include: ["prijzen", "uitvoeringen"],
    },
  });

  if (!voorstelling.value) {
    voorstelling.value = new Voorstelling(voorstellingen[0]);
    if (voorstelling.value.uitvoeringen.length === 1) {
      uitvoering_id.value = voorstelling.value.uitvoeringen[0].id || null;
    }

    voorstelling.value.prijzen?.forEach((prijs) => {
      if (!reservering.value?.tickets.find((t) => t.prijs.id === prijs.id)) {
        const ticket = new Ticket({ prijs, aantal: 0 });
        reservering.value?.tickets.push(ticket);
      }
    });
  }

  originalAantal.value = aantalKaarten.value;
});

function validate() {
  const valid = form.value.validate();

  // TODO
  // if (!valid) {
  //   nextTick(() => {
  //     const el = $el.value.querySelector(".v-messages.error--text:first-of-type");
  //     this.$vuetify.goTo(el);
  //   });
  // }
  return valid;
}

function getNextPage() {
  if (!reservering.value) return;
  let maxRetries = 100;
  const id = reservering.value?.id;
  const { get } = useAPI();
  const router = useRouter();
  const timer = setInterval(async () => {
    try {
      const reservering = await get<Reservering>(`/reservering/${id}`, {
        params: {
          include: ["tickets"],
        },
      });

      if (reservering.wachtlijst || !(reservering.openstaandBedrag > 0)) {
        clearInterval(timer);
        loading.value = false;
        if (isAuthenticated.value) {
          router.push({ name: "beheer-reserveringen" });
        } else {
          router.push({
            name: "reserveren-id-details",
            params: { id },
          });
        }
        // message.value = "Reservering is opgeslagen";
      } else if (reservering.paymentUrl) {
        clearInterval(timer);
        document.location.href = reservering.paymentUrl;
      }
    } catch (e: any) {
      displayErrors.value.general = e.message;
    }
    if (!--maxRetries) {
      clearInterval(timer);
    }
  }, 1000);
}

async function onSubmit() {
  if (!reservering.value) return;
  const { put, post } = useAPI();
  if (validate()) {
    loading.value = true;
    try {
      if (reservering.value?.id) {
        await put<Reservering>(
          `/reservering/${reservering.value.id}`,
          reservering.value.serialize(),
        );
      } else {
        const result = await post<Reservering>("/reservering", reservering.value?.serialize());
        reservering.value.id = result.id;
      }

      getNextPage();
    } catch (e: any) {
      loading.value = false;
      const errors = e.errors || {};

      if (e.response) {
        // error is afkomstig van de server
        const data = e.response.data?.data;
        if (data && data.message) {
          errors.general = data.message;
        } else if (e.message) {
          errors.general = e.message;
        }
      }
      displayErrors.value = errors;
    }
  }
}

async function annuleren() {
  if (!reservering.value) return;
  if (confirm("Weet je zeker dat je deze reservering wilt annuleren?")) {
    const { del } = useAPI();
    const router = useRouter();
    await del(`/reservering/${reservering.value.id}`);
    if (isAuthenticated) {
      router.push({
        name: "beheer-reserveringen",
      });
    } else if (reservering.value.teruggeefbaar) {
      router.push({
        name: "geannuleerd",
      });
    } else {
      router.push({
        name: "reserveren-id-details",
        params: { id: reservering.value.id },
      });
    }
  }
}
</script>

<style scoped>
.total td {
  border-top: 2px double grey !important;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.v-sheet.v-card {
  background-color: #252525;
}
.v-sheet.v-card .v-card {
  background-color: #1e1e1e;
}
</style>
