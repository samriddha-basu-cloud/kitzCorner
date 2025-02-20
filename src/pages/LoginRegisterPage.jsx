import Registration from "../components/Registration";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const LoginRegisterPage = () => (
  <div className="grid grid-cols-3 gap-6 p-6">
    <Registration />
    <Login />
    <ForgotPassword />
  </div>
);

export default LoginRegisterPage;
