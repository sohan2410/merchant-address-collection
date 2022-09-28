import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('driver/other-details', 'Driver/OtherDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('driver/proof-of-identity-details', 'Driver/IdentityProofsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('driver/employment-details', 'Driver/EmploymentDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('driver/communication-details', 'Driver/CommunicationDetailsController').apiOnly().middleware({ '*': 'auth' })
  Route.resource('driver', 'Driver/DriversController').apiOnly().middleware({ '*': 'auth' })
})
