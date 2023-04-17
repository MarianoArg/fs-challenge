import { useUser } from "~/utils";
import {
  Avatar,
  Divider,
  ListItemIcon,
  MenuItem,
  Menu,
  IconButton,
} from "@mui/material";
import { MdOutlineLogout } from "react-icons/md";
import React from "react";
import { Form } from "@remix-run/react";
import Logo from "~/assets/logo.svg";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useUser();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const userLetters = user.fullname.split(" ");
  return (
    <>
      <header className="flex items-center justify-between bg-darkBlueGrey p-4 text-white">
        <div className="flex items-center gap-4">
          <img src={Logo} className="w-10" alt="Simpledo Logo" />
          <h1 className="text-4xl font-extrabold text-white">SimpleDo</h1>
        </div>

        <div className="flex items-center justify-between gap-4">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 52, height: 52, bgcolor: "#96B1FF" }}
            >{`${userLetters[0][0]?.toUpperCase()}${userLetters[1][0]?.toUpperCase()}`}</Avatar>
          </IconButton>
        </div>
      </header>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ bgcolor: "#5A77E1" }} /> {user.fullname}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Form action="/logout" method="post">
            <button type="submit">
              <ListItemIcon>
                <MdOutlineLogout className="text-darkBlueGrey" />
              </ListItemIcon>
              Logout
            </button>
          </Form>
        </MenuItem>
      </Menu>
    </>
  );
}
