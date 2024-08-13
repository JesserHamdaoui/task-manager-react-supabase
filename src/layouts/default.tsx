import { AuthProvider } from "../Providers/AuthProvider";
import SearchProvider from "../Providers/SearchProvider";
import NavbarComponent from "../components/NavbarComponent";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SearchProvider>
        <AuthProvider>
          <NavbarComponent />
        </AuthProvider>
        {children}
      </SearchProvider>
    </>
  );
}
