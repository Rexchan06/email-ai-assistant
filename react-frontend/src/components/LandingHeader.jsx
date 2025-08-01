import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material'
import { AutoAwesome } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function LandingHeader() {
    const navigate = useNavigate()

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Box sx={{ 
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -2,
                            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                            borderRadius: '50%',
                            opacity: 0.1,
                            animation: 'pulse 2s infinite'
                        }
                    }}>
                        <img 
                            src={logo} 
                            alt="EmailAI" 
                            style={{ 
                                width: 44, 
                                height: 44, 
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        />
                    </Box>
                    <Box>
                        <Typography 
                            variant='h5' 
                            sx={{ 
                                color: 'black',
                                fontWeight: 700,
                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                                lineHeight: 1.2,
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        >
                            Email<Box component="span" sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #10b981)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -2,
                                    left: 0,
                                    right: 0,
                                    height: 2,
                                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                    borderRadius: 1,
                                    opacity: 0.3
                                }
                            }}>AI</Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center', 
                            gap: 0.5,
                            fontWeight: 500
                        }}>
                            <AutoAwesome sx={{ fontSize: 12 }} />
                            Intelligent Email Management
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                color: '#6366f1'
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)'
                            }
                        }}
                    >
                        Try Free
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default LandingHeader