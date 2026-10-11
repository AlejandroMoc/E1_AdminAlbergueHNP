// React
import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = ["green", "blue"];
const STORAGE_KEY = "theme";
const DEFAULT_THEME = "green";


function getInitialTheme() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (THEMES.includes(stored)) {
			return stored;
		}
	} catch {
	}
	return DEFAULT_THEME;
}

const ThemeContext = createContext({
	theme: DEFAULT_THEME,
	setTheme: (_theme) => {},
});

export const ThemeProvider = ({ children }) => {

	// Theme constant
	const [theme, setThemeState] = useState(getInitialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
		}
	},
	
	// Dependencies array with "theme"
	// Each time setThemeState is called, useEffect is triggered
	[theme]);

	// Set theme
	function setTheme(next) {
		if (THEMES.includes(next)) {
			setThemeState(next);
		}
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
