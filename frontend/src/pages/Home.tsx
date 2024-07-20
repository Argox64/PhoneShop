import { Box, Container, Grid, IconButton, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FAQSection } from "@/components/home/FAQSection";
import { CarouselComponent } from "@/components/main/CarouselComponent";
import ProductSection from "@/components/home/ProductSection";
import { useState } from "react";
import { ProductSortEnum } from "common-types";

const promoImages = [
    "https://via.placeholder.com/800x300?text=Promo+1",
    "https://via.placeholder.com/800x300?text=Promo+2",
    "https://via.placeholder.com/800x300?text=Promo+3"
  ];

export const HomePage: React.FC = () => { 
  // État local pour gérer la visibilité du bandeau de promotion
  const [promoVisible, setPromoVisible] = useState<boolean>(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setPromoVisible(false);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
    
    {/* Bandeau de promotion */}
    {promoVisible && <Box sx={{ backgroundColor: 'yellow', padding: '10px', textAlign: 'center', position: 'relative' }}>
    <Box component="span">Promotion spéciale: 10% de réduction sur tous les téléphones! <Box component="span" sx={{fontWeight:700}}>CODE: PROMO10</Box></Box>
    <IconButton sx={{ position: 'absolute', top: '5px', right: '5px', bottom:'5px' }} onClick={handleClose}>
      <CloseIcon />
    </IconButton>
    </Box>}
    <CarouselComponent images={promoImages} isMobile={isMobile}/>

    {/* Sections avec boutons de navigation */}
    {/*['Meilleures Ventes', 'Notre Sélection', 'Nouveaux Arrivages'].map((category, index) => (
      <PhoneSection key={index}
        category={category} 
        phones={phones} 
        isMobile={isMobile}
      />
    ))*/}
    <ProductSection 
        category="Meilleures Ventes"
        nbPagesPerLoad={2}
        sort={{ by: ProductSortEnum.Sales, desc: true }}
        itemPerPage={4}
    />

    {/* Section des questions courantes */}
    <FAQSection faqQuestions={[
    { title: "Comment puis-je passer une commande ?", response: "Pour passer une commande, vous pouvez ajouter les produits souhaités à votre panier, puis procéder au paiement en suivant les instructions fournies. Si vous avez des questions supplémentaires, n'hésitez pas à contacter notre service client." },
    { title: "Quels modes de paiement acceptez-vous ?", response: "Nous acceptons les paiements par carte de crédit, carte de débit et PayPal." },
    { title: "Comment puis-je suivre ma commande ?", response: "Une fois votre commande expédiée, vous recevrez un e-mail de confirmation contenant un lien de suivi. Vous pouvez cliquer sur ce lien pour suivre l'état de votre commande en temps réel." },
    { title: "Puis-je retourner un produit ?", response: "Oui, nous acceptons les retours dans les 30 jours suivant la réception de votre commande. Veuillez contacter notre service client pour obtenir des instructions sur la façon de retourner votre produit." },
    ]} />

    {/* Footer */}
    <Box sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, padding: theme.spacing(4, 0) }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Section À propos */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                À propos
              </Typography>
              <Typography variant="body2">
                Nous sommes une entreprise dédiée à fournir les meilleurs produits électroniques à nos clients. Notre mission est de rendre les dernières technologies accessibles à tous.
              </Typography>
            </Grid>

            {/* Section Réseaux Sociaux */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Suivez-nous
              </Typography>
              <Box>
                <IconButton href="#" aria-label="Facebook" color="secondary">
                  <FacebookIcon />
                </IconButton>
                <IconButton href="#" aria-label="Twitter" color="secondary">
                  <TwitterIcon />
                </IconButton>
                <IconButton href="#" aria-label="Instagram" color="secondary">
                  <InstagramIcon />
                </IconButton>
                <IconButton href="#" aria-label="LinkedIn" color="secondary">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Section Navigation */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Navigation
              </Typography>
              <Box>
                <Link href="#" underline="none" sx={{ display: 'block', marginBottom: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Accueil
                </Link>
                <Link href="#" underline="none" sx={{ display: 'block', marginBottom: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Produits
                </Link>
                <Link href="#" underline="none" sx={{ display: 'block', marginBottom: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Services
                </Link>
                <Link href="#" underline="none" sx={{ display: 'block', marginBottom: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Contact
                </Link>
              </Box>
            </Grid>

            {/* Section Informations Légales */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Informations Légales
              </Typography>
              <Box>
                <Typography variant="body2">
                  &copy; 2024 Votre Entreprise. Tous droits réservés.
                </Typography>
                <Link href="#" underline="none" sx={{ display: 'block', marginTop: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Mentions Légales
                </Link>
                <Link href="#" underline="none" sx={{ display: 'block', marginTop: theme.spacing(1), color: theme.palette.secondary.main }}>
                  Politique de Confidentialité
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;