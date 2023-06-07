"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="background">
      <div>
        <Header />
        <main>
          <div className="flex flex-col gap-10 p-6 w-4/5 text-white">
            <div className="flex flex-col gap-5 text-7xl">
              Welcome
              <span>
                To <span className=" text-cp-antique-white">ConfPlus</span>
              </span>
              <span className="text-3xl">
                Present your notable discoveries and inventions with us.
              </span>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
