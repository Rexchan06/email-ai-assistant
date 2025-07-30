import LoginBox from '../components/LoginBox'
import { Box } from '@mui/material'

function LoginPage() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'grey.50' }}>
            <LoginBox />
        </Box>
    )
}

export default LoginPage