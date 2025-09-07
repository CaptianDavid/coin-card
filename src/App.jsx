import CardComponent from "./components/Card/CardComponent";
import PresaleContextProvider from "./utils/PresaleContextProvider";
import ModalContextProvider from "./utils/ModalContextProvider";

function App() {
  return (
    <PresaleContextProvider>
      <ModalContextProvider>
        <CardComponent />
      </ModalContextProvider>
    </PresaleContextProvider>
  );
}

export default App;
