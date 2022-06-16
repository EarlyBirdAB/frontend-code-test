// @ts-nocheck
import {
  getWeek,
  getYear,
  differenceInWeeks,
  format,
  isSameDay,
  addDays,
  startOfWeek,
  formatDistanceToNow,
} from 'date-fns'
import { sv } from 'date-fns/esm/locale'
import { firstUppercase } from './string-helpers'

export const getTime = (time) => `${format(new Date(time), 'HH:mm', { locale: sv })}`

export const getTimeSpan = (currentDate) => {
  return `${getTime(currentDate.start)}–${getTime(currentDate.stop)}`
}

export const getDateMonth = (currentDate, daySuffix = false) => {
  const fmt = daySuffix ? 'do MMMM' : 'd MMMM'
  return `${format(new Date(currentDate), fmt, {
    locale: sv,
  })}`
}

export const getDayDescription = (currentDate, withPrefix = false) => {
  const sameDay = isSameDay(new Date(), new Date(currentDate))
  const nextDay = isSameDay(addDays(new Date(), 1), new Date(currentDate))
  const prefix = withPrefix && (sameDay || nextDay) ? getDayDescription(currentDate) + ' ' : ''
  return (
    prefix +
    (!withPrefix && sameDay
      ? 'Idag'
      : !withPrefix && nextDay
      ? 'Imorgon'
      : `${format(new Date(currentDate), 'EEEE', {
          locale: sv,
        })}`)
  )
}

export const getTimeUntilPickup = (currentDate) => {
  const today = isSameDay(addDays(new Date(), 1), new Date(currentDate))
  const tomorrow = isSameDay(addDays(new Date(), 2), new Date(currentDate))
  if (today) return 'ikväll senast 23:00'
  if (tomorrow) return 'imorgon kväll senast 23:00'
  return 'på ' + format(addDays(new Date(currentDate), -1), 'EEEE', { locale: sv }) + ' senast 23:00'
}

export const getWeekNumber = (currentDate) => {
  const date = currentDate ? new Date(currentDate) : new Date()
  return getWeek(date, {
    locale: sv,
  })
}

export const getYearNumber = (currentDate) => {
  const date = currentDate ? new Date(currentDate) : new Date()
  return getYear(date, {
    locale: sv,
  })
}

export const weekDifference = (currentDate) => {
  const currentWeek = startOfWeek(new Date(currentDate), { weekStartsOn: 1 })
  const nowWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  return differenceInWeeks(currentWeek, nowWeek)
}

export const getDay = (currentDate, withPrefix = true) => {
  return firstUppercase(`${getDayDescription(currentDate, withPrefix)} ${getDateMonth(currentDate)}`)
}

export const defaultTimeSlot = (date) => {
  if (!date) return date
  const selectedDate = date.split('T')[0]
  return {
    start: `${selectedDate}T01:00:00`,
    stop: `${selectedDate}T07:00:00`,
  }
}
