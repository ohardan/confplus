import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Layout({ children }) {
  return (
    <div className=" bg-cp-ghost-white flex flex-col justify-between min-h-screen">
      <Header bgColor="bg-cp-purple-bg" />
      {children}
      <Footer bgColor="bg-cp-purple-bg" />
    </div>
  );
}
