import { Box, Typography, Container, Link, Divider, IconButton } from '@mui/material'
import { Twitter, Email, GitHub, Favorite } from '@mui/icons-material'

function LandingFooter() {
    const footerLinks = [
        { label: 'About', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Contact', href: '#' }
    ]

    const socialLinks = [
        { icon: <Twitter />, href: '#', label: 'Twitter' },
        { icon: <Email />, href: 'mailto:contact@emailai.com', label: 'Email' },
        { icon: <GitHub />, href: '#', label: 'GitHub' }
    ]

    return (
        <Box sx={{
            backgroundColor: '#1f2937',
            color: 'white',
            py: { xs: 6, md: 8 }
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: 4,
                    mb: 6
                }}>
                    {/* Left Side - Brand */}
                    <Box sx={{ 
                        textAlign: { xs: 'center', md: 'left' },
                        maxWidth: { md: 400 }
                    }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                gap: 1
                            }}
                        >
                            Email<Box component="span" sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #10b981)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}>AI</Box>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    ml: 2,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 400
                                }}
                            >
                                Made in 🇲🇾 Malaysia
                            </Typography>
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: 1.6,
                                mb: 3,
                                fontStyle: 'italic'
                            }}
                        >
                            "Built by a guy who was tired of email chaos"
                        </Typography>
                        
                        {/* Social Links */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 1,
                            justifyContent: { xs: 'center', md: 'flex-start' }
                        }}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'rgba(99, 102, 241, 0.3)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Side - Links */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 4 },
                        alignItems: 'center'
                    }}>
                        {footerLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: 'white',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    mb: 4
                }} />

                {/* Bottom Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: { xs: 'center', sm: 'left' }
                }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.875rem'
                        }}
                    >
                        © 2024 EmailAI. All rights reserved.
                    </Typography>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            Made with
                        </Typography>
                        <Favorite sx={{ 
                            fontSize: 16, 
                            color: '#ef4444',
                            animation: 'heartbeat 2s infinite'
                        }} />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            for email sanity
                        </Typography>
                    </Box>
                </Box>
            </Container>

            {/* Keyframes for heart animation */}
            <style jsx>{`
                @keyframes heartbeat {
                    0%, 50%, 100% { transform: scale(1); }
                    25%, 75% { transform: scale(1.1); }
                }
            `}</style>
        </Box>
    )
}

export default LandingFooter