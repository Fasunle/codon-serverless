import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "./Container";

const Protected = () => {
  // helper hook provided by react-router-dom
  const navigation = useNavigate();

  useEffect(() => {
    Auth.currentAuthenticatedUser().catch(() => {
      navigation("/profile");
    });
  }, [navigation]); // when navigation changes, the page is refreshed

  return (
    <Container>
      <h2>Hello Protected</h2>
    </Container>
  );
};

export default Protected;
