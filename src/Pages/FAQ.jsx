import React from 'react';
import { Container, Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const faqs = [
    { q: 'How can I place an order?', a: 'Browse products, add them to your cart, and proceed to checkout to complete your order.' },
    { q: 'Do you offer same-day delivery?', a: 'Yes, we offer same-day delivery for eligible orders placed before the cut-off time.' },
    { q: 'Can I return a product?', a: 'Yes, you can return products within 24 hours if they are damaged or not as described.' },
    { q: 'What payment methods do you accept?', a: 'We accept credit cards, debit cards, UPI, net banking, and wallet payments.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          ❓ Frequently Asked Questions
        </Typography>

        <Card>
          <CardContent>
            {faqs.map((faq, idx) => (
              <Accordion key={idx} sx={{ mb: 2, borderRadius: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: '#556b8c' }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default FAQ;
