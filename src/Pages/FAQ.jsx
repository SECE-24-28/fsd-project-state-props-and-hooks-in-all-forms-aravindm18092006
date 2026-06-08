import React, { useState } from 'react';
import {
  Container, Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, Chip, Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqData = [
  {
    category: '🛒 Orders & Delivery',
    items: [
      { q: 'How can I place an order?', a: 'Browse products, add them to your cart, proceed to checkout, fill in your shipping details, choose a payment method and click Place Order.' },
      { q: 'Do you offer same-day delivery?', a: 'Yes, orders placed before 12:00 PM are eligible for same-day delivery in supported areas.' },
      { q: 'How do I track my order?', a: 'Go to My Orders from the navigation menu. Each order shows its current status — Pending, Processing, Shipped, or Delivered — along with a tracking history.' },
      { q: 'Can I cancel an order?', a: 'Yes, you can cancel an order as long as its status is Pending or Processing. Once shipped, cancellation is not possible.' },
      { q: 'What if my order is delayed?', a: 'If your order has not arrived within the estimated time, please contact us via the Contact page and we will resolve it within 24 hours.' },
      { q: 'Is there a minimum order value?', a: 'No, there is no minimum order value. You can order even a single item.' },
    ],
  },
  {
    category: '💳 Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Credit/Debit Cards, and UPI payments.' },
      { q: 'Is Cash on Delivery available?', a: 'Yes, Cash on Delivery is available for all orders across supported delivery areas.' },
      { q: 'Is my payment information secure?', a: 'Yes, all card transactions are encrypted. We do not store your card details on our servers.' },
      { q: 'Will I get a receipt for my order?', a: 'Yes, a detailed order summary is available in the My Orders section after you place an order.' },
    ],
  },
  {
    category: '🔄 Returns & Refunds',
    items: [
      { q: 'Can I return a product?', a: 'Yes, products can be returned within 24 hours if they are damaged, expired, or not as described. Fresh produce returns are accepted only if the item is visibly spoiled on delivery.' },
      { q: 'How do I request a refund?', a: 'Contact us through the Contact page with your Order ID and a description of the issue. Refunds are processed within 3–5 business days.' },
      { q: 'What items cannot be returned?', a: 'Perishable items (milk, bread, eggs) that have been opened cannot be returned. Non-perishable packaged goods can be returned if unopened.' },
    ],
  },
  {
    category: '👤 Account & Profile',
    items: [
      { q: 'How do I create an account?', a: 'Click Sign Up on the top navigation bar, fill in your name, email, phone number and password, then submit.' },
      { q: 'I forgot my password. What do I do?', a: 'Click Forgot Password on the Login page. Enter your registered email and we will send you a reset link valid for 15 minutes.' },
      { q: 'Can I change my email address?', a: 'Email addresses cannot be changed after registration. Please contact support if you need help with your account.' },
      { q: 'How do I update my delivery address?', a: 'Go to My Profile → Address tab. You can add multiple addresses and set a default one for faster checkout.' },
      { q: 'How do I delete my account?', a: 'Account deletion requires contacting our support team through the Contact page. We will process your request within 48 hours.' },
    ],
  },
  {
    category: '📦 Products',
    items: [
      { q: 'Are your products fresh?', a: 'Yes, all fresh produce — fruits, vegetables, dairy — is sourced daily from verified local suppliers.' },
      { q: 'How do I search for a specific product?', a: 'Use the search bar on the Products page to search by name. You can also filter by category (Fruits, Vegetables, Dairy, Bakery, etc.).' },
      { q: 'What if a product is out of stock?', a: 'Out-of-stock products are marked on the product listing. You can add them to your Wishlist and you will be notified when they are back in stock.' },
      { q: 'Are the product weights accurate?', a: 'All product weights listed are approximate. Actual weight may vary slightly for natural produce items like fruits and vegetables.' },
    ],
  },
  {
    category: '🔒 Privacy & Security',
    items: [
      { q: 'How is my personal data used?', a: 'Your data is used only to process orders, manage your account, and improve your shopping experience. We do not sell your data to third parties.' },
      { q: 'Is my account password stored safely?', a: 'Yes, passwords are hashed using bcrypt before storing. We never store plain-text passwords.' },
      { q: 'How do I report a security issue?', a: 'If you find a security vulnerability, please email us directly at groceriasupport@gmail.com with the subject "Security Report".' },
    ],
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...faqData.map((f) => f.category)];

  const filtered = activeCategory === 'All'
    ? faqData
    : faqData.filter((f) => f.category === activeCategory);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 600 }}>❓ Frequently Asked Questions</Typography>
        <Typography variant="body1" sx={{ color: '#556b8c', mb: 4 }}>
          Everything you need to know about Groceria. Can't find an answer? Contact us.
        </Typography>

        {/* Category filter chips */}
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              color={activeCategory === cat ? 'primary' : 'default'}
              variant={activeCategory === cat ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer', fontWeight: activeCategory === cat ? 700 : 400 }}
            />
          ))}
        </Stack>

        {filtered.map((section) => (
          <Box key={section.category} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#12254a' }}>
              {section.category}
            </Typography>
            {section.items.map((faq, idx) => (
              <Accordion key={idx} sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 600, color: '#12254a' }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: '#556b8c', lineHeight: 1.8 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default FAQ;
