// @ts-nocheck
import fetch from '../../fetch'

const initialState = {
  modalIsOpen: false,
  modalStep: 1,
  error: null,
}

const returnModule = {
  namespaced: true,
  state: () => ({ ...initialState }),
  getters: {},
  actions: {
    toggleModal({ commit, state }) {
      commit('setModalIsOpen', !state.modalIsOpen)
    },
    incrementModalStep({ commit, state }) {
      commit('setModalStep', state.modalStep + 1)
    },
    async postReturn({ commit, dispatch, state, rootState }) {
      if (state.error) commit('setError', null)
      try {
        const { barCode, validation } = rootState
        if (!barCode || !validation) throw Error('Fattas information')

        const { data } = await fetch.post(`/shipments/${barCode}/returnbooking`, { trackingCode: validation })
        dispatch('updateDetails', { pickupCode: data.pickupCode, arrivalTime: data.arrivalTime }, { root: true })
        dispatch('incrementModalStep')
      } catch (error) {
        console.log(error)
        commit('setError', error)
      }
    },
    reset({ commit }) {
      commit('reset')
    },
  },
  mutations: {
    setModalIsOpen(state, modalIsOpen) {
      state.modalIsOpen = modalIsOpen
    },
    setModalStep(state, modalStep) {
      state.modalStep = modalStep
    },
    setError(state, error) {
      state.error = error
    },
    reset(state) {
      Object.assign(state, initialState)
    },
  },
}

export default returnModule
