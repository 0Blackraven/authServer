import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import {PrivateRoutes} from "../lib/protectedRoute";
import { Join } from "./pages/join";
import { Login } from "./pages/login"
import { ForgotPassword } from "./pages/forgotPassword";
import { ResetPassword } from "./pages/resetPassword";
import { SuperSecret } from "./pages/superSecret";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/resetPassword' element={<ResetPassword/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path="/superSecret" element={<SuperSecret/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
