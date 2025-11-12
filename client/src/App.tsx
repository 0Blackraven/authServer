import { Dashboard } from "./components/Dashboard";
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import {PrivateRoutes} from "../lib/protectedRoute";
import { Join } from "./pages/join";
import { Login } from "./pages/login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path='/:code'  element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
