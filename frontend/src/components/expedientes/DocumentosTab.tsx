import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  AttachFile as AttachFileIcon, 
  Delete as DeleteIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Description as TextIcon
} from '@mui/icons-material';
import { Expediente, Documento } from '../../types/expediente.types';
import expedienteService from '../../api/expedienteService';

interface DocumentosTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposDocumento = [
  'Orden de Captura',
  'Orden Judicial',
  'Oficio',
  'Informe',
  'Peritaje',
  'Declaración',
  'Denuncia',
  'Sentencia',
  'Otro'
];

const DocumentosTab: React.FC<DocumentosTabProps> = ({ expediente, onChange }) => {
  const [newDocumento, setNewDocumento] = useState<Partial<Documento>>({
    url: '',
    nombre: '',
    tipo: '',
    descripcion: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDocumento(prev => ({
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
          setNewDocumento(prev => ({
            ...prev,
            file: file, // Guardar el archivo para enviar luego
            url: event.target?.result as string,
            nombre: file.name
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocumento = async () => {
    if (!newDocumento.url || !newDocumento.tipo || !newDocumento.nombre || !expediente.id || !newDocumento.file) {
      setError("Falta información o el expediente no ha sido guardado aún");
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Preparar FormData para enviar al servidor
      const formData = new FormData();
      formData.append('file', newDocumento.file);
      formData.append('tipo', newDocumento.tipo);
      formData.append('descripcion', newDocumento.descripcion || '');
      
      // Llamar a la API para subir el documento
      const uploadedDoc = await expedienteService.uploadDocumento(expediente.id, formData);
      
      // Actualizar el estado con la respuesta del servidor
      const updatedDocumentos = [
        ...expediente.documentos,
        {
          id: uploadedDoc.id,
          url: newDocumento.url, // Mantener la URL para visualización
          nombre: newDocumento.nombre,
          tipo: newDocumento.tipo,
          descripcion: newDocumento.descripcion || ''
        }
      ];
      
      onChange('documentos', updatedDocumentos);
      
      // Resetear formulario
      setNewDocumento({
        url: '',
        nombre: '',
        tipo: '',
        descripcion: ''
      });
    } catch (error) {
      console.error('Error al subir documento:', error);
      setError('Error al subir el documento. Por favor, intente nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocumento = (id: number | undefined) => {
    if (!id) return;
    
    const updatedDocumentos = expediente.documentos.filter(doc => doc.id !== id);
    onChange('documentos', updatedDocumentos);
  };

  const handleViewDocumento = (url: string) => {
    window.open(url, '_blank');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return <PdfIcon />;
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return <TextIcon />;
    return <FileIcon />;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Documentos
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Agregar Nuevo Documento
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ flexGrow: 1, minWidth: '200px' }}
              disabled={uploading || !expediente.id}
            >
              Seleccionar Archivo
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            
            <TextField
              select
              label="Tipo de Documento"
              name="tipo"
              value={newDocumento.tipo || ''}
              onChange={handleInputChange}
              sx={{ flexGrow: 2 }}
              disabled={uploading}
            >
              {tiposDocumento.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={newDocumento.descripcion || ''}
            onChange={handleInputChange}
            multiline
            rows={2}
            disabled={uploading}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {newDocumento.nombre && (
              <Typography variant="body2" color="text.secondary">
                Archivo seleccionado: {newDocumento.nombre}
              </Typography>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDocumento}
              disabled={uploading || !newDocumento.url || !newDocumento.tipo || !expediente.id}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : 'Agregar Documento'}
            </Button>
          </Box>
        </Stack>
        
        {!expediente.id && (
          <Typography color="error" sx={{ mt: 2 }}>
            Debe guardar el expediente antes de poder agregar documentos.
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Documentos Registrados ({expediente.documentos.length})
      </Typography>
      
      {expediente.documentos.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          No hay documentos registrados para este expediente.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {expediente.documentos.map((doc) => (
            <Card key={doc.id} variant="outlined">
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getFileIcon(doc.nombre)}
                  <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>
                    {doc.nombre}
                  </Typography>
                  <Chip label={doc.tipo} size="small" color="primary" variant="outlined" />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {doc.descripcion || 'Sin descripción'}
                </Typography>
              </CardContent>
              
              <CardActions>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewDocumento(doc.url)}
                  aria-label="Ver documento"
                >
                  <RemoveRedEyeIcon />
                </IconButton>
                
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteDocumento(doc.id)}
                  aria-label="Eliminar documento"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DocumentosTab; 