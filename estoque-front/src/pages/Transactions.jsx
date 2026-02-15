import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Container, Skeleton, Paper, Button, Stack, Drawer } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import CustomModal from "../components/mod/CustomModal";
import HeaderPerfil from "../components/layout/HeaderPerfil";
import Footer from "../components/layout/Footer";
import sheets from "../services/axios";
import { formatDateTimeBR } from "../utils/dateUtils";
import fundoImage from "../../public/fundo.png";

dayjs.locale('pt-br');

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [modalCustom, setModalCustom] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    document.title = "Transações";
    fetchTransactions();
  }, []);

  const handleCloseCustomModal = () => {
    setModalCustom((prev) => ({ ...prev, open: false }));
  };

  async function fetchTransactions() {
    setLoading(true);
    try {
      const response = await sheets.getTransactions();
      const raw = response.data?.data || response.data?.transactions || [];

      // Normaliza campos possíveis entre implementações diferentes
      const normalized = (Array.isArray(raw) ? raw : []).map((t) => ({
        idLog: t.idLog ?? t.id ?? null,
        idItem: t.idItem ?? t.itemId ?? t.item_id ?? null,
        brand: t.brand ?? t.itemBrand ?? null,
        description: t.description ?? t.itemDescription ?? t.itemName ?? null,
        type: t.type ?? t.action ?? t.actionDescription ?? null,
        quantityChange: t.quantityChange ?? t.quantity ?? t.qty ?? null,
        timestamp: t.timestamp ?? t.transactionDate ?? t.lastUpdated ?? null,
      }));

      setTransactions(normalized);
      setDisplayedTransactions(normalized);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTransactions([]);
        setModalCustom({
          open: true,
          title: "Nenhuma Transação!",
          message: "Nenhuma transação encontrada.",
          type: "info",
        });
      } else {
        const errorMessage =
          error.response?.data?.error || "Erro ao carregar transações.";
        setModalCustom({
          open: true,
          title: "Erro!",
          message: errorMessage,
          type: "error",
        });
        setTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleClearFilter = () => {
    setDateFrom(null);
    setDateTo(null);
    setDisplayedTransactions(transactions);
    setFilterDrawerOpen(false);
  };

  const applyDateFilter = () => {
    if (!dateFrom && !dateTo) {
      setDisplayedTransactions(transactions);
      setFilterDrawerOpen(false);
      return;
    }

    let from = dateFrom ? dateFrom.toDate() : null;
    let to = dateTo ? dateTo.toDate() : null;
    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    if (from && to && from > to) {
      const tmp = from;
      from = to;
      to = tmp;
    }

    const filtered = transactions.filter((t) => {
      if (!t.timestamp) return false;
      const ts = new Date(t.timestamp);
      if (from && ts < from) return false;
      if (to && ts > to) return false;
      return true;
    });

    setDisplayedTransactions(filtered);
    setFilterDrawerOpen(false);
  };

  const actionTranslations = {
    ENTRADA: "Entrada",
    SAIDA: "Retirada",
    AJUSTE: "Reajuste",
    IN: "Entrada",
    OUT: "Retirada",
    REAJUST: "Reajuste",
  };

  const styles = getStyles();

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Box sx={styles.transactionsBox}>
          <Box sx={styles.header}>
            <Typography component="h1" variant="h5" sx={styles.title}>
              Transações
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ backgroundColor: '#cc1414', color: '#ffffff', fontWeight: 600, '&:hover': { backgroundColor: '#8a1111' } }}
            >
              Filtrar
            </Button>
          </Box>

          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            PaperProps={{
              sx: { width: { xs: '100%', sm: 300 }, p: 3, backgroundColor: '#fff', color: '#000' }
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Filtrar por Período
              </Typography>
              <Stack spacing={2}>
                <DatePicker
                  label="Data de Início"
                  value={dateFrom}
                  onChange={(newValue) => setDateFrom(newValue)}
                  maxDate={dayjs()}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': { backgroundColor: '#f9f9f9', borderRadius: '4px' },
                        '& .MuiOutlinedInput-input': { color: '#000' }
                      }
                    }
                  }}
                />
                <DatePicker
                  label="Data de Término"
                  value={dateTo}
                  onChange={(newValue) => setDateTo(newValue)}
                  maxDate={dayjs()}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': { backgroundColor: '#f9f9f9', borderRadius: '4px' },
                        '& .MuiOutlinedInput-input': { color: '#000' }
                      }
                    }
                  }}
                />
                <Button variant="contained" onClick={applyDateFilter} sx={{ backgroundColor: '#a31515', color: '#fff', fontWeight: 600, '&:hover': { backgroundColor: '#8a1111' } }}>
                  Aplicar Filtro
                </Button>
                <Button variant="outlined" onClick={handleClearFilter} sx={{ borderColor: '#a31515', color: '#a31515', '&:hover': { backgroundColor: 'rgba(163, 21, 21, 0.05)' } }}>
                  Limpar Filtro
                </Button>
              </Stack>
            </LocalizationProvider>
          </Drawer>
          {loading ? (
            <Box sx={styles.loadingBox}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Paper key={`skele-${i}`} sx={{ width: '100%', p: 2, mb: 2 }}>
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </Paper>
              ))}
            </Box>
          ) : displayedTransactions.length === 0 ? (
            <Box sx={styles.noTransactionsBox}>
              <Typography variant="body1" sx={{ color: "gray" }}>
                Nenhuma transação encontrada.
              </Typography>
            </Box>
          ) : (
            <Box sx={styles.transactionsList}>
              {displayedTransactions.map((transaction, index) => {
                const date = transaction.timestamp ? new Date(transaction.timestamp) : null;
                const formattedDate = date ? formatDateTimeBR(date) : "—";

                return (
                  <Paper key={transaction.idLog ?? index} sx={styles.transactionItem} elevation={1}>
                    <Typography variant="body1" sx={styles.transactionTitle}>
                      Registro {index + 1}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Typography variant="body2">
                        <strong>Item:</strong> {transaction.description || transaction.brand || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Tipo da Ação:</strong>{' '}
                        {actionTranslations[transaction.type] || transaction.type || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Quantidade:</strong> {transaction.quantityChange ?? '—'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Data:</strong> {formattedDate}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
      <CustomModal
        open={modalCustom.open}
        onClose={handleCloseCustomModal}
        title={modalCustom.title}
        message={modalCustom.message}
        type={modalCustom.type}
        buttonText="Fechar"
      />
    </Box>
  );
}

function getStyles() {
  return {
    pageLayout: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    container: {
      backgroundImage: `url(${fundoImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "100%",
      padding: "10px",
      flexGrow: 1,
    },
    transactionsBox: {
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      // Responsividade de largura
      width: { xs: "90%", sm: "100%" }, 
      maxWidth: "450px", // Aumentado para desktop/tablet
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // Padding ajustado para mobile
      padding: { xs: "15px", sm: "20px" }, 
      position: "relative",
    },
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontWeight: "bold",
      color: "#333",
      fontSize: { xs: "1.4rem", sm: "1.5rem" }, // Fonte responsiva
    },
    transactionsList: {
      width: "100%",
      // Altura máxima ajustada
      maxHeight: { xs: "70vh", sm: "60vh" }, 
      overflowY: "auto",
    },
    transactionItem: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      // Padding reduzido para mobile
      padding: { xs: "10px", sm: "15px" }, 
      // Espaçamento entre itens reduzido
      marginBottom: "10px", 
      "&:not(:last-child)": {
        borderBottom: "1px solid #eee",
        marginBottom: "10px",
      },
    },
    transactionTitle: {
      fontWeight: "bold",
      marginBottom: "5px",
      color: "rgba(177, 16, 16, 1)", // Destaque em vermelho
      fontSize: { xs: "1rem", sm: "1.1rem" },
    },
    loadingBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
    },
    noTransactionsBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100px",
    },
  };
}

export default Transactions;