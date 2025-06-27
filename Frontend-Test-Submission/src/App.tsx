import type React from "react"

import { useState } from "react"
import { Container, Box, AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import UrlShortenerPage from "./components/UrlShortenerPage"
import StatisticsPage from "./components/StatisticsPage"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

export default function App() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="URL Shortener tabs">
              <Tab label="Shorten URLs" />
              <Tab label="Statistics" />
            </Tabs>
          </Box>

          {currentTab === 0 && <UrlShortenerPage />}
          {currentTab === 1 && <StatisticsPage />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}
