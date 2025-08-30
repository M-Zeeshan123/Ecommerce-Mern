import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      rgba(255,255,255,0),
      rgba(255,255,255,0.5)
    ), url("https://i.ibb.co/t8fVH1s/seductive-blonde-woman-pink-jacket-posing.jpg" )center;
    background-size: cover;
    object-fit: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    color: aliceblue;
`;
const Wrapper = styled.div`
    padding: 21px;
    width: 40%;
    display: flex;
    background-color: transparent;background: linear-gradient(
      rgba(0,0,0,0.4),
      rgba(0,0,0,0.7)
    );

    flex-direction: column;`;
const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
    `;
const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
`;
const Input = styled.input`
    flex: 1;
    min-width: 40%;
    margin: 20px 10px 0px 0px;
    padding: 10px;
`;
const Agreement = styled.span`
    font-size: 12px;
    margin: 20px 0px;
`;
const Button = styled.button`
    width: 40%;
    border: none;
    font-size: 20px;
    padding: 15px 20px;
    background-color: #555;
    color: aliceblue;
    font-weight: 300;
`;

const Register = () => {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE ACCOUNT</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="username"
            placeholder="username"
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            onChange={handleChange}
            required
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>.
          </Agreement>
          {error && <span style={{ color: "red", margin: "10px 0" }}>{error}</span>}
          <Button type="submit">CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Register