import React from "react";
// Importing all created components
import NavbarTop from "./navbar";
import PopChat from "./popchat";
import WikiSideBar from "./sidebar";
// Pass the child props
export default function Layout({ children }) {
  return (
    <>
    <div>
      <NavbarTop />
      <WikiSideBar/>
    </div>
    <main>{children}</main>
    <PopChat /> {/* Attach if necessary */}
    </>
  );
}