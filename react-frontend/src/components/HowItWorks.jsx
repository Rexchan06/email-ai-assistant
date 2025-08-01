import { Box, Typography, Container, Paper, Avatar } from '@mui/material'
import { Google, Settings, RocketLaunchOutlined, ArrowForward } from '@mui/icons-material'

function HowItWorks() {
    const steps = [
        {
            number: 1,
            icon: <Google sx={{ fontSize: 32, color: 'white' }} />,
            title: "Connect Your Email",
            description: "Secure OAuth login - we never store your emails",
            color: '#6366f1'
        },
        {
            number: 2,
            icon: <Settings sx={{ fontSize: 32, color: 'white' }} />,
            title: "Choose What to Clean",
            description: "Pick date range, categories, confidence level",
            color: '#8b5cf6'
        },
        {
            number: 3,
            icon: <RocketLaunchOutlined sx={{ fontSize: 32, color: 'white' }} />,
            title: "Watch the Magic",
            description: "1000+ emails cleaned in under 2 minutes",
            color: '#10b981'
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
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 2,
                            background: 'linear-gradient(135deg, #1f2937, #374151)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        How It Works
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
                    >
                        Clean your entire inbox in 3 simple steps
                    </Typography>
                </Box>

                {/* Steps */}
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: { xs: 4, md: 2 },
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <Box key={index} sx={{ 
                            display: 'flex',
                            flexDirection: { xs: 'row', md: 'column' },
                            alignItems: 'center',
                            flex: 1,
                            maxWidth: { xs: '100%', md: 300 },
                            position: 'relative'
                        }}>
                            {/* Step Card */}
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    textAlign: { xs: 'left', md: 'center' },
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    width: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                    }
                                }}
                            >
                                {/* Icon */}
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: { xs: 'row', md: 'column' },
                                    alignItems: 'center',
                                    gap: { xs: 3, md: 0 },
                                    mb: { xs: 0, md: 3 }
                                }}>
                                    <Avatar sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: step.color,
                                        mb: { xs: 0, md: 2 },
                                        boxShadow: `0 8px 24px ${step.color}40`,
                                        flexShrink: 0
                                    }}>
                                        {step.icon}
                                    </Avatar>

                                    <Box sx={{ 
                                        flex: 1,
                                        textAlign: { xs: 'left', md: 'center' }
                                    }}>
                                        {/* Step Number */}
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: step.color,
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                letterSpacing: 1
                                            }}
                                        >
                                            STEP {step.number}
                                        </Typography>

                                        {/* Title */}
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 700,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>

                                        {/* Description */}
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Arrow (Desktop only) */}
                            {index < steps.length - 1 && (
                                <ArrowForward sx={{
                                    display: { xs: 'none', md: 'block' },
                                    position: 'absolute',
                                    right: -24,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(99, 102, 241, 0.4)',
                                    fontSize: 32,
                                    zIndex: 1
                                }} />
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Bottom CTA */}
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                    >
                        Ready to experience the fastest email cleanup ever?
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default HowItWorks