import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Chip,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material"
import { Add, Remove, Link as LinkIcon, Schedule, Code } from "@mui/icons-material"

interface UrlForm {
  id: number
  originalUrl: string
  validity: string
  shortcode: string
  errors: {
    originalUrl?: string
    validity?: string
    shortcode?: string
  }
}

interface ShortenedUrl {
  id: number
  originalUrl: string
  shortLink: string
  expiry: string
}

export default function UrlShortenerPage() {
  const [urlForms, setUrlForms] = useState<UrlForm[]>([
    { id: 1, originalUrl: "", validity: "", shortcode: "", errors: {} },
  ])
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateForm = (form: UrlForm): boolean => {
    const errors: UrlForm["errors"] = {}
    let isValid = true

    // Validate URL
    if (!form.originalUrl.trim()) {
      errors.originalUrl = "URL is required"
      isValid = false
    } else if (!validateUrl(form.originalUrl)) {
      errors.originalUrl = "Please enter a valid URL"
      isValid = false
    }

    // Validate validity (optional, but if provided must be positive integer)
    if (form.validity && (!Number.isInteger(Number(form.validity)) || Number(form.validity) <= 0)) {
      errors.validity = "Validity must be a positive integer (minutes)"
      isValid = false
    }

    // Validate shortcode (optional, but if provided must be alphanumeric)
    if (form.shortcode && !/^[a-zA-Z0-9]+$/.test(form.shortcode)) {
      errors.shortcode = "Shortcode must be alphanumeric"
      isValid = false
    }

    // Update form with errors
    setUrlForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, errors } : f)))

    return isValid
  }

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      const newId = Math.max(...urlForms.map((f) => f.id)) + 1
      setUrlForms((prev) => [...prev, { id: newId, originalUrl: "", validity: "", shortcode: "", errors: {} }])
    }
  }

  const removeUrlForm = (id: number) => {
    if (urlForms.length > 1) {
      setUrlForms((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const updateUrlForm = (id: number, field: keyof UrlForm, value: string) => {
    setUrlForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value, errors: { ...f.errors, [field]: undefined } } : f)),
    )
  }

  const handleSubmit = async () => {
    setGlobalError("")

    // Validate all forms
    const validForms = urlForms.filter((form) => form.originalUrl.trim())
    if (validForms.length === 0) {
      setGlobalError("Please enter at least one URL to shorten")
      return
    }

    const allValid = validForms.every(validateForm)
    if (!allValid) {
      setGlobalError("Please fix the validation errors before submitting")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API calls to backend
      const results: ShortenedUrl[] = []

      for (const form of validForms) {
        // Mock API call - replace with actual backend integration
        const mockResponse = {
          shortLink: `http://localhost:8080/${form.shortcode || "abc" + Math.random().toString(36).substr(2, 5)}`,
          expiry: new Date(Date.now() + (Number(form.validity) || 30) * 60000).toISOString(),
        }

        results.push({
          id: form.id,
          originalUrl: form.originalUrl,
          shortLink: mockResponse.shortLink,
          expiry: mockResponse.expiry,
        })
      }

      setShortenedUrls(results)

      // Reset forms
      setUrlForms([{ id: 1, originalUrl: "", validity: "", shortcode: "", errors: {} }])
    } catch (error) {
      setGlobalError("Failed to shorten URLs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Shorten up to 5 URLs concurrently. Provide the original URL and optionally set a validity period and custom
        shortcode.
      </Typography>

      {globalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {globalError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">URLs to Shorten ({urlForms.length}/5)</Typography>
                <Button
                  startIcon={<Add />}
                  onClick={addUrlForm}
                  disabled={urlForms.length >= 5}
                  variant="outlined"
                  size="small"
                >
                  Add URL
                </Button>
              </Box>

              {urlForms.map((form, index) => (
                <Box key={form.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      URL #{index + 1}
                    </Typography>
                    {urlForms.length > 1 && (
                      <IconButton onClick={() => removeUrlForm(form.id)} size="small" color="error">
                        <Remove />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Original URL"
                        placeholder="https://example.com/very-long-url"
                        value={form.originalUrl}
                        onChange={(e) => updateUrlForm(form.id, "originalUrl", e.target.value)}
                        error={!!form.errors.originalUrl}
                        helperText={form.errors.originalUrl}
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Validity (minutes)"
                        placeholder="30"
                        type="number"
                        value={form.validity}
                        onChange={(e) => updateUrlForm(form.id, "validity", e.target.value)}
                        error={!!form.errors.validity}
                        helperText={form.errors.validity || "Default: 30 minutes"}
                        InputProps={{
                          startAdornment: <Schedule sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Custom Shortcode (optional)"
                        placeholder="mycode123"
                        value={form.shortcode}
                        onChange={(e) => updateUrlForm(form.id, "shortcode", e.target.value)}
                        error={!!form.errors.shortcode}
                        helperText={form.errors.shortcode || "Alphanumeric only"}
                        InputProps={{
                          startAdornment: <Code sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  {index < urlForms.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {isLoading ? "Shortening URLs..." : "Shorten URLs"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Collapse in={shortenedUrls.length > 0}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shortened URLs
                </Typography>

                {shortenedUrls.map((url) => (
                  <Box key={url.id} sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original:{" "}
                      {url.originalUrl.length > 40 ? url.originalUrl.substring(0, 40) + "..." : url.originalUrl}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", flexGrow: 1 }}>
                        {url.shortLink}
                      </Typography>
                      <Button size="small" onClick={() => navigator.clipboard.writeText(url.shortLink)}>
                        Copy
                      </Button>
                    </Box>

                    <Chip
                      label={`Expires: ${new Date(url.expiry).toLocaleString()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  )
}
