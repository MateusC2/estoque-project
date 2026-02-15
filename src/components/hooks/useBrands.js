import { useState, useEffect } from 'react';
import sheets from '../../services/axios';

export const useBrands = (modalOpen, setModalInfo) => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [savingNewBrand, setSavingNewBrand] = useState(false);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await sheets.getBrands();
      const data = response.data?.brands || response.data?.data || [];
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      setBrands([]);
      setModalInfo({
        open: true,
        title: 'Erro!',
        message: 'Falha ao carregar marcas',
        type: 'error',
      });
    } finally {
      setLoadingBrands(false);
    }
  };

  const createBrand = async (brandName) => {
    if (!brandName.trim()) {
      setModalInfo({
        open: true,
        title: 'Erro!',
        message: 'Nome da marca não pode estar vazio',
        type: 'error',
      });
      return null;
      
    }
    
    setSavingNewBrand(true);
    try {
      const response = await sheets.createBrand?.({ brand: brandName }) ||
        sheets.postAddItem?.({ brand: brandName });
      
      if (response?.data?.success) {
        await fetchBrands();
        setModalInfo({
          open: true,
          title: 'Sucesso!',
          message: 'Marca adicionada com sucesso!',
          type: 'success',
        });
        return { brand: brandName };
      } else {
        // Fallback: adiciona localmente se a API não suportar
        const newBrand = { brand: brandName };
        setBrands([...brands, newBrand]);
        setModalInfo({
          open: true,
          title: 'Sucesso!',
          message: 'Marca adicionada!',
          type: 'success',
        });
        return newBrand;
        
      }
    } catch (error) {
      console.error('Erro ao criar marca:', error);
      // Fallback: adiciona localmente
      const newBrand = { brand: brandName };
      setBrands([...brands, newBrand]);
      return newBrand;
    } finally {
      setSavingNewBrand(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      fetchBrands();
    }
  }, [modalOpen]);

  return {
    brands,
    loadingBrands,
    savingNewBrand,
    fetchBrands,
    createBrand,
  };
};
