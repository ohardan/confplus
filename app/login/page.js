"use client";
import FormHeader from "@/app/components/FormHeader";
import Footer from "@/app/components/Footer";
import { loginAction } from "@/app/actions";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const fieldBox = "flex flex-col text-xl";
  const textfield =
    "w-[250px] outline-transparent bg-cp-ghost-white p-1 border-b-[3px] valid:border-green-500";

  return (
    <div className="background items-center">
      <FormHeader />

      <main className="bg-cp-ghost-white w-[400px] h-[450px] p-10 flex flex-col items-center justify-center">
        <form
          className="grid grid-cols-1 place-items-center gap-6"
          action={async (formdata) => {
            const result = await loginAction(formdata);
            if (result.error === 0) {
              localStorage.setItem("user", JSON.stringify(result.payload));
              redirect("/");
            }
            setErrorMsg(result.message);
          }}>
          <p className="text-2xl font-semibold">Login</p>
          <div className={fieldBox}>
            <label
              htmlFor="email"
              className={`relative top-8 ${
                emailFocused ? "isfocused text-black" : "text-gray-500"
              }`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={textfield}
              required
              onChange={() => setErrorMsg("")}
              onFocus={() => setEmailFocused(true)}
              onBlur={(e) => {
                if (!e.target.value) setEmailFocused(false);
              }}
            />
          </div>

          <div className={fieldBox}>
            <label
              htmlFor="password"
              className={`relative top-8 ${
                passFocused ? "isfocused text-black" : "text-gray-500"
              }`}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={textfield}
              required
              onChange={() => setErrorMsg("")}
              onFocus={() => setPassFocused(true)}
              onBlur={(e) => {
                if (!e.target.value) setPassFocused(false);
              }}
            />
          </div>
          <p
            className={`h-[50px] text-red-600 text-lg font-medium ${
              errorMsg ? "error" : ""
            }`}>
            {errorMsg}
          </p>
          <input
            type="submit"
            value="Log In"
            className="w-[200px] bg-cp-indigo text-white font-semibold p-2 rounded-md text-xl cursor-pointer login-btn"
          />
        </form>
      </main>

      <Footer />
    </div>
  );
}
