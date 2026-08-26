import axios from "axios";
import { KeyRound, MailCheck, Save, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Popup from "../components/ui/Popup";
import { Button, Input } from "../components/ui/uiExports";
import { getAuthHeaders, getCmsToken, getCmsUser, setCmsSession } from "../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const USER_ENDPOINT = `${API_ROOT}/users`;
const ROLE_ENDPOINT = `${USER_ENDPOINT}/roles`;
const PROFILE_PASSWORD_OTP_ENDPOINT = `${USER_ENDPOINT}/profile/password/request-otp`;
const PROFILE_PASSWORD_RESET_ENDPOINT = `${USER_ENDPOINT}/profile/password/reset`;

const getUserDisplayName = (user) => {
  return (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "CMS User"
  );
};

export default function Profile() {
  const sessionUser = getCmsUser();
  const userId = sessionUser?.id;
  const [formData, setFormData] = useState({
    first_name: sessionUser?.first_name || "",
    last_name: sessionUser?.last_name || "",
    email: sessionUser?.email || "",
    phone_number: sessionUser?.phone_number || "",
    password: "",
    confirm_password: "",
  });
  const [otp, setOtp] = useState("");
  const [roleName, setRoleName] = useState("No role");
  const [errors, setErrors] = useState({});
  const [otpError, setOtpError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);

  const displayName = useMemo(() => getUserDisplayName(formData), [formData]);
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!userId) {
      setLoadError("Unable to find the logged-in user.");
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const [userResponse, rolesResponse] = await Promise.all([
          axios.get(`${USER_ENDPOINT}/${userId}`, { headers: getAuthHeaders() }),
          axios.get(ROLE_ENDPOINT, { headers: getAuthHeaders() }),
        ]);
        const user = userResponse.data?.data || {};
        const roles = rolesResponse.data?.data || [];
        const matchedRole = roles.find((role) => Number(role.id) === Number(user.role_id));

        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          password: "",
          confirm_password: "",
        });
        setRoleName(matchedRole?.name || "No role");
      } catch (err) {
        setLoadError(err.response?.data?.message || err.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccessMessage("");
    setOtpMessage("");

    if (name === "password" || name === "confirm_password") {
      setIsOtpSent(false);
      setOtp("");
      setOtpError("");
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.first_name.trim()) nextErrors.first_name = "First name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validatePasswordReset = () => {
    const nextErrors = {};

    if (!userId) {
      setSubmitError("Unable to find the logged-in user.");
      return false;
    }
    if (!formData.password) nextErrors.password = "Enter a new password first.";
    if (formData.password && formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirm_password) {
      nextErrors.confirm_password = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendPasswordOtp = async () => {
    if (!validatePasswordReset()) return;

    setIsSendingOtp(true);
    setSubmitError("");
    setOtpMessage("");
    setOtpError("");

    try {
      await axios.post(PROFILE_PASSWORD_OTP_ENDPOINT, {}, { headers: getAuthHeaders() });
      setIsOtpSent(true);
      setIsOtpPopupOpen(true);
      setOtpMessage(`OTP sent to ${formData.email}.`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to send password reset OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCloseOtpPopup = () => {
    if (isResettingPassword) return;

    setIsOtpPopupOpen(false);
    setOtpError("");
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!otp.trim()) {
      setOtpError("Enter the OTP sent to your email.");
      return;
    }

    setIsResettingPassword(true);
    setSubmitError("");
    setOtpError("");
    setSuccessMessage("");

    try {
      await axios.post(
        PROFILE_PASSWORD_RESET_ENDPOINT,
        {
          password: formData.password,
          otp,
        },
        { headers: getAuthHeaders() }
      );

      setFormData((current) => ({
        ...current,
        password: "",
        confirm_password: "",
      }));
      setOtp("");
      setIsOtpSent(false);
      setIsOtpPopupOpen(false);
      setOtpMessage("");
      setSuccessMessage("Password updated successfully.");
    } catch (err) {
      setOtpError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId || !validate()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
      };

      const response = await axios.put(`${USER_ENDPOINT}/${userId}`, payload, {
        headers: getAuthHeaders(),
      });
      const updatedUser = response.data?.data || { ...sessionUser, ...payload };
      const token = getCmsToken();

      if (token) {
        setCmsSession({ token, user: updatedUser });
        window.dispatchEvent(new Event("cms-user-updated"));
      }

      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Profile</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Update your CMS profile details and reset your password.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
            {initials}
          </span>
          <div>
            <p className="text-sm font-black text-slate-950">{displayName}</p>
            <p className="text-xs font-bold text-slate-500">{roleName}</p>
          </div>
        </div>
      </section>

      {(loadError || submitError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {loadError || submitError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
          <p className="text-sm font-semibold">Loading profile...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-950">Profile Details</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                These details are used across the CMS profile area.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="e.g. John" error={errors.first_name} required />
              <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="e.g. Doe" error={errors.last_name} />
            </div>

            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="admin@example.com" error={errors.email} required />
            <Input label="Phone Number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} placeholder="e.g. +91 98765 43210" error={errors.phone_number} />
          </section>

          <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-950">Password Reset</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Password changes require an OTP sent to your profile email.
                </p>
              </div>
            </div>

            <Input label="New Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" error={errors.password} />
            <Input label="Confirm Password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} placeholder="Repeat new password" error={errors.confirm_password} />
            <Button
              type="button"
              variant="secondary"
              fullWidth
              isLoading={isSendingOtp}
              disabled={!formData.password || isSubmitting}
              icon={isOtpSent ? <MailCheck className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              onClick={handleSendPasswordOtp}
            >
              {isOtpSent ? "Resend OTP" : "Send OTP"}
            </Button>
            {otpMessage && (
              <p className="text-xs font-bold text-emerald-700">{otpMessage}</p>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} icon={<Save className="h-4 w-4" />}>
              Save Profile
            </Button>
          </section>
        </form>
      )}

      <Popup
        isOpen={isOtpPopupOpen}
        title="Verify Password Reset"
        description={`Enter the OTP sent to ${formData.email}.`}
        onClose={handleCloseOtpPopup}
        size="sm"
        closeOnOverlayClick={!isResettingPassword}
      >
        <form onSubmit={handleResetPassword} className="space-y-5">
          <Input
            label="Email OTP"
            name="profile_password_otp"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value);
              setOtpError("");
            }}
            placeholder="Enter 6-digit OTP"
            error={otpError}
            inputMode="numeric"
            required
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={isResettingPassword || isSendingOtp}
              isLoading={isSendingOtp}
              icon={<MailCheck className="h-4 w-4" />}
              onClick={handleSendPasswordOtp}
            >
              Resend OTP
            </Button>
            <Button
              type="submit"
              isLoading={isResettingPassword}
              icon={<KeyRound className="h-4 w-4" />}
            >
              Verify & Reset
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  );
}
