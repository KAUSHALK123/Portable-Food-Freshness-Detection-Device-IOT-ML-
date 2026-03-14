import { useEffect, useState } from "react";
import { apiFetch, endpoints } from "../utils/api";

const initialForm = {
	email: "",
	password: "",
	confirmPassword: "",
	supermarket_name: "",
	phone_number: "",
};

const Login = ({ onAuthSuccess }) => {
	const [mode, setMode] = useState("login");
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setError("");
		setInfo("");
	}, [mode]);

	const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

	const submit = async (event) => {
		event.preventDefault();
		setError("");
		setInfo("");

		if (mode === "register") {
			if (!form.supermarket_name.trim()) {
				setError("Supermarket name is required.");
				return;
			}

			if (form.password !== form.confirmPassword) {
				setError("Passwords do not match.");
				return;
			}
		}

		setLoading(true);

		try {
			if (mode === "register") {
				await apiFetch(endpoints.register, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: form.email.trim(),
						password: form.password,
						phone_number: form.phone_number.trim() || null,
						supermarket_name: form.supermarket_name.trim(),
					}),
				});

				setInfo("Account created successfully! Logging you in...");
			}

			const loginPayload = await apiFetch(endpoints.login, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: form.email.trim(), password: form.password }),
			});

			onAuthSuccess(loginPayload);
		} catch (apiError) {
			const errorMsg = apiError.message || "Unable to authenticate";
			console.error("[Login Error]", {
				message: errorMsg,
				endpoint: mode === "register" ? endpoints.register : endpoints.login,
				email: form.email,
			});
			
			if (errorMsg.includes("Email already registered")) {
				setError("This email is already registered. Try logging in instead.");
			} else if (errorMsg.includes("Invalid credentials")) {
				setError("Email or password is incorrect. Please check and try again.");
			} else if (errorMsg.includes("fetch")) {
				setError(
					"Cannot reach the backend. Ensure it's running at http://127.0.0.1:8000 and try again."
				);
			} else {
				setError(errorMsg);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
			<div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
				<section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 text-white p-8 md:p-10 shadow-xl relative overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80"
						alt="Supermarket background"
						className="absolute inset-0 h-full w-full object-cover blur-[5px] scale-110 opacity-20"
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-700/90 via-emerald-600/90 to-lime-500/90" />
					
					<div className="relative z-10">
						<p className="text-xs uppercase tracking-[0.35em] text-emerald-100">FreshTrack Access</p>
						<h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
							Create your supermarket account and manage freshness in real time.
						</h1>
						<p className="mt-5 text-emerald-50/90 max-w-xl">
							Sign up once, then log in to configure containers, watch sensor readings, and receive spoilage alerts.
						</p>

						<div className="grid sm:grid-cols-3 gap-3 mt-8">
							<FeaturePill label="Secure login" />
							<FeaturePill label="JWT auth" />
							<FeaturePill label="Live dashboard" />
						</div>
					</div>
				</section>

				<section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
					<div className="flex rounded-2xl bg-gray-100 p-1 mb-6">
						<ModeButton active={mode === "login"} onClick={() => setMode("login")}>
							Login
						</ModeButton>
						<ModeButton active={mode === "register"} onClick={() => setMode("register")}>
							Create Account
						</ModeButton>
					</div>

					<h2 className="text-2xl font-black text-gray-900">
						{mode === "login" ? "Welcome back" : "Create your account"}
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						{mode === "login"
							? "Use your registered email and password."
							: "Your account will be stored in the backend database."}
					</p>

					<form className="mt-6 space-y-4" onSubmit={submit}>
						{mode === "register" && (
							<>
								<FieldLabel label="Supermarket Name" />
								<input
									type="text"
									value={form.supermarket_name}
									onChange={(e) => updateField("supermarket_name", e.target.value)}
									placeholder="Demo Mart"
									className="w-full border p-3 rounded-xl outline-none focus:border-green-500"
									required
								/>

								<FieldLabel label="Phone Number" optional />
								<input
									type="tel"
									value={form.phone_number}
									onChange={(e) => updateField("phone_number", e.target.value)}
									placeholder="+91XXXXXXXXXX"
									className="w-full border p-3 rounded-xl outline-none focus:border-green-500"
								/>
							</>
						)}

						<FieldLabel label="Email" />
						<input
							type="email"
							value={form.email}
							onChange={(e) => updateField("email", e.target.value)}
							placeholder="owner@example.com"
							className="w-full border p-3 rounded-xl outline-none focus:border-green-500"
							required
						/>

						<FieldLabel label="Password" />
						<input
							type="password"
							value={form.password}
							onChange={(e) => updateField("password", e.target.value)}
							placeholder="Minimum 6 characters"
							className="w-full border p-3 rounded-xl outline-none focus:border-green-500"
							minLength={6}
							required
						/>

						{mode === "register" && (
							<>
								<FieldLabel label="Confirm Password" />
								<input
									type="password"
									value={form.confirmPassword}
									onChange={(e) => updateField("confirmPassword", e.target.value)}
									placeholder="Re-enter password"
									className="w-full border p-3 rounded-xl outline-none focus:border-green-500"
									minLength={6}
									required
								/>
							</>
						)}

						{info && <p className="text-sm text-emerald-700">{info}</p>}
						{error && <p className="text-sm text-red-600">{error}</p>}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-60"
						>
							{loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
						</button>
					</form>

					<p className="mt-5 text-xs text-gray-500 leading-5">
						If this page keeps failing, verify the backend is running at `http://127.0.0.1:8000` before trying again.
					</p>
				</section>
			</div>
		</div>
	);
};

const ModeButton = ({ active, onClick, children }) => (
	<button
		type="button"
		onClick={onClick}
		className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold transition ${
			active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
		}`}
	>
		{children}
	</button>
);

const FeaturePill = ({ label }) => (
	<div className="rounded-2xl bg-white/12 border border-white/20 px-4 py-3 text-sm font-semibold">
		{label}
	</div>
);

const FieldLabel = ({ label, optional = false }) => (
	<label className="block text-sm font-bold text-gray-700 mb-1">
		{label}
		{optional && <span className="text-gray-400 font-medium ml-1">optional</span>}
	</label>
);

export default Login;
