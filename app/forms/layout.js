import FormHeader from "@/app/components/FormHeader";
import Footer from "@/app/components/Footer";

export default function Layout({ children }) {
  return (
    <div className=" bg-gradient-to-tr from-cp-periwinkle to-cp-apricot flex flex-col justify-between min-h-screen">
      <FormHeader bgColor="bg-cp-purple-bg" />
      {children}
      <Footer bgColor="bg-cp-purple-bg" />
    </div>
  );
}
