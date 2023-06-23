import React from "react";
import CommentModal from "./components/CommentModal";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <SnackbarProvider>
      <CommentModal />
    </SnackbarProvider>
  );
}

export default App;
