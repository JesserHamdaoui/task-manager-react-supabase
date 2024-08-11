import NavbarComponent from "../components/NavbarComponent";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarComponent />
      {children}
    </>
  );
}
