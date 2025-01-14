// src/components/SearchBar.tsx
import { TextField, InputAdornment, ClickAwayListener, Popper, Fade, Paper, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Avatar, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useState } from "react";
import ProductsService from "@/services/ProductsService";
import { ProductType } from "common-types";
import { useNavigate } from "react-router-dom";

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const navigate = useNavigate();

  const RESULTS_MAX_LENGTH = 3;

  // Gérer les changements de la barre de recherche
  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setIsSearching(true);
    const newTimeout = setTimeout(async() => {
      if (query) {
        try {
          const results = await ProductsService.getAllProducts(RESULTS_MAX_LENGTH, undefined, { nameFilter: query});
          const products = results.data.data as ProductType[];
          setSearchResults(products);
        } 
        catch (error) {
          console.error("Failed to fetch search results");
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }

      setIsSearching(false);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleResultClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setAnchorEl(null);
  };


  // Afficher le panneau de résultats de recherche
  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Fermer le panneau de recherche lorsque l'utilisateur clique en dehors
  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const highlightText = (text: string, highlight: string): JSX.Element => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ color: 'blue', fontWeight: 'bold' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <TextField
          variant="outlined"
          placeholder="Rechercher..."
          size="small"
          sx={{ backgroundColor: 'white', borderRadius: 1, mr: 2 }}
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={handleSearchClick}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{width: 20}}>
                {isSearching && <CircularProgress size={20} /> }
              </InputAdornment>
            )
          }}
        />
        {searchQuery && (
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            transition
            style={{ zIndex: 10000, width: anchorEl?.clientWidth || 0 }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper elevation={3} style={{ maxHeight: 300, overflow: 'auto' }}>
                  <List>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <ListItemButton key={result.id} onClick={() =>handleResultClick(result.id)}>
                          <ListItemIcon>
                            <Avatar src={result.imageUrl} alt={result.name} variant="square" />
                          </ListItemIcon>
                          <ListItemText
                            primary={highlightText(result.name, searchQuery)}
                          />
                        </ListItemButton>
                      ))
                    ) : ( 
                    <>
                      { !isSearching ? (
                        <ListItem>
                          <ListItemText primary="Aucun résultat trouvé" />
                        </ListItem>) : 
                        <></>
                      }
                    </>
                    )}

                    {/* Dernier élément : "voir résultats pour ..." */}
                    <ListItemButton>
                      <ListItemText
                        primary={`Voir tous les résultats pour "${searchQuery}"`}
                        primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                      />
                    </ListItemButton>
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
