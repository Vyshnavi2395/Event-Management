import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentSuccess from "./PaymentSuccess";
import Home from "./Home";
import Admin from "./Admin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
