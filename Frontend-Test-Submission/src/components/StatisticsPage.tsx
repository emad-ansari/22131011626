import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { ExpandMore, Link as LinkIcon, Analytics, Schedule, LocationOn } from "@mui/icons-material"

interface ClickData {
  timestamp: string
  source: string
  location: string
}

interface UrlStatistics {
  shortcode: string
  shortLink: string
  originalUrl: string
  createdAt: string
  expiresAt: string
  totalClicks: number
  clickData: ClickData[]
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<UrlStatistics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Mock API call - replace with actual backend integration
      // This would typically be: const response = await fetch('/api/shorturls/statistics')

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API response
      const mockStatistics: UrlStatistics[] = [
        {
          shortcode: "abc123",
          shortLink: "http://localhost:8080/abc123",
          originalUrl: "https://very-very-very-long-and-descriptive-subdomain.example.com/path/to/resource",
          createdAt: "2024-01-15T10:30:00Z",
          expiresAt: "2024-01-15T11:00:00Z",
          totalClicks: 15,
          clickData: [
            { timestamp: "2024-01-15T10:35:00Z", source: "direct", location: "New York, US" },
            { timestamp: "2024-01-15T10:40:00Z", source: "twitter.com", location: "London, UK" },
            { timestamp: "2024-01-15T10:45:00Z", source: "facebook.com", location: "Tokyo, JP" },
            { timestamp: "2024-01-15T10:50:00Z", source: "direct", location: "Berlin, DE" },
            { timestamp: "2024-01-15T10:55:00Z", source: "linkedin.com", location: "Sydney, AU" },
          ],
        },
        {
          shortcode: "def456",
          shortLink: "http://localhost:8080/def456",
          originalUrl: "https://another-example-domain.com/products/category/item",
          createdAt: "2024-01-15T09:15:00Z",
          expiresAt: "2024-01-15T10:15:00Z",
          totalClicks: 8,
          clickData: [
            { timestamp: "2024-01-15T09:20:00Z", source: "google.com", location: "California, US" },
            { timestamp: "2024-01-15T09:25:00Z", source: "direct", location: "Toronto, CA" },
            { timestamp: "2024-01-15T09:30:00Z", source: "reddit.com", location: "Mumbai, IN" },
          ],
        },
        {
          shortcode: "ghi789",
          shortLink: "http://localhost:8080/ghi789",
          originalUrl: "https://documentation-site.example.org/guides/getting-started",
          createdAt: "2024-01-15T08:00:00Z",
          expiresAt: "2024-01-15T09:00:00Z",
          totalClicks: 23,
          clickData: [
            { timestamp: "2024-01-15T08:05:00Z", source: "github.com", location: "San Francisco, US" },
            { timestamp: "2024-01-15T08:10:00Z", source: "stackoverflow.com", location: "Amsterdam, NL" },
            { timestamp: "2024-01-15T08:15:00Z", source: "direct", location: "Singapore, SG" },
            { timestamp: "2024-01-15T08:20:00Z", source: "hackernews.com", location: "Tel Aviv, IL" },
          ],
        },
      ]

      setStatistics(mockStatistics)
    } catch (err) {
      setError("Failed to fetch statistics. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading statistics...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View detailed analytics for all your shortened URLs including click counts, timestamps, and traffic sources.
      </Typography>

      {statistics.length === 0 ? (
        <Alert severity="info">No shortened URLs found. Create some URLs first to see statistics here.</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <LinkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total URLs</Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {statistics.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Analytics color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Clicks</Typography>
                </Box>
                <Typography variant="h3" color="secondary">
                  {statistics.reduce((sum, stat) => sum + stat.totalClicks, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Schedule color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active URLs</Typography>
                </Box>
                <Typography variant="h3" color="warning.main">
                  {statistics.filter((stat) => !isExpired(stat.expiresAt)).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Statistics */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Detailed Statistics
            </Typography>

            {statistics.map((stat) => (
              <Accordion key={stat.shortcode} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
                          {stat.shortLink}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.originalUrl.length > 60 ? stat.originalUrl.substring(0, 60) + "..." : stat.originalUrl}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip label={`${stat.totalClicks} clicks`} color="primary" size="small" />
                        <Chip
                          label={isExpired(stat.expiresAt) ? "Expired" : "Active"}
                          color={isExpired(stat.expiresAt) ? "error" : "success"}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        URL Information
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Original URL:
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                          {stat.originalUrl}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Short URL:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {stat.shortLink}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Created:
                        </Typography>
                        <Typography variant="body2">{formatDate(stat.createdAt)}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Expires:
                        </Typography>
                        <Typography variant="body2">{formatDate(stat.expiresAt)}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Click Details ({stat.clickData.length} recent clicks)
                      </Typography>

                      {stat.clickData.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {stat.clickData.slice(0, 10).map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography variant="body2">{formatDate(click.timestamp)}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={click.source} size="small" variant="outlined" />
                                  </TableCell>
                                  <TableCell>
                                    <Box display="flex" alignItems="center">
                                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                      <Typography variant="body2">{click.location}</Typography>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Alert severity="info" variant="outlined">
                          No clicks recorded yet
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
