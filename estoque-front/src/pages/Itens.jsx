import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Pagination,
  CircularProgress,
  Checkbox,
  Chip,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderPrincipal from "../components/layout/HeaderPrincipal";
import Footer from "../components/layout/Footer";
import api from "../services/axios";
import { formatDateTimeBR } from "../utils/dateUtils";
import ModalDescription from "../components/mod/ModalDescription";
import AddItemModal from "../components/mod/AddItemModal";
import CustomModal from "../components/mod/CustomModal";
import QuantityModal from "../components/mod/QuantityModal";

const DEFAULT_LIMIT = 15;

function Itens() {
  const [search, setSearch] = useState("");
  const [itens, setItens] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  const fetchBrands = async () => {
    try {
      const res = await api.getBrands();
      const data = res.data?.data || res.data?.brands || res.data || [];
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar marcas', err);
      setBrands([]);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const searchTerm = search?.trim();
      const hasSearch = !!searchTerm;
      const hasBrandFilter = selectedBrands && selectedBrands.length > 0;

      let response;
      if (hasSearch || hasBrandFilter) {
        const brandsPayload = hasBrandFilter
          ? selectedBrands.map((b) => b.brand || b.name || b.value || b.brandValue)
          : undefined;

        const payload = {};
        if (brandsPayload) payload.brand = brandsPayload; // sempre enviar array para múltiplas marcas (OR esperado no backend)
        if (hasSearch) payload.description = searchTerm;

        response = await (api.filterItems ? api.filterItems(payload) : api.filterItens(payload));
      } else {
        // sem paginação no backend: pega todos
        response = await api.getItems();
      }

      const itensList = response.data?.data || response.data?.items || response.data || [];

      setItens(Array.isArray(itensList) ? itensList : []);
      setErrorMessage((Array.isArray(itensList) && itensList.length === 0) ? "Nenhum item encontrado." : "");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Erro ao carregar os itens."
      );
      setItens([]);
    } finally {
      setLoading(false);
    }
  };
  const handleItemDeleteSuccess = () => {
    handleFilter(); 
  };

  const handleOpenModal = (itemId) => {
    setSelectedItem(itemId);
    setModalOpen(true);
  };

  // categoria selection removida

  const handleOpenModalAdd = () => {
    setDrawerOpen(false);
    setModalAddOpen(true);
  };

  const handleCloseModalAdd = () => {
    setModalAddOpen(false);
  };

  const handleAddModalSuccess = () => {
    handleFilter(); // Recarrega a lista principal de itens
    fetchBrands(); // Recarrega as marcas para refletir novas marcas criadas
  };

  useEffect(() => {
    document.title = "Itens";
    handleFilter();
    fetchBrands();
  }, []);
  useEffect(() => {
    handleFilter();
  }, [search, selectedBrands]);

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const key = brand.brand || brand.name || brand.value || brand.brandValue;
      const exists = prev.some((b) => (b.brand || b.name || b.value || b.brandValue) === key);
      if (exists) return prev.filter((b) => (b.brand || b.name || b.value || b.brandValue) !== key);
      return [...prev, brand];
    });
  };

  const getTitle = (item) => item.name || "";
  const getSpecs = (item) =>
    item.technicalSpecs?.map((spec) => spec.technicalSpecValue).join(", ") ||
    "";
  // Modal para ações de quantidade
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedForQuantity, setSelectedForQuantity] = useState(null);

  const openQuantityModal = (item) => {
    setSelectedForQuantity(item);
    setQuantityModalOpen(true);
  };

  return (
    <Box sx={styles.pageContainer}>
      <HeaderPrincipal />
      <Box
        sx={{
          ...styles.content,
          overflowY: "auto",
          maxHeight: "calc(100vh - 150px)",
          paddingRight: "8px",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#fff",
            borderRadius: "8px",
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={styles.headerTitle}>
          Itens
        </Typography>
        {/* Filtro com menu hamburguer */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            maxWidth: 1000,
            mx: "auto",
            p: 1,
            borderRadius: "8px",
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: "#a31515" }}
          >
            <MenuIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Filtro de descrição ex: civic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              borderRadius: 20,
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
          />
        </Box>
        {/* Marcas selecionadas (label + limpar) */}
        {selectedBrands && selectedBrands.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 1, flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>{selectedBrands.length} marca(s) selecionada(s):</Typography>
              {selectedBrands.map((b, i) => (
                <Chip
                  key={i}
                  label={b.brand || b.name || b.value || b.brandValue}
                  size="small"
                  onDelete={() => handleToggleBrand(b)}
                  sx={{ bgcolor: '#fff', color: '#a31515', fontWeight: 600 }}
                />
              ))}
            </Stack>
            <Button onClick={() => { setSelectedBrands([]); handleFilter(); }} sx={{ ml: 1 }}>
              Limpar marcas
            </Button>
          </Box>
        )}
        {/* Drawer lateral para categorias */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { backgroundColor: "#a31515", color: "#fff", width: 260, p: 2, boxShadow: 6 },
          }}
        >
          <Typography sx={{ p: 2, fontWeight: "bold" }}>
            Marcas
          </Typography>

          <List sx={{ 
            maxHeight: '60vh', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              },
            },
          }}>
            {brands.map((b, i) => (
              <ListItem
                key={i}
                button
                onClick={() => handleToggleBrand(b)}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' } }}
              >
                <ListItemText primary={b.brand || b.name || b.value || b.brandValue || '—'} sx={{ color: '#fff' }} />
                <Checkbox
                  checked={selectedBrands.some((sb) => (sb.brand || sb.name || sb.value || sb.brandValue) === (b.brand || b.name || b.value || b.brandValue))}
                  sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }}
                />
              </ListItem>
            ))}

            <ListItem button onClick={handleOpenModalAdd}>
              <ListItemText
                primary="+ Adicionar Item"
                sx={{ fontWeight: "bold", cursor: "pointer", color: "#fff" }}
              />
            </ListItem>
          </List>
          {/* Removed Limpar/Aplicar buttons: selecting a brand updates the list immediately */}
        </Drawer>
        {/* Lista dos itens */}
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
              <CircularProgress color="error" />
              <Typography sx={{ mt: 1, color: "#555" }}>Carregando Itens...</Typography>
            </Box>
          ) : itens && itens.length > 0 ? (
            <List>
              {itens.map((item, idx) => (
                <ListItem key={item.idItem ?? idx} divider>
                  <ListItemText
                    primary={`${item.brand || item.name || "Item"} — ${item.description || item.name || ""}`}
                    secondary={`Quantidade: ${item.currentQuantity ?? item.totalQuantity ?? "—"} • Atualizado: ${item.lastUpdated ? formatDateTimeBR(item.lastUpdated) : "—"}`}
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" size="small" color="error" onClick={() => openQuantityModal(item)}>
                      Ação
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 4 }}>{errorMessage || "Nenhum item encontrado."}</Typography>
          )}
        </Box>
      </Box>
      <Footer />

      <ModalDescription
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedItem}
        onSuccess={(msg) => setSuccessMessage(msg)}
        onError={(msg) => setErrorModalMessage(msg)}
        onItemDeleteSuccess={handleItemDeleteSuccess}
      />

      <QuantityModal
        open={quantityModalOpen}
        onClose={() => setQuantityModalOpen(false)}
        item={selectedForQuantity}
        onSuccess={(msg) => { setSuccessMessage(msg); handleFilter(); }}
        onError={(msg) => setErrorModalMessage(msg)}
      />
      {/* Modal de sucesso */}
      {successMessage && (
        <CustomModal
          open={!!successMessage}
          onClose={() => setSuccessMessage("")}
          title="Sucesso"
          message={successMessage}
          type="success"
        />
      )}
      {/* Modal de erro */}
      {errorModalMessage && (
        <CustomModal
          open={!!errorModalMessage}
          onClose={() => setErrorModalMessage("")}
          title="Erro"
          message={errorModalMessage}
          type="error"
        />
      )}

      <AddItemModal
        open={modalAddOpen}
        onClose={handleCloseModalAdd}
        itemId={selectedItem}
        onSuccess={handleAddModalSuccess}
      />
    </Box>
  );
}

export default Itens;

// Estilos Otimizados para Responsividade
const styles = {
  senaiRed: "#A31515",

  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  // Ajuste o padding do conteúdo principal para ser responsivo
  content: {
    flex: 1,
    p: { xs: 2, md: 3 },
  },
  headerTitle: { textAlign: "center", mb: 4 },

  // --- Ajuste Principal: Cards Grid Responsivo ---
  cardsGrid: {
    display: "grid",
    // Padrão: 1 coluna em telas pequenas (xs), depois adapta para 2 ou mais
    gridTemplateColumns: {
      xs: "1fr", // Uma coluna inteira para telas pequenas (menos de 600px)
      sm: "repeat(auto-fit, minmax(280px, 1fr))", // Começa a encaixar mais de um item
    },
    // Ajuste de gap para ser menor no mobile
    gap: { xs: "20px", sm: "28px 40px", md: "28px 60px" },

    // Removido paddings fixos e usado paddings responsivos do MUI
    paddingLeft: { xs: "16px", sm: "30px" },
    paddingRight: { xs: "16px", sm: "30px" },

    marginTop: "24px",
    width: "100%",
    boxSizing: "border-box",
    justifyItems: "center",
  },

  card: {
    width: "100%",
    minHeight: 150,
    maxWidth: {
      xs: "100%",
      sm: "400px",
    },
    borderRadius: "10px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "visible",
    padding: "18px",
    backgroundColor: "#fff",
    transition: 'transform .22s ease, box-shadow .22s ease',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 14px 30px rgba(0,0,0,0.18)'
    },
  },

  cardTitleCentered: {
    fontSize: { xs: "1.2rem", sm: "1.4rem" }, // Fonte um pouco menor no mobile
    fontWeight: 700,
    color: "#222",
    textAlign: "center",
    marginBottom: 2,
  },
  specs: {
    fontSize: { xs: "0.9rem", sm: "0.95rem" }, // Fonte ajustada
    color: "#444",
    textAlign: "left",
    lineHeight: 1.3,
  },
  verMaisButton: {
    backgroundColor: "rgba(177,16,16,1)",
    "&:hover": { backgroundColor: "rgba(150,14,14,1)" },
    color: "#fff",
    textTransform: "none",
    borderRadius: "18px",
    padding: "6px 18px",
  },
  paginationBox: {
    display: "flex",
    justifyContent: "center",
    mt: 3,
    py: 1,
  },
};
