export type Theme = "dark" | "light";

export function setTheme(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.error("Failed to save theme", e);
  }
}

export function getStoredTheme(): Theme {
  try {
    const theme = localStorage.getItem("theme") as Theme;
    return theme === "light" || theme === "dark" ? theme : "dark";
  } catch (e) {
    return "dark";
  }
}
