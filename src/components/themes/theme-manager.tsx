"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme(theme == "light" ? "dark" : "light");
    document.documentElement.setAttribute(
      "class",
      theme == "light" ? "dark" : "light",
    );
  };

  useEffect(() => {
    // Example: Set initial attribute on component mount
    document.documentElement.setAttribute("lang", "ar");
    document.documentElement.setAttribute("dir", "rtl");
  }, []);

  return (
    <div>
      <Button onClick={() => toggleTheme()} variant={"default"}>
        {theme == "light" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
