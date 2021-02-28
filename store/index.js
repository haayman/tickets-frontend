import { User } from "@/models/User"

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
    const user = state.auth?.user;
    return user ? new User(user) : null;
  }
};
