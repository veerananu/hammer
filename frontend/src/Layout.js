import React from "react";
import Content from "./content";
// Importing all created components
import AuiHeader from "./header";
import PopChat from "./popchat";
import WikiSideBar from "./sidebar";
import NavbarTop from "./navbar";
// Pass the child props
export default function Layout({ children }) {
  return (
    <>
    <WikiSideBar/>
    <NavbarTop/>
    <Content/>
    <PopChat />
    </>
  );
}