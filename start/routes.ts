import Route from '@ioc:Adonis/Core/Route'
import '../Routes/Auth'
import '../Routes/User'
import '../Routes/Store'
import '../Routes/Driver'
Route.get('/', async () => {
  return {
    message: `Merchant Address Collection API is up and running on PORT ${process.env.PORT} 🚀`,
  }
})

Route.get('/config', 'ConfigsController.index')
