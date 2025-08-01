import { Box, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { CheckCircle, Close, Star } from '@mui/icons-material'

function SpeedComparison() {
    const comparisonData = [
        {
            emails: '1,000 emails',
            emailAI: '2 min',
            cleanEmail: '15+ min',
            saneBox: '30+ min',
            manual: '5+ hours'
        },
        {
            emails: '10,000 emails',
            emailAI: '20 min',
            cleanEmail: '2+ hours',
            saneBox: '4+ hours',
            manual: '50+ hours'
        },
        {
            emails: 'Cost/month',
            emailAI: '$3',
            cleanEmail: '$10',
            saneBox: '$12',
            manual: 'Free*'
        }
    ]

    const getCellContent = (value, isEmailAI = false) => {
        if (value.includes('Free*')) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Free*
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        *your time
                    </Typography>
                </Box>
            )
        }

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEmailAI && <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: isEmailAI ? 700 : 500,
                        color: isEmailAI ? '#10b981' : 'text.primary'
                    }}
                >
                    {value}
                </Typography>
                {isEmailAI && <Star sx={{ color: '#fbbf24', fontSize: 16 }} />}
            </Box>
        )
    }

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
            backgroundColor: '#f8fafc',
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 2,
                            background: 'linear-gradient(135deg, #1f2937, #374151)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        Why EmailAI?
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ mb: 1, lineHeight: 1.6 }}
                    >
                        Why waste hours when you can clean your entire inbox over coffee?
                    </Typography>
                    <Chip 
                        label="Speed Comparison" 
                        color="primary" 
                        variant="outlined"
                        sx={{ 
                            fontWeight: 600,
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            backgroundColor: 'rgba(99, 102, 241, 0.05)'
                        }}
                    />
                </Box>

                {/* Comparison Table */}
                <Paper 
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    '& .MuiTableCell-head': {
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        border: 'none'
                                    }
                                }}>
                                    <TableCell></TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            EmailAI
                                            <Chip 
                                                label="Best" 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">Clean Email</TableCell>
                                    <TableCell align="center">SaneBox</TableCell>
                                    <TableCell align="center">Manual</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comparisonData.map((row, index) => (
                                    <TableRow 
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: 'rgba(99, 102, 241, 0.02)'
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                            },
                                            '& .MuiTableCell-body': {
                                                border: 'none',
                                                py: 2
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                            {row.emails}
                                        </TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                position: 'relative'
                                            }}
                                        >
                                            {getCellContent(row.emailAI, true)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getCellContent(row.cleanEmail)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getCellContent(row.saneBox)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getCellContent(row.manual)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Bottom Note */}
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
                    >
                        *Manual cleanup time assumes 5-10 seconds per email decision. 
                        Other tools' times based on typical batch processing speeds and user reports.
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default SpeedComparison