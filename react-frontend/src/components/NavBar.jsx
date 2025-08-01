import { Box, Typography, IconButton, Avatar, Menu, MenuItem, Chip } from '@mui/material'
import { Logout, AutoAwesome, Person } from '@mui/icons-material'
import logo from '../assets/logo.png'
import { useState, useEffect } from 'react'
import { logout } from '../utils/api'

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('auth_token')
        const storedUserName = localStorage.getItem('user_name')
        
        if (!token) {
            window.location.href = '/login'
            return
        }

        if (storedUserName) {
            setUserName(storedUserName)
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Not authenticated')
            }})
        .then(data => {
                setUserName(data.name) 
                localStorage.setItem('user_name', data.name)
        })
        .catch(error => {
            console.error('Error fetching user:', error)
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_name')
            localStorage.removeItem('user_email')
            window.location.href = '/login'
        })
    }, [])

    const userNameFirstLetter = userName.charAt(0).toUpperCase()

    return (
        <>
            <Box sx={{ 
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backdropFilter: 'blur(20px)',
                background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%, 
                    rgba(255, 255, 255, 0.9) 100%)`,
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                py: 2.5, 
                px: 4,
                transition: 'all 0.3s ease'
            }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                            alt="Email AI Assistant" 
                            style={{ 
                                width: 44, 
                                height: 44, 
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }} 
                        />
                    </Box>
                    <Box>
                        <Typography variant='h5' sx={{ 
                            fontWeight: 700,
                            fontSize: '1.5rem',
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
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            fontWeight: 500
                        }}>
                            <AutoAwesome sx={{ fontSize: 12 }} />
                            Intelligent Email Management
                        </Typography>
                    </Box>
                </Box>

                {/* User Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {userName && (
                        <Chip
                            icon={<Person />}
                            label={userName}
                            variant="outlined"
                            sx={{
                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                color: 'text.primary',
                                fontWeight: 600,
                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    borderColor: 'rgba(99, 102, 241, 0.5)'
                                }
                            }}
                        />
                    )}
                    <IconButton 
                        sx={{ 
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                '& .MuiAvatar-root': {
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                                }
                            },
                            '&:focus': {
                                outline: 'none'
                            }
                        }} 
                        onClick={(event) => {
                            setAnchorEl(event.currentTarget)
                            setIsMenuOpen(true)
                        }}
                    >
                        <Avatar sx={{ 
                            width: 44, 
                            height: 44, 
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            border: '3px solid rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                        }}>
                            {userNameFirstLetter}
                        </Avatar>
                    </IconButton>
                </Box>
            </Box>

            {/* Enhanced Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={() => {
                    setAnchorEl(null)
                    setIsMenuOpen(false)
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    mt: 1.5,
                    '& .MuiPaper-root': {
                        borderRadius: 4,
                        minWidth: 180,
                        background: `linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.95) 0%, 
                            rgba(255, 255, 255, 0.9) 100%)`,
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden'
                    },
                    '& .MuiList-root': {
                        padding: 1
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                        {userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Account Settings
                    </Typography>
                </Box>
                
                <MenuItem 
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem('auth_token')
                            if (token) {
                                await logout(token)
                            }
                        } catch (error) {
                            console.error('Logout error:', error)
                        } finally {
                            localStorage.removeItem('auth_token')
                            localStorage.removeItem('user_name')
                            localStorage.removeItem('user_email')
                            window.location.href = '/login'
                        }
                    }}
                    sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 2,
                        py: 1.5,
                        px: 2,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            transform: 'translateX(2px)'
                        }
                    }}
                >
                    <Logout sx={{ fontSize: 18 }} />
                    Sign Out
                </MenuItem>
            </Menu>
        </>
    )
}

export default NavBar