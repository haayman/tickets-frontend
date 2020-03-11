export const getters = {
  isAuthenticated(state) {
    console.log({ auth: state.auth })
    return state.auth.loggedIn
  },

  // TODO: Design better rights system
  isSpeler(state) {
    const { role } = state.auth.user.user
    return role === 'speler' || role === 'admin'
  },
  isKassa(state) {
    const { role } = state.auth.user.user
    return role === 'kassa'
  },

  isAdmin(state) {
    const { role } = state.auth.user.user
    return role === 'admin'
  },

  loggedInUser(state) {
    return state.auth.user.user
  }
}
