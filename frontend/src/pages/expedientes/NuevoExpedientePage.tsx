import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';
import ExpedienteForm from '../../components/expedientes/ExpedienteForm';
import expedienteService from '../../api/expedienteService';

const NuevoExpedientePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Inicializar con valores por defecto para campos requeridos
  const initialExpediente: Partial<Expediente> = {
    // Datos básicos
    numero: '',
    caratula: '',
    descripcion: '',
    fechaIngreso: new Date().toISOString().substring(0, 10),
    tipoCaptura: 'OTRO',
    provincia: '',
    departamento: '',
    estado: 'Abierto',
    observaciones: '',
    tienePrioridad: false,
    esReservado: false,
    jurisdiccion: '',
    instancia: '',
    
    // Campos requeridos por la interfaz
    estadoSituacion: 'Pendiente',
    fuerzaAsignada: '',
    fechaAsignacion: new Date().toISOString().substring(0, 10),
    autorizacionTareas: '',
    fechaAutorizacionTareas: new Date().toISOString().substring(0, 10),
    prioridad: 0,
    recompensa: '',
    fechaOficio: new Date().toISOString().substring(0, 10),
    numeroCausa: '',
    juzgado: '',
    secretaria: '',
    fiscalia: '',
    pais: 'Argentina',
    motivoCaptura: '',
    disposicionJuzgado: '',
    
    // Datos prófugo (inicializar con valores vacíos o por defecto)
    profugoTez: '',
    profugoContexturaFisica: '',
    profugoCabello: '',
    profugoOjos: '',
    profugoEstatura: 0,
    profugoPeso: 0,
    profugoGenero: '',
    profugoNivelEstudios: '',
    profugoSituacionLaboral: '',
    profugoOcupacion: '',
    profugoEstadoCivil: '',
    profugoVinculosFamiliares: '',
    profugoAntecedentes: false,
    profugoAntecedentesDescripcion: '',
    profugoDiscapacidadFlag: false,
    profugoDiscapacidadDesc: '',
    profugoNombreCompleto: '',
    profugoDni: '',
    profugoMarcasVisibles: '',
    profugoProfesionOcupacion: '',
    profugoGrupoSanguineo: '',
    profugoTelefono: '',
    profugoAntecedentesPenales: false,
    profugoDetalleAntecedentes: '',
    profugoSituacionProcesal: '',
    profugoNumeroProntuario: '',
    profugoUltimaVezVisto: '',
    profugoEstabaDetenido: false,
    profugoNumeroDetencionesPrevias: 0,
    
    // Datos del hecho
    fechaHecho: new Date().toISOString().substring(0, 10),
    horaHecho: '12:00',
    lugarHecho: '',
    localidadHecho: '',
    provinciaHecho: '',
    paisHecho: 'Argentina',
    tipoDano: '',
    modusOperandi: '',
    motivacion: '',
    armasUtilizadas: false,
    tipoArmas: '',
    numeroVictimas: 0,
    victimaMenorEdad: false,
    descripcionHecho: '',
    mediaticoFlag: false,
    usoArmasFuegoFlag: false,
    usoArmasBlancasFlag: false,
    peligrosidadFlag: false,
    numeroComplices: 0,
    antecedentesFlag: false,
    reincicenteFlag: false,
    reiteranteFlag: false,
    detalleAntecedentes: '',
    
    // Datos detención
    fechaDetencion: '',
    lugarDetencion: '',
    fuerzaDetencion: '',
    descripcionProcedimiento: '',
    
    // Datos organización
    bandaFlag: false,
    terrorismoFlag: false,
    nombreBanda: '',
    nivelOrganizacion: '',
    ambitoBanda: '',
    capacidadOperativa: '',
    planificacionFlag: false,
    patronesRepetitivos: false,
    conexionesOtrasActividadesFlag: false,
    
    // Datos de impacto
    impactoMediatico: '',
    impactoSocial: '',
    nivelPeligrosidad: 0,
    circulaFlag: false,
    ampliacionCircula: '',
    informacionContextoAdicional: '',
    
    // Colecciones
    delitos: [],
    fotografias: [],
    documentos: [],
    personas: [],
    
    // Metadatos
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const [expediente, setExpediente] = useState<Partial<Expediente>>(initialExpediente);
  
  const handleInputChange = (field: keyof Expediente, value: any) => {
    setExpediente(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar campos requeridos mínimos
      if (!expediente.numero || !expediente.caratula || !expediente.fechaIngreso) {
        throw new Error('Por favor complete los campos obligatorios: Número, Carátula y Fecha de Ingreso');
      }
      
      await expedienteService.create(expediente as Expediente);
      setShowSuccess(true);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate('/expedientes');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error al crear expediente:', err);
      setError(err?.message || 'Ocurrió un error al crear el expediente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/expedientes');
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" gutterBottom>
          Nuevo Expediente
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <ExpedienteForm 
          expediente={expediente as Expediente} 
          onChange={handleInputChange} 
          readOnly={loading}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar Expediente'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={2000} 
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">
          Expediente creado exitosamente
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NuevoExpedientePage; 