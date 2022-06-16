import { createRouter, createWebHistory } from 'vue-router'
import { PATHS } from './constants'

const routes = [
  { path: PATHS.ROOT, component: () => import('./pages/Root.vue') },
  {
    path: PATHS.CONFIRM,
    component: () => import('./pages/Confirm.vue'),
  },
  {
    path: PATHS.PICKUP.path,
    component: () => import('./pages/Pickup/PickupDelivery.vue'),
    children: [
      {
        path: PATHS.PICKUP.CHOOSE_TIME,
        component: () => import('./pages/shared-components/ChooseTime.vue'),
      },
      {
        path: PATHS.PICKUP.INFO,
        component: () => import('./pages/Pickup/components/PickupInformation.vue'),
      },
      {
        path: PATHS.PICKUP.COMPLETE_INFORMATION,
        component: () => import('./pages/shared-components/CompleteInformation.vue'),
      },
      {
        path: PATHS.PICKUP.CONFIRM_DELIVERY,
        component: () => import('./pages/shared-components/ConfirmDelivery.vue'),
      },
      {
        path: PATHS.PICKUP.THANKS,
        component: () => import('./pages/shared-components/Thanks.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((_, from) => {
  if (from.fullPath === '/') return
  const scrollTo = document.querySelector('#scrollto')
  if (!scrollTo) return
  scrollTo.scrollIntoView(true)
})

export default router
