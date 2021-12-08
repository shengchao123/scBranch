
import store from '../store'

export function hasAuth (url) {
  if (store.state.user.userLimit[0] === 'all') return true

  if (!url || !store.state.user.userLimit) return false

  return store.state.user.userLimit.includes(url)
}
