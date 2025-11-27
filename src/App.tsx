import { AuthInitializer } from './components/auth/AuthInitializer'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <AuthInitializer>
      <AppRouter />
    </AuthInitializer>
  )
}

export default App
