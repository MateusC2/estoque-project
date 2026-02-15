import React, { useState } from "react";
import {
  Modal, Box, Typography, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "./CustomModal";
import sheets from "../../services/axios";
import { useBrands } from "../hooks/useBrands";


// --- Estilos para o Modal ---
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600, md: 650 },
  bgcolor: "white",
  borderRadius: "16px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  p: { xs: 3, md: 4 },
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  overflowY: "auto",
};

const primaryButtonStyles = {
  backgroundColor: "#A31515",
  color: "#fff",
  fontWeight: 600,
  "&:hover": { backgroundColor: "#8a1111" },
};

const sectionStyle = {
  mb: 3,
  p: 2.5,
  backgroundColor: "#f9f9f9",
  borderRadius: "12px",
  border: "1px solid #e8e8e8",
};

// -----------------------------------------------


export default function AddItemModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addingNewBrand, setAddingNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const { brands, loadingBrands, savingNewBrand, createBrand } = useBrands(open, setModalInfo);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateBrand = async () => {
    const newBrand = await createBrand(newBrandName);
    if (newBrand) {
      setFormData({ ...formData, brand: newBrand.brand });
      setNewBrandName("");
      setAddingNewBrand(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.brand?.trim()) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Selecione ou adicione uma marca",
        type: "error",
      });
      return;
    }

    if (!formData.description?.trim()) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Descrição é obrigatória",
        type: "error",
      });
      return;
    }

    if (!formData.quantity || Number(formData.quantity) < 0) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Quantidade deve ser um número válido",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const payload = {
      brand: formData.brand.trim(),
      description: formData.description.trim(),
      currentQuantity: Number(formData.quantity),
    };

    try {
      const response = await sheets.createItem(payload);
      const data = response.data;

      if (data.success) {
        setModalInfo({
          open: true,
          title: "Sucesso! 🎉",
          message: "Item adicionado com sucesso!",
          type: "success",
        });

        setFormData({});
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message || "Falha ao adicionar item",
          type: "error",
        });
      }
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: error.response?.data?.error || "Erro ao adicionar item",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        sx={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
          {/* Header */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={1}
            color="#A31515"
          >
            ➕ Adicionar Novo Item
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="#666"
            sx={{ fontStyle: "italic" }}
          >
            Preencha os dados principais do item para adicioná-lo ao estoque
          </Typography>

          {/* Seção 1: Marca */}
          <Box sx={sectionStyle}>
            <Typography variant="h6" fontWeight="600" mb={2} color="#333">
              🏷️ Marca do Item
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Marca *</InputLabel>
              <Select
                value={formData.brand || ""}
                onChange={(e) => {
                  if (e.target.value === "newBrand") {
                    setAddingNewBrand(true);
                  } else {
                    setFormData({ ...formData, brand: e.target.value });
                  }
                }}
                label="Marca *"
                disabled={loadingBrands}
              >
                <MenuItem disabled value="">
                  {loadingBrands ? "Carregando marcas..." : "Selecione uma marca"}
                </MenuItem>
                {brands.map((b) => (
                  <MenuItem key={b.brand} value={b.brand}>
                    {b.brand}
                  </MenuItem>
                ))}
                <MenuItem value="newBrand" sx={{ fontWeight: "bold", color: "#A31515", mt: 1, borderTop: "1px solid #ddd", pt: 1 }}>
                  <AddIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                  Adicionar nova marca...
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Dialog para Nova Marca */}
          <Dialog open={addingNewBrand} onClose={() => setAddingNewBrand(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, color: "#A31515" }}>Nova Marca</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                autoFocus
                label="Nome da Marca"
                fullWidth
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateBrand()}
                placeholder="Ex: HONDA, FORD, TOYOTA..."
                disabled={savingNewBrand}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={() => { setAddingNewBrand(false); setNewBrandName(""); }} disabled={savingNewBrand}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateBrand}
                variant="contained"
                disabled={savingNewBrand || !newBrandName.trim()}
                sx={primaryButtonStyles}
              >
                {savingNewBrand ? <CircularProgress size={20} color="inherit" /> : "Adicionar"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Seção 2: Descrição */}
          <Box sx={sectionStyle}>
            <Typography variant="h6" fontWeight="600" mb={2} color="#333">
              📝 Descrição do Item
            </Typography>
            <TextField
              label="Descrição detalhada *"
              fullWidth
              multiline
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={handleFormChange}
              placeholder="Ex: Painel digital do motor, marca HONDA, compatível com modelos 2020-2024..."
              variant="outlined"
              required
            />
            <Typography variant="caption" color="#999" sx={{ display: "block", mt: 1 }}>
              Descreva o item com detalhes para facilitar a identificação
            </Typography>
          </Box>

          {/* Seção 3: Quantidade */}
          <Box sx={sectionStyle}>
            <Typography variant="h6" fontWeight="600" mb={2} color="#333">
              📦 Quantidade Inicial
            </Typography>
            <TextField
              label="Quantidade *"
              type="number"
              fullWidth
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleFormChange}
              placeholder="0"
              variant="outlined"
              inputProps={{ min: 0, step: 1 }}
              required
              helperText="Quantidade do item que será adicionada ao estoque"
            />
          </Box>

          {/* Botões de Ação */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{ color: "#A31515", borderColor: "#A31515", "&:hover": { backgroundColor: "rgba(163,21,21,0.05)" } }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={primaryButtonStyles}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "✓ Adicionar Item"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal de Status */}
      <CustomModal
        open={modalInfo.open}
        onClose={() => setModalInfo({ ...modalInfo, open: false })}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
}