import SideNav from "@/components/side-nav";

export default function GameLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="container flex overflow-hidden">
        <SideNav />
        {children}
      </div>
    </>
  );
}
