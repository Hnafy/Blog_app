import { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(false);
  let [postId, setPostId] = useState();
  return (
    <DialogContext.Provider value={{ dialog, setDialog, postId, setPostId }}>
      {children}
    </DialogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
  return useContext(DialogContext);
}
