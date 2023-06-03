import SideNav from "@/components/side-nav";

export default function GameLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="flex overflow-hidden px-4">
        <SideNav />
        {children}
      </div>
    </>
  );
}
