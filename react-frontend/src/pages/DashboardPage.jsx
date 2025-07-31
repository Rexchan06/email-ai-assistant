import NavBar from "../components/NavBar";
import EmailProcessingForm from "../components/EmailProcessingForm";
import { Box } from '@mui/material'

function DashboardPage() {
    return (
        <Box>
            <NavBar />
            <Box sx={{ mt: 7 }}>
                <EmailProcessingForm />
            </Box>
        </Box>
    )
}

export default DashboardPage