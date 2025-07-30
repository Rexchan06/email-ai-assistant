import { Box, Button, Typography } from '@mui/material'
import googleIcon from '../assets/google.svg.png'

function LoginBox() {
    return (
        <Box sx={{ borderRadius: 2, p: 8, boxShadow: 2, maxWidth: 400, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Email AI Assistant
            </Typography>
            <Typography variant='h6' sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                Clean your inbox with AI
            </Typography>
            <Button
                variant='contained'
                size='large' 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                sx={{ my: 4, px: 4, py: 2 }}
            >
                Login with Google
                <img src={googleIcon} alt="Google Icon" style={{ width: 20, height: 20, marginLeft: 8 }} />
            </Button>
            <Typography variant='body2' sx={{ mt: 1, textAlign: 'center', color: 'text.secondary'}}>
                Automatically categorize and clean unnecessary emails using Google's Gemini AI
            </Typography>
        </Box>
    )
}

export default LoginBox