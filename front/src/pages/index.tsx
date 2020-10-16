import { useContext } from "react";
import { Layout } from "../components/Layout";
import { useLocalStateContext } from "../utils/hooks";

const Index = () => {
  const ctx = useLocalStateContext();
  return (
    <p>
      {JSON.stringify(ctx)}
    </p>
  );
};

export default Index;