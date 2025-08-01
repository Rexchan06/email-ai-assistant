import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material'
import { RocketLaunchOutlined, PlayArrow, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
    const navigate = useNavigate()

    const valueProps = [
        'Process 1000+ emails in under 2 minutes',
        'Clean by date, category, confidence level',
        'Gmail, Outlook, Yahoo supported', 
        'Zero email data stored on our servers'
    ]

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Left Side - Content */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            {/* Headline */}
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                Clean 1000 Emails in 
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    display: 'block'
                                }}>
                                    2 Minutes
                                </Box>
                            </Typography>

                            {/* Subheadline */}
                            <Typography 
                                variant="h5" 
                                color="text.secondary"
                                sx={{ 
                                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                    mb: 4,
                                    maxWidth: { md: '90%' }
                                }}
                            >
                                The fastest email cleanup tool ever built. Choose by date, 
                                category, and confidence level. No email data stored.
                            </Typography>

                            {/* Value Props */}
                            <Box sx={{ mb: 5 }}>
                                {valueProps.map((prop, index) => (
                                    <Box key={index} sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2, 
                                        mb: 2,
                                        justifyContent: { xs: 'center', md: 'flex-start' }
                                    }}>
                                        <CheckCircle sx={{ 
                                            color: '#10b981', 
                                            fontSize: 24,
                                            flexShrink: 0
                                        }} />
                                        <Typography variant="body1" sx={{ 
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}>
                                            {prop}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* CTA Buttons */}
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 3, 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', md: 'flex-start' }
                            }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<RocketLaunchOutlined />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        px: 4,
                                        py: 2,
                                        borderRadius: 4,
                                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)'
                                        }
                                    }}
                                >
                                    Clean My Inbox Free
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<PlayArrow />}
                                    sx={{
                                        color: '#6366f1',
                                        borderColor: '#6366f1',
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        px: 3,
                                        py: 2,
                                        borderRadius: 4,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: '#5855eb',
                                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Watch 60s Demo
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Side - Screenshot/Visual */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* Placeholder for screenshot - will be replaced with actual image */}
                            <Box sx={{
                                width: '100%',
                                maxWidth: 500,
                                aspectRatio: '4/3',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                borderRadius: 6,
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 3,
                                p: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)'
                                }
                            }}>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    color: '#10b981'
                                }}>
                                    1000 emails cleaned
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    color: 'text.secondary'
                                }}>
                                    in 2:15 seconds
                                </Typography>
                                <Chip 
                                    label="✨ Results Preview" 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ 
                                        fontWeight: 600,
                                        borderColor: 'rgba(99, 102, 241, 0.3)',
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default HeroSection