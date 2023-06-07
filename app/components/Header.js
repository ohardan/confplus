"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.svg";
import { useState, useEffect } from "react";

export default function Header({ bgColor }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <header
      className={`flex flex-col lg:flex-row gap-6 items-center p-4 text-xl text-white ${bgColor}`}>
      <div className="flex justify-center lg:order-2 lg:basis-full">
        <Image
          src={logo}
          alt="ConfPlus Logo"
          className="w-[100px]"
        />
      </div>

      <nav className="flex gap-6 lg:order-1 lg:basis-full">
        <Link
          href="/"
          className="hover:underline">
          Home
        </Link>
        <Link
          href="/pages/schedule"
          className="hover:underline">
          Schedule
        </Link>
        <Link
          href="/pages/statistics"
          className="hover:underline">
          Statistics
        </Link>
        {user ? <UserLink userRole={user.role} /> : ""}
      </nav>

      <div className="flex gap-4 justify-end lg:order-3 lg:basis-full">
        <LoginBTN
          user={user}
          setUser={setUser}
        />
      </div>
    </header>
  );
}

function UserLink({ userRole }) {
  let page;
  switch (userRole) {
    case "author":
      page = "my-papers";
      break;
    case "reviewer":
      page = "my-papers";
      break;
    case "organizer":
      page = "schedule-editor";
      break;
    default:
      return "";
  }

  return (
    <Link
      href={`/pages/${page}`}
      className="hover:underline">
      {page
        .split("-")
        .map((word) => {
          return word[0].toUpperCase() + word.slice(1);
        })
        .join(" ")}
    </Link>
  );
}

function LoginBTN({ user, setUser }) {
  if (!user)
    return (
      <Link
        href="/login"
        className="my-btn">
        Login
      </Link>
    );

  return (
    <>
      <p>Hi {`${user.firstName} ${user.lastName}!`}</p>
      <Link
        href="/"
        onClick={() => {
          localStorage.removeItem("user");
          setUser(null);
        }}
        className="my-btn">
        Log Out
      </Link>
    </>
  );
}
