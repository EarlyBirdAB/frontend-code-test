// @ts-nocheck
import { createStore } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import qs from 'query-string'
import { formatDistanceStrict } from 'date-fns'
import { sv } from 'date-fns/esm/locale'
import fetch from '../fetch'
import router from '../router'
import { getDay, getDateMonth, getTime, getTimeSpan, defaultTimeSlot, getTimeUntilPickup } from '../utils/date-helpers'

import returnModule from './modules/return'

import {
  HOUSE_TYPES,
  DELIVERY_TYPES,
  DELIVERY_TYPES_HOMEDELIVERY,
  NETWORK_STATES,
  PATHS,
  PRODUCT_TYPES,
  EVENT_CODES,
  FAILED_DELIVERIES,
  DELAYED_DELIVERIES,
} from '../constants'

const initialState = {
  /** START DATA STRUCTURE FROM API */
  barCode: null,
  canEdit: null,
  canEditUntil: null,
  canReschedule: false,
  canReturn: false,
  deliveredAt: null,
  deliveryDelayed: null,
  arrivalTime: null,
  handOver: false,
  identification: false,
  info: {
    houseType: null,
    notificationTime: null,
    apartmentFloor: null,
    apartmentNumber: null,
    addressLetter: null,
    doorCode: null,
    careOf: null,
    deliveryType: DELIVERY_TYPES_HOMEDELIVERY.DOOR,
    arrivalMessage: null,
    deliveryWindow: {
      start: null,
      stop: null,
    },
    timeSlot: {
      start: null,
      stop: null,
    },
  },
  metrics: {
    weightInGrams: null,
    lengthInCm: 0,
    widthInCm: 0,
    heightInCm: 0,
  },
  product: {
    id: null,
  },
  receiver: {
    city: null,
    zip: null,
  },
  sender: {
    name: null,
  },
  pickupCode: null,
  collectedAt: null,
  trustPilotUrl: null,
  timeSlots: [],
  /** END DATA STRUCTURE FROM API */
  validation: null,
  /** LOCALLY CREATED DATA */
  checkedHousingType: HOUSE_TYPES.APARTMENT,
  checkedDeliveryNotification: DELIVERY_TYPES.IMMEDIATELY,
  isConfirmed: false,
  events: [],
  networkState: NETWORK_STATES.WAITING,
  error: null,
  hasEdited: false,
  feedbackSent: false,
  editInfo: null,
  activeModal: false,
  showThanks: false,
  showCoField: false,
}

const store = createStore({
  modules: {
    return: returnModule,
  },
  state: () => ({ ...initialState }),
  getters: {
    isLoading({ networkState }) {
      return [NETWORK_STATES.GETTING].includes(networkState)
    },
    isSubmitting({ networkState }) {
      return [NETWORK_STATES.SUBMITTING].includes(networkState)
    },
    isApartment:
      ({ info, editInfo }) =>
      (editMode = false) => {
        return editMode ? editInfo.houseType === HOUSE_TYPES.APARTMENT : info.houseType === HOUSE_TYPES.APARTMENT
      },
    isDisabled({ canEdit }) {
      return !canEdit
    },
    contentLoaded({ events }) {
      return events.length > 0
    },
    timeLeft({ canEditUntil }) {
      const timeLeft = formatDistanceStrict(new Date(), new Date(canEditUntil), {
        locale: sv,
        addSuffix: false,
        onlyNumeric: true,
      })
      return timeLeft
    },
    isHomeDelivery({ product }) {
      return parseInt(product.id) === PRODUCT_TYPES.HOME_DELIVERY
    },
    isPickup({ product }) {
      return [PRODUCT_TYPES.PICKUP, PRODUCT_TYPES.RETURN].some((id) => parseInt(product.id) === id)
    },
    isReturn({ product, canReturn }) {
      return parseInt(product.id) === PRODUCT_TYPES.RETURN || canReturn
    },
    hasTimeSlots({ timeSlots }) {
      return !isEmpty(timeSlots)
    },
    houseTypeSelected({ info }) {
      return info.houseType !== null
    },
    deliveryTypeSelected({ info }) {
      return info.deliveryType !== null
    },
    personalDelivery:
      ({ info, editInfo }) =>
      (editMode = false) => {
        return editMode
          ? editInfo.deliveryType === DELIVERY_TYPES_HOMEDELIVERY.PERSONAL
          : info.deliveryType === DELIVERY_TYPES_HOMEDELIVERY.PERSONAL
      },
    arrivalMessageSelected({ info }) {
      return info.arrivalMessage !== null
    },
    timeSlotSelected({ info }) {
      return info.timeSlot !== null && info.timeSlot.start !== null
    },
    latestEventCode({ events }) {
      return (events.length > 0 && events[0].eventCode) || -1
    },
    isHandoverOrIdentification({ identification, handOver }) {
      return identification || handOver
    },
    isDelivered({ deliveredAt }) {
      return !!deliveredAt
    },

    isCollectedAt({ collectedAt }) {
      return !!collectedAt
    },
    isReturned(_, { latestEventCode }) {
      return latestEventCode === EVENT_CODES.RETURN
    },
    isLost(_, latestEventCode) {
      return latestEventCode === EVENT_CODES.LOST
    },
    lastIsFailed(_, { latestEventCode }) {
      return FAILED_DELIVERIES.includes(latestEventCode)
    },
    isFailedDelivery(_, { isPickup, lastIsFailed }) {
      if (isPickup) return false
      return lastIsFailed
    },
    isFailedPickup(_, { isPickup, lastIsFailed }) {
      return isPickup && lastIsFailed
    },
    isDelayed(_, { latestEventCode }) {
      return DELAYED_DELIVERIES.includes(latestEventCode)
    },
    isOutForDelivery(_, { latestEventCode }) {
      return [EVENT_CODES.DELIVERY_STARTED, EVENT_CODES.DELIVERY_SOON].includes(latestEventCode)
    },
    isDeliveredSoon(_, { latestEventCode }) {
      return latestEventCode === EVENT_CODES.DELIVERY_SOON
    },
    isReturning({ pickupCode, arrivalTime }) {
      if (!pickupCode || !arrivalTime?.start) return false
      return true
    },
    feedbackHomeDeliveryVisible({ events }) {
      return !events.some((event) => event.eventCode === EVENT_CODES.DELIVERY_STARTED)
    },
    formattedArrivalTime({ deliveryDateIsUnknown, deliveredAt, arrivalTime, info, hasEdited }, { isReturned, isLost }) {
      if (isReturned || isLost) return { day: 'Leverans ej möjlig', date: 'Leverans ej möjlig', time: '' }
      if (deliveryDateIsUnknown) return { day: 'Inväntar ny leveransdag', date: 'Inväntar ny leveransdag', time: '' }

      let day = ''
      let date = ''
      let time = ''

      if (info.timeSlot && info.timeSlot.start) {
        day = getDay(info.timeSlot.start)
        date = getDateMonth(info.timeSlot.start)
        time = getTimeSpan(info.timeSlot)
      }

      if (arrivalTime && arrivalTime.start && hasEdited) {
        day = getDay(arrivalTime.start)
        date = getDateMonth(arrivalTime.start)
        time = getTimeSpan(arrivalTime)
      }

      if (!!deliveredAt) {
        day = getDay(deliveredAt)
        date = getDateMonth(deliveredAt)
        time = getTime(deliveredAt)
      }

      return { day, date, time }
    },
    timeUntilPickup({ arrivalTime, info }) {
      let time = arrivalTime?.start
      if (!time) time = new Date(info.timeSlot.start)
      return getTimeUntilPickup(new Date(time))
    },
  },
  actions: {
    async getDetails({ commit, dispatch, state }) {
      try {
        commit('setNetworkState', NETWORK_STATES.GETTING)
        const { data: details } = await fetch.get(
          `/shipments/${state.barCode}/deliveryinfo?trackingcode=${state.validation}`
        )

        /** If at least one of `details.info` values aren't null we know that someone has edited them previously so we `toggleConfirmed` */
        const edited = Object.values(details.info).some((value) => {
          return value !== null && typeof value !== 'object'
        })

        const isHomeDelivery = parseInt(details.product.id) === PRODUCT_TYPES.HOME_DELIVERY
        const isPickup = parseInt(details.product.id) === PRODUCT_TYPES.PICKUP
        const { canEdit, deliveredAt, deliveryDateIsUnknown } = details
        const confirmed = edited || !canEdit || !!deliveredAt || deliveryDateIsUnknown

        if (isHomeDelivery && confirmed) {
          router.replace(`${PATHS.HOME_DELIVERY.path}/${PATHS.HOME_DELIVERY.THANKS}${location.search}`)
          commit('setHasEdited', true)
        } else if (isHomeDelivery) {
          router.replace(`${PATHS.HOME_DELIVERY.path}/${PATHS.HOME_DELIVERY.COMPLETE_INFORMATION}${location.search}`)
        } else if (isPickup && confirmed) {
          router.replace(`${PATHS.PICKUP.path}/${PATHS.PICKUP.THANKS}${location.search}`)
          commit('setHasEdited', true)
        } else if (isPickup) {
          router.replace(`${PATHS.PICKUP.path}/${PATHS.PICKUP.CHOOSE_TIME}${location.search}`)
        } else if (confirmed) {
          dispatch('toggleConfirmed')
          router.replace(PATHS.CONFIRM + location.search)
          commit('setHasEdited', true)
        }

        dispatch('formatAndUpdateDetails', details)

        commit('setNetworkState', NETWORK_STATES.SUCCESS)
      } catch (error) {
        console.error(error)
        commit('setNetworkState', NETWORK_STATES.ERROR)
        commit('setError', error)
      }
    },
    async getEvents({ commit, state }) {
      try {
        const { data: events } = await fetch.get(`/shipments/${state.barCode}/statusIncludingPinMetadata`)
        commit('setEvents', events)
      } catch (error) {
        console.error(error)
        commit('setError', error)
      }
    },
    async getTimeSlots({ commit, state }) {
      try {
        const res = await fetch.get(
          `/shipments/${state.barCode}/checkPossibleDeliveryDay?trackingCode=${state.validation}`
        )
        const timeSlots = !res.data ? [] : res.data.possibleDeliveryDays.map((date) => defaultTimeSlot(date))
        commit('setTimeSlots', timeSlots)
        return timeSlots
      } catch (error) {
        console.error(error)
        commit('setError', error)
      }
    },
    updateValue({ commit }, payload) {
      commit('setValue', payload)
    },
    updateDetails({ commit }, payload) {
      commit('setDetails', payload)
    },
    updateDetail({ commit }, payload) {
      commit('setDetail', payload)
    },
    toggleConfirmed({ commit }) {
      commit('setConfirmed')
    },
    formatAndUpdateDetails({ commit, dispatch }, payload) {
      const isPickup = [PRODUCT_TYPES.PICKUP].includes(parseInt(payload.product.id))
      let arrivalTime = payload.arrivalTime
      if (isPickup) {
        arrivalTime = arrivalTime?.start ? defaultTimeSlot(arrivalTime.start) : null
        dispatch('getTimeSlots')
      }
      commit('setDetails', {
        ...payload,
        arrivalTime,
        info: { ...payload.info, timeSlot: arrivalTime },
      })
    },
    async postUpdate({ commit, dispatch, state, getters }, { inModal = false, editMode = false }) {
      const data = inModal ? state.editInfo : state.info
      try {
        commit('setNetworkState', NETWORK_STATES.SUBMITTING)

        if (!editMode) {
          //Filter out asterix values
          const values = Object.entries(data).reduce((acc, [key, value]) => {
            if (!/^([*]\s*)+$/g.test(value?.trim?.())) {
              acc[key] = value
            }
            return acc
          }, {})

          // Set `timeSlot` to null if no start or stop is set
          let timeSlot = null
          if (values.timeSlot) {
            timeSlot = Object.values(values.timeSlot).some((value) => value === null) ? null : values.timeSlot
          }

          const payload = { ...values, trackingCode: state.validation, timeSlot }

          if (!state.canReschedule && !getters.isPickup) {
            delete payload.timeSlot
          }

          if (!getters.isHomeDelivery) {
            delete payload.deliveryType
          }

          await fetch.post(`/shipments/${state.barCode}/deliveryinfo`, payload)

          const { data: result } = await fetch.get(
            `/shipments/${state.barCode}/deliveryinfo?trackingCode=${state.validation}`
          )
          dispatch('formatAndUpdateDetails', result)
          commit('setNetworkState', NETWORK_STATES.SUCCESS)
        } else {
          commit('setDetails', { info: data })
        }

        dispatch('toggleConfirmed')
      } catch (error) {
        console.error(error)
        commit('setNetworkState', NETWORK_STATES.ERROR)
        commit('setError', error)
      }
    },

    async postFeedback({ commit, state }, message) {
      try {
        commit('setNetworkState', NETWORK_STATES.SUBMITTING)
        await fetch.post(`/shipments/${state.barCode}/deliveryinfo/feedback`, {
          message,
          trackingCode: state.validation,
        })
        commit('setNetworkState', NETWORK_STATES.SUCCESS)
        commit('setFeedbackSent', true)
      } catch (error) {
        console.error(error)
        commit('setNetworkState', NETWORK_STATES.ERROR)
        commit('setError', error)
      }
    },

    setValidations({ commit }) {
      const params = qs.parse(location.search)
      if (!params.a || !params.b) {
        commit('setError', 'Required params not available')
        return
      }
      commit('setValidations', params)
    },

    resetEditInfo({ commit }) {
      commit('resetEditInfo')
    },
    updateModal({ commit }, value) {
      commit('setModalActive', value)
    },
    updateHasEdited({ commit }, value) {
      commit('setHasEdited', value)
    },
    updateThanks({ commit }, value) {
      commit('setShowThanks', value)
    },
    async rescheduleTime({ commit, dispatch, state, getters }) {
      try {
        let timeslot
        // If the reschedule is for a return, fetch and use the first timeslot from the API
        if (getters.isReturn) {
          const timeSlots = await dispatch('getTimeSlots')
          if (timeSlots.length === 0) throw new Error('Inga tidpunkter tillgängliga')
          timeslot = timeSlots[0]
        } else {
          timeslot = state.info.timeSlot
        }
        const payload = { trackingCode: state.validation, timeslot }
        await fetch.post(`/shipments/${state.barCode}/deliveryinfo`, payload)
        dispatch('getDetails')
      } catch (error) {
        console.error(error)
        commit('setError', error)
      }
    },
  },
  mutations: {
    setValue(state, { key, value }) {
      state = { ...state, [key]: value }
    },
    setDetail(state, { key, value, editMode = false }) {
      if (editMode) {
        state.editInfo[key] = value
      } else {
        state.info[key] = value
      }
    },
    setConfirmed(state) {
      state.isConfirmed = !state.isConfirmed
    },
    setDetails(state, details) {
      Object.keys(details).map((key) => (state[key] = details[key]))

      if (details.handOver || details.identification) {
        state.info.deliveryType = 'Personal'
      } else if (details.info && details.info.deliveryType === undefined) {
        // Todo: This should be sent from the API
        state.info.deliveryType = null
      }

      /** Set arrivalTime as the selected timeSlot if arrivalTime is returned with the slot format, i.e. { start: DATE, stop: DATE } */
      if (details.arrivalTime && details.arrivalTime.start) {
        state.info.timeSlot = details.arrivalTime
      }
    },
    updateDetails(state, info) {
      state.info = {
        ...info,
      }
    },
    setHasEdited(state, hasEdited) {
      state.hasEdited = hasEdited
    },
    setEvents(state, events) {
      state.events = events.sort((a, b) => {
        if (a.eventTime > b.eventTime) return -1
        else if (a.eventTime < b.eventTime) return 1
        else return 0
      })
    },
    setTimeSlots(state, timeSlots) {
      state.timeSlots = timeSlots
    },
    setValidations(state, { a, b }) {
      state.barCode = a
      state.validation = b
    },
    setFeedbackSent(state, bool) {
      state.feedbackSent = bool
    },
    setNetworkState(state, networkState) {
      if (state.error !== null) {
        state.error = initialState.error
      }
      state.networkState = networkState
    },
    setError(state, error) {
      state.error = error
    },
    resetEditInfo(state) {
      state.editInfo = { ...state.info }
    },
    setModalActive(state, value) {
      state.activeModal = value
    },
    setShowThanks(state, value) {
      state.showThanks = value
    },
  },
})

export default store
