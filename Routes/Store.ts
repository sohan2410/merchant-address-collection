import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('store/address', 'Store/StoreAddressesController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('store/services', 'Store/ServicesController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('store/personnel-details', 'Store/PersonnelDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('store/contract-details', 'Store/ContractDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('store/additional-details', 'Store/AdditionalDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('store/image', 'Store/StoreImagesController').apiOnly().middleware({ '*': 'auth' })
  Route.post('store/deactivate', 'Store/StoresController.deactivateStore').middleware('auth')
  Route.post('store/activate', 'Store/StoresController.activateStore').middleware('auth')
  Route.resource('store', 'Store/StoresController')
    .apiOnly()
    .middleware({ index: 'auth', store: 'auth', show: ['auth', 'region'], update: ['auth', 'region'], destroy: ['auth', 'region'] })
})
