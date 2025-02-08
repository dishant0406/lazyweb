"use client";

import { Button } from "../Button";

//TODO: Implement theme switcher
export default function ThemeSwitcher() {
  const toggleTheme = () => {};

  const isDarkTheme = true;

  return (
    <Button
      tooltip={"Toggle theme"}
      className="group relative px-3"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-4 h-4">
        <svg
          className={`absolute top-0 left-0 transition-all duration-300 ease-in-out text-primary ${
            isDarkTheme ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <svg
          className={`absolute top-0 left-0 transition-all duration-300 ease-in-out text-primary ${
            isDarkTheme ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </div>
    </Button>
  );
}
