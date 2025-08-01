import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material'
import { ExpandMore, HelpOutline } from '@mui/icons-material'
import { useState } from 'react'

function FAQSection() {
    const [expanded, setExpanded] = useState('panel0')

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const faqs = [
        {
            question: "Do you store my emails?",
            answer: "Never. We process emails in real-time and store nothing. Your emails never leave your control - everything happens locally in your browser and through secure API calls directly to your email provider."
        },
        {
            question: "Which email providers work?",
            answer: "Gmail, Outlook, Yahoo, iCloud, and most other major email providers. We use industry-standard OAuth 2.0 authentication to securely connect to your email account without ever seeing your password."
        },
        {
            question: "What happens after I delete emails?",
            answer: "Deleted emails go to your email provider's trash/deleted items folder, just like when you delete them manually. You can restore them normally through your email client if needed."
        },
        {
            question: "How is this different from other email cleaners?",
            answer: "Most email tools store your data for 'analysis' or take hours to process emails. EmailAI processes 1000+ emails in under 2 minutes, stores nothing, and gives you granular control over what gets cleaned."
        },
        {
            question: "What if I accidentally delete important emails?",
            answer: "Deleted emails go to your trash folder and can be restored normally. Plus, our confidence level setting helps prevent false positives - you can set it higher for more conservative cleaning."
        },
        {
            question: "Is there a free version?",
            answer: "Yes! The free version lets you clean 100 emails per month with all the same features. Perfect for light users or to try EmailAI before upgrading."
        }
    ]

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)'
        }}>
            <Container maxWidth="md">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip 
                        icon={<HelpOutline />}
                        label="Frequently Asked Questions" 
                        color="primary" 
                        variant="outlined"
                        sx={{ 
                            mb: 3,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            px: 2,
                            py: 1,
                            height: 'auto',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            backgroundColor: 'rgba(99, 102, 241, 0.05)'
                        }}
                    />
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
                        Got Questions?
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                    >
                        Here are the most common questions about EmailAI
                    </Typography>
                </Box>

                {/* FAQ Accordions */}
                <Box sx={{ '& .MuiAccordion-root': { mb: 2 } }}>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:before': {
                                    display: 'none'
                                },
                                '&.Mui-expanded': {
                                    margin: '0 0 16px 0',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    borderColor: 'rgba(99, 102, 241, 0.2)'
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.02)',
                                    borderColor: 'rgba(99, 102, 241, 0.2)'
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#6366f1' }} />}
                                sx={{
                                    py: 2,
                                    px: 3,
                                    minHeight: 'auto',
                                    '&.Mui-expanded': {
                                        minHeight: 'auto'
                                    },
                                    '& .MuiAccordionSummary-content': {
                                        margin: '12px 0',
                                        '&.Mui-expanded': {
                                            margin: '12px 0'
                                        }
                                    }
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        color: 'text.primary',
                                        pr: 2
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography 
                                    variant="body1" 
                                    color="text.secondary"
                                    sx={{ 
                                        lineHeight: 1.7,
                                        fontSize: '1rem'
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Bottom CTA */}
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Still have questions?
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="primary.main"
                        sx={{ 
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#5855eb'
                            }
                        }}
                    >
                        Contact us directly →
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default FAQSection