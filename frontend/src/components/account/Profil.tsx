import { Button, Grid, Paper, styled, TextField, Typography } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    }/*,
    textTransform: 'none',
    fontWeight: 400*/
  }));

const Profil: React.FC = () => (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Profil
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Général</Typography>
          <TextField fullWidth label="Your first name" defaultValue="Jane" variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth label="Your last name" defaultValue="Ferguson" variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth label="Your email" variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth label="Profession" variant="outlined" sx={{ mb: 3 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Mot de passe</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="New Password" type="password" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Confirm New Password" type="password" variant="outlined" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton variant="contained">Sauvegarder</CustomButton>
        </Grid>
      </Grid>
    </Paper>
  );

export default Profil;