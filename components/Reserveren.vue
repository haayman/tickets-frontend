<template>
  <div>
    <voorstelling v-if="!loggedInUser"></voorstelling>

    <v-card v-if="reservering" class="mt-3">
      <v-card-title>
        Kaarten
        <v-icon small class="float-right ml-3" @click="hoewerkthet = true">
          far fa-question-circle >
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

              <v-alert v-if="errors['general']" dense type="error">{{ errors.general }}</v-alert>

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
              <div v-if="errors.uitvoering" class="invalid-feedback">{{ errors.uitvoering }}</div>

              <v-radio-group v-model="uitvoering_id" :rules="rules.uitvoering_id">
                <uitvoeringen
                  v-if="voorstelling"
                  v-model="uitvoering_id"
                  :uitvoeringen="voorstelling.uitvoeringen"
                />
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-card class="mt-3">
            <v-card-subtitle>Aantal kaarten</v-card-subtitle>

            <v-card-text>
              <div v-if="reservering.tickets">
                <tickets :reservering="reservering" :rules="rules.aantal"></tickets>
              </div>
            </v-card-text>
          </v-card>

          <transition name="fade">
            <v-alert v-if="wachtrijNodig" type="warning" dense>
              <h4 class="alert-heading">Let op!</h4>
              Er zijn onvoldoende plaatsen beschikbaar. Je komt op de wachtlijst
              <v-icon small @click="wachtrijHelp = true"> far fa-question-circle</v-icon>

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
              <v-icon small @click="wachtrijHelp = true"> far fa-question-circle</v-icon>
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

              <v-textarea v-if="loggedInUser" v-model="reservering.opmerking" label="Reactie" />
            </v-card-text>
          </v-card>

          <v-alert v-if="errors['general']" type="error">{{ errors.general }}</v-alert>

          <v-row>
            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="reservering.ingenomen"
            >
              {{ submitText }}
            </v-btn>

            <v-spacer />

            <v-btn
              v-if="reservering.id"
              color="secondary"
              :disabled="reservering.ingenomen"
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

    <v-dialog v-model="message"> {{ message }} </v-dialog>

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

<script>
import { mapGetters } from "vuex";
import { Reservering } from "@/models/Reservering";
import { Ticket } from "@/models/Ticket";
import { Voorstelling } from "@/models/Voorstelling";
import Payments from "@/components/Payments";
import VoorstellingComponent from "@/components/Voorstelling";
import UitvoeringRadio from "@/components/UitvoeringRadio";
import Tickets from "@/components/Tickets";

export default {
  name: "Reserveren",

  components: {
    Payments,
    Voorstelling: VoorstellingComponent,
    uitvoeringen: UitvoeringRadio,
    tickets: Tickets,
  },
  data() {
    return {
      reservering: null,
      valid: true,
      errors: {},
      voorstelling: this.reservering?.voorstelling,
      message: null,
      uitvoering_id: null,
      originalUitvoeringId: null,
      originalAantal: 0,
      wachtrijHelp: false,
      hoewerkthet: false,
      loading: false,
      rules: {
        naam: [required],
        email: [required, email],
        wachtlijst: [required],
        uitvoering_id: [required],
        aantal: [
          () => this.aantalKaarten > 0 || "Geen kaarten geselecteerd",
          () => !this.teveelKaarten || "Teveel kaarten",
        ],
      },
    };
  },

  computed: {
    ...mapGetters(["loggedInUser"]),

    colspanTotal: function () {
      return this.reservering.id ? 2 : 1;
    },
    submitText: function () {
      if (this.betaling && !this.wachtrijNodig && !this.wachtlijst) {
        return "Betalen";
      } else {
        return "Opslaan";
      }
    },
    aantalKaarten: function () {
      return this.reservering?.tickets?.reduce((aantal, t) => aantal + +t.aantal, 0);
    },

    subTotaal: function () {
      return this.reservering.prijs?.prijs * (this.aantalKaarten - this.reservering.aantalBetaald);
    },

    totaalBedrag: function () {
      return this.reservering.tickets?.reduce((totaal, t) => totaal + t.tebetalen, 0);
    },

    datumAanpasbaar() {
      return this.voorstelling?.uitvoeringen?.length > 1;
    },

    betaling: function () {
      return this.totaalBedrag > 0;
    },

    bijbetalingNodig() {
      return this.totaalBedrag > 0 && !this.wachtrijNodig;
    },

    bijbetalingStatus: function () {
      if (this.reservering.id && !this.wachtlijst) {
        const bedrag = this.totaalBedrag;
        if (bedrag < 0) {
          if (this.reservering.teruggeefbaar) {
            return "Het bedrag zal z.s.m. teruggestort worden";
          } else {
            return "Het bedrag zal teruggestort worden zodra de kaarten opnieuw verkocht zijn";
          }
        } else if (this.bijbetalingNodig) {
          return "Er is bijbetaling nodig";
        }
      }
      return "";
    },

    /**
     * berekent of de bestelling groter is dan het aantal beschikbare kaarten
     */
    teveelKaarten() {
      if (!this.uitvoering) return false;
      return this.aantalKaarten > this.uitvoering.aantal_plaatsen;
    },

    wachtrijNodig: function () {
      if (this.wachtlijst) return false;
      let retval = false;
      if (this.uitvoering) {
        if (this.uitvoering_id !== this.originalUitvoeringId) {
          retval =
            this.aantalKaarten > this.uitvoering.vrije_plaatsen + (this.uitvoering.te_koop || 0);
        } else {
          retval =
            this.aantalKaarten - this.originalAantal >
            this.uitvoering.vrije_plaatsen + (this.uitvoering.te_koop || 0);
        }
      }
      return retval;
    },

    wachtlijst() {
      return (
        this.reservering.id &&
        this.reservering.wachtlijst &&
        this.uitvoering_id === this.originalUitvoeringId
      );
    },

    uitvoering: function () {
      const uitvoering = this.voorstelling?.uitvoeringen.find((u) => u.id === +this.uitvoering_id);
      return uitvoering;
    },
  },

  watch: {
    uitvoering_id() {
      this.reservering.uitvoering_id = +this.uitvoering_id;
      this.reservering.uitvoering = this.uitvoering;
    },

    hoewerkthet(toggle) {
      if (toggle) {
        localStorage.setItem("helpShown", true);
      }
    },
    loading(toggle, oldValue) {
      if (toggle && !oldValue) {
        this.$nuxt.$loading.start("opslaan");
      } else if (!toggle && newValue) {
        this.$nuxt.$loading.finish("opslaan");
      }
    },
    aantalKaarten() {
      this.$refs.form?.resetValidation();
    },
  },

  async mounted() {
    if (this.$route.params.id) {
      try {
        const { data } = await this.$axios.get(`/reservering/${this.$route.params.id}`, {
          params: {
            include: ["tickets", "payments"],
          },
        });
        this.reservering = new Reservering(data);
        this.originalUitvoeringId = data.uitvoering.id;
        this.uitvoering_id = data.uitvoering.id;
      } catch (e) {
        this.$router.replace({ name: "not-found" }, { id: this.$route.params.id });
      }
    } else {
      this.reservering = new Reservering();
      if (this.$route.query.uitvoeringId) {
        this.uitvoering_id = +this.$route.query.uitvoeringId;
      }
    }
    const { data: voorstellingen } = await this.$axios.get("/voorstelling", {
      params: {
        include: ["prijzen", "uitvoeringen"],
      },
    });

    if (!this.voorstelling) {
      this.voorstelling = new Voorstelling(voorstellingen[0]);
      // als er maar 1 uitvoering is, dan wordt deze automatisch gekozen
      if (this.voorstelling.uitvoeringen.length === 1) {
        this.uitvoering_id = this.voorstelling.uitvoeringen[0].id;
      }

      this.voorstelling.prijzen?.forEach((prijs) => {
        if (!this.reservering.tickets.find((t) => t.prijs.id === prijs.id)) {
          this.reservering.tickets.push(
            new Ticket({
              prijs,
              aantal: 0,
            }),
          );
        }
      });
    }

    this.originalAantal = this.aantalKaarten;
  },

  methods: {
    setTotaalBedrag(bedrag) {
      this.totaalBedrag = bedrag;
    },

    validate() {
      const valid = this.$refs.form.validate();
      if (!valid) {
        this.$nextTick(() => {
          const el = this.$el.querySelector(".v-messages.error--text:first-of-type");
          this.$vuetify.goTo(el);
        });
      }
      return valid;
    },

    onSubmit() {
      if (this.validate()) {
        this.loading = true;
        this.reservering
          .save(this.$axios)
          .then(() => {
            this.getNextPage();
          })
          .catch((error) => {
            this.loading = false;
            const errors = error.errors || {};

            if (error.response) {
              // error is afkomstig van de server
              const data = error.response.data?.data;
              if (data && data.message) {
                errors.general = data.message;
              } else if (error.message) {
                errors.general = error.message;
              }
            }
            this.errors = errors;
          });
      }
    },

    annuleren() {
      if (confirm("Weet je zeker dat je deze reservering wilt annuleren?")) {
        this.reservering.delete(this.$axios).then(() => {
          if (this.loggedInUser) {
            this.$router.push({
              name: "beheer-reserveringen",
            });
          } else if (this.reservering.teruggeefbaar) {
            this.$router.push({
              name: "geannuleerd",
            });
          } else {
            this.$router.push({
              name: "reserveren-id-details",
              params: { id: this.reservering.id },
            });
          }
        });
      }
    },

    getNextPage() {
      let maxRetries = 100;
      const id = this.reservering.id;
      const timer = setInterval(async () => {
        try {
          const { data: reservering } = await this.$axios.get(`/reservering/${id}`, {
            params: {
              include: ["tickets"],
            },
          });

          if (reservering.wachtlijst || !(reservering.openstaandBedrag > 0)) {
            clearInterval(timer);
            this.loading = false;
            if (this.loggedInUser) {
              this.$router.push({ name: "beheer-reserveringen" });
            } else {
              this.$router.push({
                name: "reserveren-id-details",
                params: { id },
              });
            }
            // this.message = "Reservering is opgeslagen";
          } else if (reservering.paymentUrl) {
            clearInterval(timer);
            document.location.href = reservering.paymentUrl;
          }
        } catch (e) {
          this.errors.general = e.message;
        }
        if (!--maxRetries) {
          clearInterval(timer);
        }
      }, 5000);
    },
  },
};
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
