// src/components/FAQSection.tsx
import { Container, Typography, List, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type FAQSectionProps = {
  faqQuestions: { title: string, response: string }[];
};

export const FAQSection: React.FC<FAQSectionProps> = ({ faqQuestions }) => (
  <Container sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h5" component="h2" gutterBottom>
      Questions Fréquentes
    </Typography>
    <List>
      {faqQuestions.map((question, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{question.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {question.response}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </List>
  </Container>
);