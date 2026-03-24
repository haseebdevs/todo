import { ReactNode } from "react";
import { AuthProvider, ThemeProvider } from "./contexts-index";
import NextTopLoader from "nextjs-toploader";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <NextTopLoader />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export default Provider;
