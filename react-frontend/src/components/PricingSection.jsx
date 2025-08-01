import { Box, Typography, Container, Paper, Grid, Button, Chip, Divider } from '@mui/material'
import { CheckCircle, Star, RocketLaunchOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function PricingSection() {
    const navigate = useNavigate()

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            popular: false,
            features: [
                "100 emails cleaned per month",
                "All email providers supported",
                "No email data stored",
                "Basic support",
                "Real-time processing"
            ],
            buttonText: "Get Started Free",
            buttonVariant: "outlined"
        },
        {
            name: "Pro",
            price: "$3",
            period: "/month or $29/year",
            popular: true,
            features: [
                "Unlimited email cleaning",
                "All email providers supported",
                "No email data stored",
                "Priority support",
                "Real-time processing",
                "Coming: Multiple accounts"
            ],
            buttonText: "Start Pro Trial",
            buttonVariant: "contained"
        }
    ]

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
            backgroundColor: '#f8fafc',
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                        Simple, Fair Pricing
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                        Less than a coffee per month. Clean 10,000+ emails and save 20+ hours.
                    </Typography>
                    <Chip 
                        label="30-day money-back guarantee" 
                        color="success" 
                        variant="outlined"
                        sx={{ 
                            fontWeight: 600,
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            backgroundColor: 'rgba(16, 185, 129, 0.05)'
                        }}
                    />
                </Box>

                {/* Pricing Cards */}
                <Grid container spacing={4} justifyContent="center">
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={5} key={index}>
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    background: plan.popular 
                                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                    border: plan.popular 
                                        ? '2px solid #6366f1' 
                                        : '1px solid rgba(99, 102, 241, 0.1)',
                                    boxShadow: plan.popular 
                                        ? '0 20px 60px rgba(99, 102, 241, 0.15)'
                                        : '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    position: 'relative',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: plan.popular 
                                            ? '0 24px 72px rgba(99, 102, 241, 0.2)'
                                            : '0 16px 48px rgba(0, 0, 0, 0.12)'
                                    }
                                }}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <Chip
                                        icon={<Star />}
                                        label="Most Popular"
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontWeight: 700,
                                            backgroundColor: '#6366f1',
                                            color: 'white',
                                            '& .MuiSvgIcon-root': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                )}

                                {/* Plan Header */}
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 700,
                                            mb: 1,
                                            color: plan.popular ? '#6366f1' : 'text.primary'
                                        }}
                                    >
                                        {plan.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
                                        <Typography 
                                            variant="h2" 
                                            sx={{ 
                                                fontWeight: 800,
                                                color: plan.popular ? '#6366f1' : 'text.primary'
                                            }}
                                        >
                                            {plan.price}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {plan.period}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 4, opacity: 0.3 }} />

                                {/* Features List */}
                                <Box sx={{ mb: 4 }}>
                                    {plan.features.map((feature, featureIndex) => (
                                        <Box 
                                            key={featureIndex}
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 2, 
                                                mb: 2
                                            }}
                                        >
                                            <CheckCircle sx={{ 
                                                color: '#10b981', 
                                                fontSize: 20,
                                                flexShrink: 0
                                            }} />
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: 'text.primary',
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* CTA Button */}
                                <Button
                                    variant={plan.buttonVariant}
                                    size="large"
                                    fullWidth
                                    startIcon={<RocketLaunchOutlined />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        mt: 'auto',
                                        py: 2,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        ...(plan.buttonVariant === 'contained' ? {
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white',
                                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)'
                                            }
                                        } : {
                                            color: '#6366f1',
                                            borderColor: '#6366f1',
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderColor: '#5855eb',
                                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                                transform: 'translateY(-1px)'
                                            }
                                        })
                                    }}
                                >
                                    {plan.buttonText}
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom Info */}
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            '& .separator': {
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                backgroundColor: 'text.secondary',
                                opacity: 0.4
                            }
                        }}
                    >
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default PricingSection