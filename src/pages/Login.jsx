import React from "react";
import PocketBase from "pocketbase";

const Login = () => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onsubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await pb.collection("users").authWithPassword(email, password);
      localStorage.setItem("token", pb.authStore.token);
      window.location.href = "/chat";
    } catch (error) {
      window.alert("wrong");
    }
  };

  return (
    <div className="grid place-items-center w-[300px] m-auto h-[300px] border border-black">
      <h1>Lost child</h1>
      <form onSubmit={onsubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Lost child email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lost child password"
          required
        />
        <button type="submit">BEcome bald</button>
      </form>
      {loading && <p>wait boy</p>}
    </div>
  );
};

export default Login;
