import CardComponent from "./components/Card/CardComponent";
import PresaleContextProvider from "./utils/PresaleContextProvider";
import ModalContextProvider from "./utils/ModalContextProvider";
import { ToastContainer, toast } from 'react-toastify';


import { Buffer } from "buffer";



function App() {

  if (!window.Buffer) {
    window.Buffer = Buffer;
}


  return (
    <PresaleContextProvider>
      <ModalContextProvider>
        <CardComponent />
        <ToastContainer/>
      </ModalContextProvider>
    </PresaleContextProvider>
  );
}

export default App;
