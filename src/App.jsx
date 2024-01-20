import { useConsumeAppContext } from "./hooks/useConsumeAppContext";
import { MainContainer } from "./components/MainContainer";

const App = () => {
  const context = useConsumeAppContext();

  console.log(context);

  return (
    <>
      <MainContainer></MainContainer>
    </>
  );
};

export default App;
