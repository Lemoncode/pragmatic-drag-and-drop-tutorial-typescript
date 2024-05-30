import "@atlaskit/css-reset";
import AppProvider from "@atlaskit/app-provider";
import { Chessboard } from "./board";

function App() {
  return (
    <AppProvider>
      <Chessboard />
    </AppProvider>
  );
}

export default App;
