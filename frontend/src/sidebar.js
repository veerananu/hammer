import React from "react";
import {Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import './header.css'
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
function WikiSideBar() {
  return (
    <div>
      <Sidebar>
        <Menu>
          <MenuItem icon={<HomeOutlinedIcon />}></MenuItem>
          <MenuItem icon={<PeopleOutlinedIcon />}></MenuItem>
          <MenuItem icon={<ContactsOutlinedIcon />}></MenuItem>
          <MenuItem icon={<ReceiptOutlinedIcon />}></MenuItem>
          <MenuItem icon={<HelpOutlineOutlinedIcon />}></MenuItem>
          <MenuItem icon={<CalendarTodayOutlinedIcon />}></MenuItem>
        </Menu>
        </Sidebar> 
      </div>
  );
}

export default WikiSideBar;