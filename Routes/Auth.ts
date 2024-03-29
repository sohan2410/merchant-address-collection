import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'Auth/RegistersController.store').middleware(['auth', 'admin'])
  Route.post('/login', 'Auth/LoginController.store')
  Route.post('/reset-password', 'Auth/ResetPasswordsController.store').middleware('auth')
  Route.post('/forgot-password', 'Auth/ForgetPasswordsController.store')
  Route.get('/forgot-password/:username', 'Auth/ForgetPasswordsController.verifySignedUrl').as('forgotPassword')
  Route.patch('/forgot-password/:username', 'Auth/ForgetPasswordsController.changePassword')
  Route.delete('/logout', 'Auth/LoginController.destroy').middleware('auth')
  Route.get('/user', 'Auth/LoginController.index').middleware('auth')
  // Route.resource('/forget-password', 'Auth/ForgetPasswordsController')
}).prefix('auth')
