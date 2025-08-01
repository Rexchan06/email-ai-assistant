import { Box, Typography, Container, Paper, Avatar, Chip } from '@mui/material'
import { FormatQuote, Email, Speed, Flag } from '@mui/icons-material'

function SocialProof() {
    const testimonials = [
        {
            quote: "I cleaned 2,847 promotional emails in 3 minutes. Mind = blown 🤯",
            author: "Sarah K.",
            role: "Marketing Manager",
            avatar: "S"
        },
        {
            quote: "Finally, an email tool that actually works fast",
            author: "Ahmad R.",
            role: "Software Developer", 
            avatar: "A"
        }
    ]

    const stats = [
        {
            icon: <Email sx={{ fontSize: 24, color: '#6366f1' }} />,
            value: "12,847",
            label: "emails cleaned"
        },
        {
            icon: <Speed sx={{ fontSize: 24, color: '#8b5cf6' }} />,
            value: "2.3 minutes",
            label: "average time"
        },
        {
            icon: <Flag sx={{ fontSize: 24, color: '#10b981' }} />,
            value: "🇲🇾 Malaysia",
            label: "made with love"
        }
    ]

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            py: { xs: 6, md: 8 },
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
            <Container maxWidth="lg">
                {/* Testimonials */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    mb: 6,
                    justifyContent: 'center'
                }}>
                    {testimonials.map((testimonial, index) => (
                        <Paper 
                            key={index}
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                                position: 'relative',
                                maxWidth: 400,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <FormatQuote sx={{ 
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                color: '#6366f1',
                                opacity: 0.3,
                                fontSize: 32
                            }} />
                            
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontStyle: 'italic',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.6,
                                    mb: 3,
                                    mt: 2,
                                    color: 'text.primary'
                                }}
                            >
                                "{testimonial.quote}"
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ 
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    fontWeight: 600,
                                    width: 40,
                                    height: 40
                                }}>
                                    {testimonial.avatar}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {testimonial.author}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {testimonial.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Stats Bar */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 3, sm: 6 },
                    py: 3
                }}>
                    {stats.map((stat, index) => (
                        <Chip
                            key={index}
                            icon={stat.icon}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            }
                            variant="outlined"
                            sx={{
                                px: 2,
                                py: 1,
                                height: 'auto',
                                borderRadius: 3,
                                borderColor: 'rgba(99, 102, 241, 0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '& .MuiChip-label': {
                                    px: 1
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                    borderColor: 'rgba(99, 102, 241, 0.3)'
                                }
                            }}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    )
}

export default SocialProof