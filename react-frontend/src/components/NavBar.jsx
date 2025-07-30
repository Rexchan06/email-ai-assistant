import { Box, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Logout } from '@mui/icons-material'
import logo from '../assets/logo.png'
import { useState, useEffect } from 'react'

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Not authenticated')
            }})
        .then(data => {
                setUserName(data.name) 
        })
        .catch(error => {
            console.error('Error fetching user:', error)
            window.location.href = '/login'
        })
    }, [])

    const userNameFirstLetter = userName.charAt(0).toUpperCase()

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', boxShadow: 1, borderBottom: '1px solid rgba(0,0,0,0.1)', py: 2, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <img src={logo} alt="Email AI Assistant" style={{ width: 40, height: 40, marginRight: 8 }} />
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Email<Box component="span" sx={{
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                    }}>AI</Box>  
                    </Typography>
                </Box>
                <IconButton 
                    sx={{ 
                        mr: 2, 
                        '&:focus': {
                        outline: 'none'
                        },
                        '&.Mui-focusVisible': {
                        backgroundColor: 'transparent'
                        } 
                    }} 
                    onClick={(event) => {
                    setAnchorEl(event.currentTarget)
                    setIsMenuOpen(true)
                    }}
                >
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main', color: 'white' }}>{userNameFirstLetter}</Avatar>
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={() => {
                    setAnchorEl(null)
                    setIsMenuOpen(false)
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 3,
                        minWidth: 140,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        mt: 3
                    },
                    '& .MuiList-root': {
                        padding: 0
                    }
                }}
            >
                <MenuItem 
                    onClick={() => window.location.href = '/login'}
                    sx={{
                        py: 1.5,
                        px: 2,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'error.main',
                        '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white'
                        }
                    }}
                >
                    Logout <Logout sx={{ pl: 1 }}></Logout>
                </MenuItem>
            </Menu>
        </>
    )
}

export default NavBar