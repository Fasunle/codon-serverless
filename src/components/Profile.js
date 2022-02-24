import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Container from "./Container";

const Profile = () => {
  // local state
  const [user, setUser] = useState({});

  const checkUser = async () => {
    try {
      const data = await Auth.currentUserPoolUser();
      const userInfo = { username: data.username, ...data.attributes };
      setUser(userInfo);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <Container>
      <h1>Profile</h1>
      <h2>User: {user.username}</h2>
      <h3>Email: {user.email}</h3>
      <h4>Phone: {user.phone_number}</h4>
    </Container>
  );
};
/**
 * if user does not exist, the signin/signup UI is provided
  so the client can signin/signup
  if the user exist, the User info is displayed according to
  the component here
 */
export default withAuthenticator(Profile);
