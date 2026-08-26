import axios from "axios";
import { ArrowLeft, KeyRound, LogIn, MailCheck, Send } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui/uiExports";
import { isCmsAuthenticated, setCmsSession } from "../utils/auth";
import logo from "../../assets/logo.webp";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const LOGIN_ENDPOINT =
  import.meta.env.VITE_CMS_LOGIN_ENDPOINT || `${API_ROOT}/users/login`;
const FORGOT_PASSWORD_OTP_ENDPOINT = `${API_ROOT}/users/forgot-password/request-otp`;
const FORGOT_PASSWORD_RESET_ENDPOINT = `${API_ROOT}/users/forgot-password/reset`;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  if (isCmsAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;

    setResetData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
    setSuccessMessage("");
  };

  const validateLogin = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateResetEmail = () => {
    const nextErrors = {};

    if (!resetData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateResetPassword = () => {
    const nextErrors = {};

    if (!resetData.email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (!resetData.otp.trim()) {
      nextErrors.otp = "OTP is required.";
    }
    if (!resetData.password) {
      nextErrors.password = "New password is required.";
    } else if (resetData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (resetData.password !== resetData.confirm_password) {
      nextErrors.confirm_password = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const showResetMode = () => {
    setIsResetMode(true);
    setIsOtpSent(false);
    setErrors({});
    setSubmitError("");
    setSuccessMessage("");
    setResetData((current) => ({
      ...current,
      email: current.email || formData.email,
    }));
  };

  const showLoginMode = () => {
    setIsResetMode(false);
    setIsOtpSent(false);
    setErrors({});
    setSubmitError("");
    setSuccessMessage("");
    setResetData({
      email: "",
      otp: "",
      password: "",
      confirm_password: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateLogin()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await axios.post(LOGIN_ENDPOINT, formData);
      const token = response.data?.token;

      if (!token) {
        throw new Error("Login response did not include a token.");
      }

      setCmsSession({
        token,
        user: response.data?.data || null,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Unable to login."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResetOtp = async (event) => {
    event.preventDefault();

    if (!validateResetEmail()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      await axios.post(FORGOT_PASSWORD_OTP_ENDPOINT, {
        email: resetData.email,
      });
      setIsOtpSent(true);
      setSuccessMessage("OTP sent to your email.");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Unable to send password reset OTP."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!validateResetPassword()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      await axios.post(FORGOT_PASSWORD_RESET_ENDPOINT, {
        email: resetData.email,
        otp: resetData.otp,
        password: resetData.password,
      });

      setFormData((current) => ({
        ...current,
        email: resetData.email,
        password: "",
      }));
      setIsResetMode(false);
      setIsOtpSent(false);
      setResetData({
        email: "",
        otp: "",
        password: "",
        confirm_password: "",
      });
      setSuccessMessage("Password reset successfully. You can login now.");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Unable to reset password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <img
              src={logo}
              alt="Assipl Logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Assipl
            </p>
            <h1 className="text-2xl font-black text-slate-950">
              {isResetMode ? "Reset Password" : "CMS Login"}
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">
          {isResetMode
            ? "Enter your email to receive an OTP, then set a new password."
            : "Sign in to manage CMS content, SEO settings, and consent records."}
        </p>

        {submitError && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={isOtpSent ? handleResetPassword : handleRequestResetOtp} className="mt-6 space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={resetData.email}
              onChange={handleResetChange}
              placeholder="admin@example.com"
              error={errors.email}
              disabled={isOtpSent}
              required
            />

            {isOtpSent && (
              <>
                <Input
                  label="OTP"
                  name="otp"
                  value={resetData.otp}
                  onChange={handleResetChange}
                  placeholder="Enter 6-digit OTP"
                  error={errors.otp}
                  inputMode="numeric"
                  required
                />
                <Input
                  label="New Password"
                  name="password"
                  type="password"
                  value={resetData.password}
                  onChange={handleResetChange}
                  placeholder="At least 8 characters"
                  error={errors.password}
                  required
                />
                <Input
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  value={resetData.confirm_password}
                  onChange={handleResetChange}
                  placeholder="Repeat new password"
                  error={errors.confirm_password}
                  required
                />
              </>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                icon={isOtpSent ? <KeyRound className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              >
                {isOtpSent ? "Reset Password" : "Send OTP"}
              </Button>
              {isOtpSent && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  disabled={isSubmitting}
                  icon={<MailCheck className="h-4 w-4" />}
                  onClick={handleRequestResetOtp}
                >
                  Resend OTP
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                fullWidth
                disabled={isSubmitting}
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={showLoginMode}
              >
                Back to Login
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
            />

            <button
              type="button"
              onClick={showResetMode}
              className="text-sm font-black text-slate-600 transition hover:text-slate-950"
            >
              Forgot password?
            </button>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              icon={<LogIn className="h-4 w-4" />}
            >
              Login
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
