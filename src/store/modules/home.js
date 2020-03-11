let login = {
  state: {
    screenWidth: 0,
    screenHeight: 0
  },
  mutations: {
    SET_SCREEN_INFO(state, data) {
      let {screenWidth, screenHeight} = data
      state.screenWidth = screenWidth
      state.screenHeight = screenHeight
    }
  },
  actions: {}
}

export default login
