import { Box, ThemeProvider, createTheme } from '@mui/material'
import { CssBaseline } from '@mui/material'
import LandingHeader from '../components/LandingHeader'
import HeroSection from '../components/HeroSection'
import SocialProof from '../components/SocialProof'
import HowItWorks from '../components/HowItWorks'
import SpeedComparison from '../components/SpeedComparison'
import PrivacySection from '../components/PrivacySection'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'
import FinalCTA from '../components/FinalCTA'
import LandingFooter from '../components/LandingFooter'

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1',
            light: '#8b5cf6',
            dark: '#5855eb',
        },
        secondary: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        success: {
            main: '#10b981',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                },
            },
        },
    },
})

function LandingPage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                minHeight: '100vh',
                backgroundColor: 'background.default'
            }}>
                {/* Header */}
                <LandingHeader />
                
                {/* Hero Section */}
                <HeroSection />
                
                {/* Social Proof */}
                <SocialProof />
                
                {/* How It Works */}
                <HowItWorks />
                
                {/* Speed Comparison */}
                <SpeedComparison />
                
                {/* Privacy Section */}
                <PrivacySection />
                
                {/* Pricing */}
                <PricingSection />
                
                {/* FAQ */}
                <FAQSection />
                
                {/* Final CTA */}
                <FinalCTA />
                
                {/* Footer */}
                <LandingFooter />
            </Box>
        </ThemeProvider>
    )
}

export default LandingPage