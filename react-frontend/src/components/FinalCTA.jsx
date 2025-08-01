import { Box, Typography, Container, Button } from '@mui/material'
import { RocketLaunchOutlined, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function FinalCTA() {
    const navigate = useNavigate()

    const guarantees = [
        "100 emails free",
        "No credit card required", 
        "2-minute setup"
    ]

    return (
        <Box sx={{
            py: { xs: 10, md: 16 },
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        }}>
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                    {/* Main Headline */}
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.1,
                            mb: 3,
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        Ready to reclaim your inbox?
                    </Typography>

                    {/* Subheadline */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            fontWeight: 400,
                            mb: 6,
                            opacity: 0.95,
                            lineHeight: 1.4
                        }}
                    >
                        Join 1000+ users who've cleaned millions of emails
                    </Typography>

                    {/* CTA Button */}
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<RocketLaunchOutlined />}
                        onClick={() => navigate('/login')}
                        sx={{
                            backgroundColor: 'white',
                            color: '#6366f1',
                            fontWeight: 800,
                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                            textTransform: 'none',
                            px: { xs: 4, md: 6 },
                            py: { xs: 2, md: 2.5 },
                            borderRadius: 4,
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            mb: 6,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                transform: 'translateY(-3px) scale(1.02)',
                                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.3)'
                            },
                            '&:active': {
                                transform: 'translateY(-1px) scale(1.01)'
                            }
                        }}
                    >
                        Start Cleaning Now - Free
                    </Button>

                    {/* Guarantees */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 4 },
                        opacity: 0.9
                    }}>
                        {guarantees.map((guarantee, index) => (
                            <Box 
                                key={index}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1
                                }}
                            >
                                <CheckCircle sx={{ 
                                    fontSize: 20,
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }} />
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: { xs: '0.95rem', md: '1rem' }
                                    }}
                                >
                                    ✅ {guarantee}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Bottom Stats */}
                    <Box sx={{ 
                        mt: 8,
                        pt: 6,
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 3, md: 8 },
                        opacity: 0.8
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                1000+
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Happy Users
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                2M+
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Emails Cleaned
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                2.3min
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Average Time
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default FinalCTA