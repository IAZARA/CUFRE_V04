import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Expediente, Fotografia } from '../../types/expediente.types';
import expedienteService from '../../api/expedienteService';

interface FotografiasTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposFotografia = [
  'Rostro Frente',
  'Rostro Perfil',
  'Cuerpo Completo',
  'Tatuajes',
  'Cicatrices',
  'Señas Particulares',
  'Lugar del Hecho',
  'Evidencia',
  'Otro'
];

// Componente ImageWithFallback para mostrar una imagen con fallback
const ImageWithFallback: React.FC<{src: string, alt: string}> = ({ src, alt }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 140 }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {imageError ? (
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          color: 'text.secondary',
          p: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2">
            Error al cargar la imagen. Inténtelo nuevamente.
          </Typography>
        </Box>
      ) : (
        <img 
          src={src} 
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setImageError(true);
          }}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: loading ? 'none' : 'block'
          }} 
        />
      )}
    </Box>
  );
};

const FotografiasTab: React.FC<FotografiasTabProps> = ({ expediente, onChange }) => {
  const [newFotografia, setNewFotografia] = useState<Partial<Fotografia>>({
    url: '',
    tipo: '',
    descripcion: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFotografia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewFotografia(prev => ({
            ...prev,
            file: file,
            url: event.target?.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAddFotografia = async () => {
    if (!newFotografia.url || !newFotografia.tipo || !expediente.id || !newFotografia.file) {
      setError("Falta información o el expediente no ha sido guardado aún");
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', newFotografia.file);
      formData.append('descripcion', newFotografia.descripcion || newFotografia.tipo);
      
      const uploadedFoto = await expedienteService.uploadFotografia(expediente.id, formData);
      
      const updatedFotografias = [
        ...expediente.fotografias,
        {
          id: uploadedFoto.id,
          url: `http://localhost:8080${uploadedFoto.rutaArchivo}`,
          tipo: newFotografia.tipo,
          descripcion: newFotografia.descripcion || ''
        }
      ];
      
      onChange('fotografias', updatedFotografias);
      
      setNewFotografia({
        url: '',
        tipo: '',
        descripcion: ''
      });
    } catch (error) {
      console.error('Error al subir fotografía:', error);
      setError('Error al subir la fotografía. Por favor, intente nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFotografia = async (id: number | undefined) => {
    if (!id || !expediente.id) return;

    setUploading(true);
    setError(null);

    try {
      await expedienteService.deleteFotografia(expediente.id, id);
      const updatedFotografias = expediente.fotografias.filter(foto => foto.id !== id);
      onChange('fotografias', updatedFotografias);
    } catch (error) {
      setError('Error al eliminar la fotografía. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewImage = (url: string) => {
    setSelectedImage(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const handleSetFotoPrincipal = async (fotoId: number) => {
    if (!expediente.id) return;
    try {
      await expedienteService.setFotoPrincipal(expediente.id, fotoId);
      onChange('fotoPrincipalId', fotoId);
    } catch (error) {
      // Manejar error (puedes mostrar un mensaje al usuario)
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fotografías
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Agregar Nueva Fotografía
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 250px' }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ height: '56px' }}
              disabled={uploading || !expediente.id}
            >
              Seleccionar Imagen
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
          
          <Box sx={{ flex: '1 1 200px' }}>
            <TextField
              select
              fullWidth
              label="Tipo de Fotografía"
              name="tipo"
              value={newFotografia.tipo || ''}
              onChange={handleInputChange}
            >
              {tiposFotografia.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 250px' }}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={newFotografia.descripcion || ''}
              onChange={handleInputChange}
            />
          </Box>
          
          <Box sx={{ flex: '0 0 100px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFotografia}
              disabled={uploading || !newFotografia.url || !newFotografia.tipo || !expediente.id}
              sx={{ height: '56px' }}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : 'Agregar'}
            </Button>
          </Box>
        </Box>
        
        {!expediente.id && (
          <Typography color="error" sx={{ mt: 2 }}>
            Debe guardar el expediente antes de poder agregar fotografías.
          </Typography>
        )}
        
        {newFotografia.url && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img 
              src={newFotografia.url} 
              alt="Vista previa" 
              style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} 
            />
          </Box>
        )}
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Fotografías Registradas ({expediente.fotografias.length})
      </Typography>
      
      {expediente.fotografias.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          No hay fotografías registradas para este expediente.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {expediente.fotografias.map((foto) => (
            <Box key={foto.id || 0} sx={{ width: { xs: '100%', sm: '48%', md: '31%' }}}>
              <Card>
                <CardMedia
                  component={() => (
                    <ImageWithFallback 
                      src={foto.url || (foto.rutaArchivo ? `http://localhost:8080${foto.rutaArchivo}` : '')} 
                      alt={foto.descripcion || 'Fotografía'} 
                    />
                  )}
                  sx={{ height: 140 }}
                />
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {foto.tipo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {foto.descripcion}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewImage(foto.url || (foto.rutaArchivo ? `http://localhost:8080${foto.rutaArchivo}` : ''))}
                    aria-label="Ampliar imagen"
                  >
                    <ZoomInIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteFotografia(foto.id)}
                    aria-label="Eliminar imagen"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color={expediente.fotoPrincipalId === foto.id ? 'warning' : 'default'}
                    onClick={() => handleSetFotoPrincipal(foto.id!)}
                    disabled={expediente.fotoPrincipalId === foto.id}
                    aria-label="Marcar como principal"
                  >
                    {expediente.fotoPrincipalId === foto.id ? (
                      <Tooltip title="Foto principal">
                        <StarIcon />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Marcar como principal">
                        <StarBorderIcon />
                      </Tooltip>
                    )}
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Vista de Imagen</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FotografiasTab; 