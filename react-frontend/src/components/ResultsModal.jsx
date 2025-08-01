import { Dialog, DialogContent, IconButton, Typography, Box, Card, Button } from '@mui/material'
import { Close, Assessment, DeleteSweep, ExpandMore, ExpandLess } from '@mui/icons-material'
import { useState } from 'react'

function ResultsModal({ open, onClose, results }) {
    const [viewMore, setViewMore] = useState(false)

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth 
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 6,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'white',
                    position: 'relative',
                    overflow: 'hidden',
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
                }
            }}>
            <Box sx={{
                p: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'relative'
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <Assessment sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Cleanup Summary
                    </Typography>
                </Box>
            </Box>
            <DialogContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#6366f1' }}>
                                {results?.metrics?.totalProcessed || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Emails Processed</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                                {results?.metrics?.deletedCount || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Auto-Deleted</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                                {((results?.metrics?.processingTimeMs || 0) / 1000).toFixed(2)}s
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Processing Time</Typography>
                        </Box>
                    </Box>

                    {/* Summary Message */}
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        {results?.summary}
                    </Typography>
                </Box>

                {/* Email Details Sections */}
                {results?.emails?.deleted && results.emails.deleted.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>     
                            <DeleteSweep sx={{ fontSize: 20 }} />
                            Successfully Deleted Emails ({results.emails.deleted.length})
                        </Typography>
                        <Card sx={{ p: 2, backgroundColor: '#fafafa', border: '1px solid #e5e7eb', borderLeft: '4px solid #10b981' }}>
                            {(viewMore == true ? results.emails.deleted : results.emails.deleted.slice(0, 3)).map((email, index) => (
                                <Box key={index} sx={{ py: 1, borderBottom: index < (viewMore ? results.emails.deleted.length - 1 : 2) ? '1px solid #e5e7eb' : 'none' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {email.subject}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        From: {email.from}
                                    </Typography>
                                </Box>
                            ))}
                            {results.emails.deleted.length > 3 && (
                                <Button 
                                    onClick={() => {
                                        setViewMore(!viewMore)
                                    }}
                                    size="small" 
                                    sx={{ mt: 1, textTransform: 'none', color: '#10b981', '&:focus': { outline: 'none' } }}
                                    endIcon={viewMore == true ? <ExpandLess /> : <ExpandMore />}
                                >
                                    {viewMore == true ? 'Show Less' : 'Show More'}
                                </Button>
                            )}
                        </Card>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ResultsModal