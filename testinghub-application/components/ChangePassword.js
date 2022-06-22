import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const { data: session } = useSession();

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user.email,
        password,
        newPassword,
        confirmPassword,
      }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="border p-2 center">
      <h3>Change your Password</h3>
      <form>
        <p>Current password: </p>
        <input
          type="password"
          name="currentPassword"
          id="currentPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <p>New password: </p>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <p>Confirm new password: </p>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        <br />
        <br />
        <button
          className="bg-[#3a7fed] text-white p-1 rounded"
          type="submit"
          onClick={(e) => changePassword(e)}
        >
          Change Password
        </button>
        <p className="text-red-600">{message}</p>
      </form>
    </div>
  );
}
