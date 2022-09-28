import Store from 'App/Models/Store/Store'

export const checkRegion = async (auth, storeId) => {
  const store = await Store.find(storeId)
  await store?.load('storeAddress')
  const storeCountry = store?.storeAddress?.country?.toUpperCase()
  const status = store?.status
  const userCountry = auth.user?.country?.toUpperCase()
  if (auth.user.roles.slug === 'user') {
    if (storeCountry) {
      if (storeCountry !== userCountry) {
        if (status === 'active' || status === 'deleted') return true
      }
    }
  }
  return false
}
