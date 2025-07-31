import { Box, Button, Typography, Card, Chip } from '@mui/material'
import { AutoAwesome, Google, Security, Speed, SmartToy } from '@mui/icons-material'
import { getGoogleAuthUrl } from '../utils/api'
import { useState } from 'react'

import logo from '../assets/logo.png'

function LoginBox() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true)
            const { url } = await getGoogleAuthUrl()
            window.location.href = url
        } catch (error) {
            console.error('Login failed:', error)
            alert('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card sx={{
            p: 6,
            maxWidth: 480,
            mx: 'auto',
            borderRadius: 6,
            boxShadow: '0 25px 80px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            background: `linear-gradient(135deg, 
                rgba(99, 102, 241, 0.05) 0%, 
                rgba(139, 92, 246, 0.05) 50%, 
                rgba(16, 185, 129, 0.05) 100%)`,
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)',
                borderRadius: '6px 6px 0 0'
            }
        }}>
            
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                    position: 'relative',
                    display: 'inline-block',
                    mb: 3,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -8,
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        opacity: 0.1,
                        animation: 'pulse 3s infinite'
                    }
                }}>
                    <img 
                        src={logo} 
                        alt="Email AI Assistant" 
                        style={{ 
                            width: 64, 
                            height: 64, 
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                        }} 
                    />
                </Box>
                
                <Typography variant='h3' sx={{ 
                    mb: 2, 
                    fontWeight: 800,
                    fontSize: '2.2rem',
                    lineHeight: 1.2
                }}>
                    Email<Box component="span" sx={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #10b981)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                            borderRadius: 2,
                            opacity: 0.4
                        }
                    }}>AI</Box>
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                    <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant='h6' sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                    }}>
                        Clean your inbox with AI
                    </Typography>
                </Box>
            </Box>

            {/* Features Section */}
            <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<SmartToy />}
                        label="AI Powered"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            fontWeight: 600
                        }}
                    />
                    <Chip
                        icon={<Speed />}
                        label="Fast Processing"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            color: '#8b5cf6',
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                            fontWeight: 600
                        }}
                    />
                    <Chip
                        icon={<Security />}
                        label="Secure"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            fontWeight: 600
                        }}
                    />
                </Box>
                
                <Typography variant='body1' sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: 380,
                    mx: 'auto'
                }}>
                    Automatically categorize and clean unnecessary emails using Google's advanced Gemini AI technology
                </Typography>
            </Box>

            {/* Login Button */}
            <Button
                variant='contained'
                size='large' 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                sx={{
                    mx: 'auto',
                    px: 6,
                    py: 2.5,
                    borderRadius: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    background: '#4285f4',
                    boxShadow: '0 8px 32px rgba(66, 133, 244, 0.4)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(66, 133, 244, 0.5)',
                        background: '#3367d6'
                    }
                }}
            >
                <Google sx={{ fontSize: 24 }} />
                {isLoading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            {/* Security Notice */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1,
                p: 2,
                borderRadius: 3,
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <Security sx={{ color: '#10b981', fontSize: 18 }} />
                <Typography variant='caption' sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500
                }}>
                    Your data is encrypted and secure. We never store your emails.
                </Typography>
            </Box>
        </Card>
    )
}

export default LoginBox