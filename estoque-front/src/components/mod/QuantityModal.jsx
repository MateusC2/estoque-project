import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import api from "../../services/axios";

export default function QuantityModal({ open, onClose, item, onSuccess, onError }) {
  const [type, setType] = useState("ENTRADA");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const qty = Number(quantity);
    if (!item || !item.idItem) return;
    if (!qty || qty <= 0) {
      onError?.("Informe uma quantidade válida (> 0).");
      return;
    }

    setLoading(true);
    try {
      const payload = { quantityChange: qty, type };
      const response = await api.updateItemQuantity(item.idItem, payload);
      if (response.data?.success) {
        onSuccess?.(response.data.message || "Quantidade atualizada com sucesso.");
        onClose?.();
      } else {
        onError?.(response.data?.error || response.data?.message || "Erro ao atualizar quantidade.");
      }
    } catch (err) {
      onError?.(err.response?.data?.error || "Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setType("ENTRADA");
    setQuantity(0);
    onClose?.();
  };

  return (
    <Dialog open={!!open} onClose={resetAndClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ backgroundColor: '#A31515', color: '#fff', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>Operação no item</DialogTitle>
      <DialogContent>
        {item ? (
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.brand || item.name}</Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>{item.currentQuantity ?? item.totalQuantity ?? '—'} em estoque</Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#444' }}>{item.description || '—'}</Typography>

            <TextField
              select
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
            >
              <MenuItem value="ENTRADA">ENTRADA</MenuItem>
              <MenuItem value="SAIDA">SAIDA</MenuItem>
              <MenuItem value="AJUSTE">AJUSTE</MenuItem>
            </TextField>

            <TextField
              label={type === "AJUSTE" ? "Quantidade (valor final)" : "Quantidade"}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              size="small"
              inputProps={{ min: 0 }}
            />
          </Box>
        ) : (
          <Typography>Item inválido.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={resetAndClose} color="inherit">Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained" sx={{ backgroundColor: '#A31515', '&:hover': { backgroundColor: '#7c0f0f' } }} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
