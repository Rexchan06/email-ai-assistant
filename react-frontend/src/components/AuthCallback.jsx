import { useEffect } from "react";
import { Box, CircularProgress, Typography } from '@mui/material'

function AuthCallback() {
    useEffect(() => {
        const handleCallback = () => {
            const urlParams = new URLSearchParams(window.location.search)
            const token = urlParams.get('token')
            const name = urlParams.get('name')
            const email = urlParams.get('email')
            const error = urlParams.get('message')

            if (error) {
                alert('Authentication failed: ' + error)
                window.location.href = '/'
                return
            }

            if (token && name && email) {
                localStorage.setItem('auth_token', token)
                localStorage.setItem('user_name', name)
                localStorage.setItem('user_email', email)

                window.location.href = '/dashboard'
            } else {
                alert('Authentication failed: Missing token or user data')
                window.location.href = '/'
            }
        }
                
        handleCallback()
        }, [])

        return (
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              gap: 2
          }}>
              <CircularProgress size={40} />
              <Typography variant="h6" color="text.secondary">
                  Completing login...
              </Typography>
          </Box>
        )
}

export default AuthCallback