import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.patch('user', 'UsersController.update').middleware('auth')
  Route.post('user/deactivate', 'UsersController.deactivateUser').middleware(['auth', 'admin'])
  Route.post('user/activate', 'UsersController.activateUser').middleware(['auth', 'admin'])
})
