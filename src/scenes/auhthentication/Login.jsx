import React from "react";

function LoginForm({ onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here
    onLogin();  // Call onLogin to set isAuthenticated to true
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
