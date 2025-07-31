import { Typography, MenuItem, Select, Card, Slider, Button, FormControl, Box, CircularProgress, Chip } from '@mui/material'
import { CalendarToday, Category, TuneRounded, AutoAwesome } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { processEmails } from '../utils/api'

function EmailProcessingForm() {
    const [daysOld, setDaysOld] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedPreset, setSelectedPreset] = useState('30d')
    const [category, setCategory] = useState('')
    const [confidence, setConfidence] = useState(80)
    const [isSubmit, setIsSubmit] = useState(false)

    const handlePresetChange = (event, newPreset) => {
        if (newPreset !== null) {
            setSelectedPreset(newPreset)
            switch(newPreset) {
                case '7d':
                    setSelectedDate(dayjs().subtract(7, 'day'))
                    break
                case '30d':
                    setSelectedDate(dayjs().subtract(30, 'day'))
                    break
                case '90d':
                    setSelectedDate(dayjs().subtract(90, 'day'))
                    break
                default:
                    break
            }
        }
    }

    const handleSubmit = async () => {
        if (!selectedDate || !category) {
            alert('Please select a date and category')
            return
        }

        const token = localStorage.getItem('auth_token')
        if (!token) {
            alert('Authentication required. Please login again.')
            window.location.href = '/login'
            return
        }

        setIsSubmit(true)

        try {
            const results = await processEmails({
                daysOld: daysOld,
                category: category,
                confidence: confidence,
                token: token
            })

            alert(`Success! ${results.summaryMessage}`)
            console.log('Full results:', results)
        } catch (error) {
            alert(`Error: ${error.message}`)
        } finally {
            setIsSubmit(false)
        }
    }

    useEffect(() => {
        if (selectedDate) {
            setDaysOld(dayjs().diff(selectedDate, 'days'))
        }
    }, [selectedDate])


    return (
        <Card sx={{
            p: 5,
            maxWidth: 1000,
            mx: 'auto',
            borderRadius: 6,
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            background: `linear-gradient(135deg, 
                rgba(99, 102, 241, 0.05) 0%, 
                rgba(139, 92, 246, 0.05) 50%, 
                rgba(16, 185, 129, 0.05) 100%)`,
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
        }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <AutoAwesome sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Clean Your Inbox with Email
                        <Box component="span" sx={{
                            background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>AI</Box>
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Select criteria to automatically categorize and clean unnecessary emails using advanced AI
                </Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 4,
                    alignItems: 'end'
                }}>
                    
                    {/* Date Section */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CalendarToday sx={{ color: '#6366f1', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Time Range
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Clean emails older than:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button
                                variant={selectedPreset === '7d' ? 'contained' : 'outlined'}
                                size="small"
                                disabled={isSubmit}
                                onClick={() => handlePresetChange(null, '7d')}
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    transition: 'all 0.2s ease',
                                    border: '2px solid',
                                    borderColor: selectedPreset === '7d' ? '#6366f1' : 'divider',
                                    backgroundColor: selectedPreset === '7d' ? '#6366f1' : 'transparent',
                                    color: selectedPreset === '7d' ? 'white' : 'text.primary',
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        backgroundColor: selectedPreset === '7d' ? '#5855eb' : 'rgba(99, 102, 241, 0.04)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }
                                }}
                            >
                                7 days
                            </Button>
                            <Button
                                variant={selectedPreset === '30d' ? 'contained' : 'outlined'}
                                size="small"
                                disabled={isSubmit}
                                onClick={() => handlePresetChange(null, '30d')}
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    transition: 'all 0.2s ease',
                                    border: '2px solid',
                                    borderColor: selectedPreset === '30d' ? '#6366f1' : 'divider',
                                    backgroundColor: selectedPreset === '30d' ? '#6366f1' : 'transparent',
                                    color: selectedPreset === '30d' ? 'white' : 'text.primary',
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        backgroundColor: selectedPreset === '30d' ? '#5855eb' : 'rgba(99, 102, 241, 0.04)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }
                                }}
                            >
                                30 days
                            </Button>
                            <Button
                                variant={selectedPreset === '90d' ? 'contained' : 'outlined'}
                                size="small"
                                disabled={isSubmit}
                                onClick={() => handlePresetChange(null, '90d')}
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    transition: 'all 0.2s ease',
                                    border: '2px solid',
                                    borderColor: selectedPreset === '90d' ? '#6366f1' : 'divider',
                                    backgroundColor: selectedPreset === '90d' ? '#6366f1' : 'transparent',
                                    color: selectedPreset === '90d' ? 'white' : 'text.primary',
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        backgroundColor: selectedPreset === '90d' ? '#5855eb' : 'rgba(99, 102, 241, 0.04)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }
                                }}
                            >
                                90 days
                            </Button>
                        </Box>
                        
                        <DatePicker
                            disabled={isSubmit}
                            value={selectedDate}
                            onChange={(newDate) => {
                                setSelectedDate(newDate)
                                setSelectedPreset('')
                            }}
                            label="Or pick custom date"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main'
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Category Section */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Category sx={{ color: '#8b5cf6', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Email Type
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Target category to clean:
                        </Typography>
                        
                        <FormControl fullWidth>
                            <Select
                                disabled={isSubmit}
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                displayEmpty
                                sx={{
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: 2
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main'
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Select email category</em>
                                </MenuItem>
                                <MenuItem value="promotions">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="🛍️" size="small" />
                                        Promotions
                                    </Box>
                                </MenuItem>
                                <MenuItem value="social">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="👥" size="small" />
                                        Socials
                                    </Box>
                                </MenuItem>
                                <MenuItem value="updates">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="📰" size="small" />
                                        Updates
                                    </Box>
                                </MenuItem>
                                <MenuItem value="important">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="⭐" size="small" />
                                        Important
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Confidence Section */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <TuneRounded sx={{ color: '#10b981', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                AI Confidence
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Minimum confidence: <strong>{confidence}%</strong>
                        </Typography>
                        
                        <Box sx={{ px: 1 }}>
                            <Slider
                                disabled={isSubmit}
                                value={confidence}
                                onChange={(event, newValue) => setConfidence(newValue)}
                                min={50}
                                max={100}
                                step={5}
                                valueLabelDisplay="auto"
                                sx={{
                                    color: '#10b981',
                                    height: 8,
                                    '& .MuiSlider-thumb': {
                                        height: 20,
                                        width: 20,
                                        backgroundColor: '#10b981',
                                        border: '3px solid white',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                                        }
                                    },
                                    '& .MuiSlider-track': {
                                        height: 8,
                                        borderRadius: 4
                                    },
                                    '& .MuiSlider-rail': {
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                </Box>

                {/* Submit Button */}
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        disabled={isSubmit || !selectedDate || !category}
                        onClick={handleSubmit}
                        sx={{
                            px: 6,
                            py: 2,
                            borderRadius: 4,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            background: isSubmit 
                                ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: isSubmit 
                                ? 'none'
                                : '0 8px 24px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: isSubmit ? 'none' : 'translateY(-2px)',
                                boxShadow: isSubmit 
                                    ? 'none'
                                    : '0 12px 32px rgba(99, 102, 241, 0.5)'
                            },
                            '&:disabled': {
                                color: 'white'
                            }
                        }}
                    >
                        {isSubmit ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                Processing your emails...
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoAwesome />
                                Clean My Inbox
                            </Box>
                        )}
                    </Button>
                </Box>
            </LocalizationProvider>
        </Card>
    )
}

export default EmailProcessingForm