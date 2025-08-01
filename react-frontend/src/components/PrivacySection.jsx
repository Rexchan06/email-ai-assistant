import { Box, Typography, Container, Paper, Grid, Chip } from '@mui/material'
import { Security, Verified, Shield, LockOutlined } from '@mui/icons-material'

function PrivacySection() {
    const privacyFeatures = [
        {
            icon: <LockOutlined sx={{ fontSize: 32, color: '#6366f1' }} />,
            title: "No email content stored",
            description: "We process emails in real-time and store absolutely nothing on our servers"
        },
        {
            icon: <Security sx={{ fontSize: 32, color: '#8b5cf6' }} />,
            title: "Secure OAuth 2.0",
            description: "Industry-standard authentication - we never see your password"
        },
        {
            icon: <Shield sx={{ fontSize: 32, color: '#10b981' }} />,
            title: "Real-time processing",
            description: "Everything happens instantly in your browser, nothing saved or cached"
        },
        {
            icon: <Verified sx={{ fontSize: 32, color: '#f59e0b' }} />,
            title: "Privacy by design",
            description: "Built by developers who care about your digital privacy"
        }
    ]

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)'
        }}>
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip 
                        icon={<Security />}
                        label="Your Privacy Matters" 
                        color="primary" 
                        variant="outlined"
                        sx={{ 
                            mb: 3,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            px: 2,
                            py: 1,
                            height: 'auto',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            backgroundColor: 'rgba(99, 102, 241, 0.05)'
                        }}
                    />
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 3,
                            background: 'linear-gradient(135deg, #1f2937, #374151)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        Your Privacy Matters
                    </Typography>
                    <Typography 
                        variant="h5" 
                        color="text.secondary"
                        sx={{ 
                            maxWidth: 600, 
                            mx: 'auto', 
                            lineHeight: 1.6,
                            fontWeight: 400,
                            fontStyle: 'italic'
                        }}
                    >
                        "We never read, store, or sell your email data. Ever."
                    </Typography>
                </Box>

                {/* Privacy Features Grid */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {privacyFeatures.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        flexShrink: 0
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 700,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Trust Banner */}
                <Paper 
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '2px solid rgba(16, 185, 129, 0.2)',
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Shield sx={{ fontSize: 32, color: '#10b981' }} />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#065f46'
                            }}
                        >
                            Privacy-First Promise
                        </Typography>
                    </Box>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#065f46',
                            lineHeight: 1.6,
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Unlike other email tools that store your data for "analysis" or "machine learning", 
                        EmailAI processes everything locally and in real-time. Your emails never leave your control.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    )
}

export default PrivacySection