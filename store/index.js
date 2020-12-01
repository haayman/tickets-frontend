import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import VuexORMDatabase from "@/models/index.js";
import datePlugin from "vuex-orm-plugin-date-attribute";

VuexORM.use(VuexORMAxios); // <- No axios option.
VuexORM.use(datePlugin);

export const plugins = [VuexORM.install(VuexORMDatabase)];

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  // TODO: Design better rights system
  isSpeler(state) {
    if (!state.auth || !state.auth.user) return false;
    const { role } = state.auth.user;
    return role === "speler" || role === "admin";
  },
  isKassa(state) {
    if (!state.auth || !state.auth.user) return false;
    const { role } = state.auth.user;
    return role === "kassa";
  },

  isAdmin(state) {
    if (!state.auth || !state.auth.user) return false;
    const { role } = state.auth.user;
    return role === "admin";
  },

  loggedInUser(state) {
    if (!state.auth) return null;
    return state.auth.user;
  }
};
