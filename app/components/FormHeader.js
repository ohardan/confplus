import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.svg";

export default function FormHeader({ bgColor }) {
  return (
    <div
      className={`flex justify-between w-full gap-4 text-white text-xl items-center p-4 ${bgColor}`}>
      <Image
        src={logo}
        alt="ConfPlus Logo"
        className="w-[75px]"
      />
      <Link
        href="/"
        className="hover:underline">
        Home
      </Link>
    </div>
  );
}
