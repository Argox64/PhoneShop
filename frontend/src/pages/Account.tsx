import { LinkType } from '@/components/account/Links';
import OrdersSection from '@/components/account/OrdersSection';
import Profil from '@/components/account/Profil';
import SettingsAside from '@/components/account/SettingsAside';
import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

  export const Account: React.FC = () => {
  const [content, setContent] = useState<React.ReactNode>(<></>);
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const settingsLinks : LinkType[] = [
    { text: 'Profil', section: 'profil', content:<Profil />},
    { text: 'Orders', section: 'orders', content: <OrdersSection/> },
    { text: 'Autres', section: 'others', content: <></>},
  ];

  let initIndex = settingsLinks.findIndex((link) => link.section === section);
  if(initIndex < 0)
    initIndex = 0;

  useEffect(() => {
    let content;
    settingsLinks.forEach((element) => {
      if(element.section === section) {
        content = element.content;
      }
    });

    if(content === undefined) {
      content = settingsLinks[0].content;
      navigate("/account/" + settingsLinks[0].section)
    }
    setContent(content);
  }, [location]);

  return (
  <Container sx={{ py: 5 }}>
    <Grid container spacing={3}>
      <Grid item md={3}>
        <SettingsAside initIndex={initIndex} settingsLinks={settingsLinks} onActivateSection={(index: number) => {
          setContent(settingsLinks[index].content);
          navigate("/account/" + settingsLinks[index].section);
        }}/>
      </Grid>
      <Grid item md={9}>
        {content}
      </Grid>
    </Grid>
  </Container>
  )
};