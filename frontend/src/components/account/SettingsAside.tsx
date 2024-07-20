import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { LinkType } from "./Links";

interface SettingsAsideProps {
  settingsLinks : LinkType[];
  initIndex: number;
  onActivateSection: (index: number) => void;
}

export const SettingsAside: React.FC<SettingsAsideProps> = (props) => {
    const { settingsLinks, initIndex, onActivateSection } = props;
    const [activeIndex, setActiveIndex] = useState<number>(initIndex);
    
    return (
    <Box component="aside" height="100%" sx={{ display: { xs: 'none', md: 'block' }, py: 4, borderRight: 1, borderColor: 'divider', mr: 2, pr: 2 }}>
      <Box sx={{ position: 'sticky', top: '3rem' }}>
        <Typography variant="h5" component="h2" sx={{ pl: 3, mb: 4, fontWeight: 'bold' }}>
          Settings
        </Typography>
        {settingsLinks.map((link, index) => (
            <Button
            key={link.text}
            onClick={() => {
              setActiveIndex(index);
              onActivateSection(index);
            }
          }
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              py: 2.5,
              fontWeight: activeIndex === index ? 'bold' : 'medium',
              borderRadius: 2,
              bgcolor: activeIndex === index ? 'background.paper' : 'inherit',
              color: activeIndex === index ? 'primary.main' : 'text.primary',
              border: activeIndex === index ? 1 : 'none',
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'background.paper',
                color: 'primary.main',
                border: 1,
                borderColor: 'primary.main',
              },
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            {link.text}
          </Button>
        ))}
      </Box>
    </Box>
    )
  };

export default SettingsAside;