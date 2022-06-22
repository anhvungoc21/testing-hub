import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = router.query;

  const forgetPassword = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const res = await fetch(`api/reset/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  };
  return (
    <form>
      <label>
        Enter new password:
        <input
          id="password"
          name="newPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </label>
      <br />
      <label>
        Confirm new password:
        <input
          id="password"
          name="confirmNewPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
      </label>
      <br />
      <button type="submit" onClick={(e) => forgetPassword(e)}></button>
      <p style={{ color: "red" }}>{message}</p>
    </form>
  );
}
