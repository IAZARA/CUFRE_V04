import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import expedienteService from '../../api/expedienteService';
import delitoService from '../../api/delitoService';
import { Expediente } from '../../types/expediente.types';

// Importar los componentes de las pestañas
import InformacionBasicaTab from '../../components/expedientes/InformacionBasicaTab';
import InfoCausaJudicialTab from '../../components/expedientes/InfoCausaJudicialTab';
import InfoProfugoTab from '../../components/expedientes/InfoProfugoTab';
import InfoHechoTab from '../../components/expedientes/InfoHechoTab';
import InfoDetencionTab from '../../components/expedientes/InfoDetencionTab';
import InfoOrganizacionTab from '../../components/expedientes/InfoOrganizacionTab';
import InfoImpactoTab from '../../components/expedientes/InfoImpactoTab';
import FotografiasTab from '../../components/expedientes/FotografiasTab';
import DocumentosTab from '../../components/expedientes/DocumentosTab';
import PersonasTab from '../../components/expedientes/PersonasTab';
import DelitosTab from '../../components/expedientes/DelitosTab';
import FugaTab from '../../components/expedientes/FugaTab';
import DetencionGeoTab from '../../components/expedientes/DetencionGeoTab';

// Interfaz para las pestañas
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente para el contenido de cada pestaña
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ExpedienteFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [expediente, setExpediente] = useState<Expediente>({
    numero: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    prioridad: 5,
    caratula: '',
    descripcion: '',
    estadoSituacion: '',
    pais: 'Argentina',
    provincia: '',
    jurisdiccion: '',
    fotografias: [],
    documentos: [],
    personas: [],
    delitos: [],
    // Propiedades de causa judicial
    tipoCaptura: '',
    fiscalia: '',
    secretaria: '',
    juzgado: '',
    numeroCausa: '',
    // Propiedades del hecho
    lugarHecho: '',
    fechaHecho: '',
    descripcionHecho: '',
    tipoDano: '',
    // Propiedades de la detención
    fuerzaAsignada: '',
    fuerzaDetencion: '',
    fechaDetencion: '',
    lugarDetencion: '',
    // Todos los campos requeridos según la interfaz
    fechaAsignacion: '',
    fechaAutorizacionTareas: '',
    fechaOficio: '',
    disposicionJuzgado: '',
    autorizacionTareas: '',
    descripcionProcedimiento: '',
    motivoCaptura: '',
    recompensa: '',
    
    // Datos adicionales que deben tener valores por defecto
    horaHecho: '',
    localidadHecho: '',
    provinciaHecho: '',
    paisHecho: '',
    modusOperandi: '',
    motivacion: '',
    armasUtilizadas: false,
    tipoArmas: '',
    numeroVictimas: 0,
    victimaMenorEdad: false,
    
    // Datos del prófugo
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
    
    // Datos de organización
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
    nivelPeligrosidad: 5,
    circulaFlag: false,
    ampliacionCircula: '',
    informacionContextoAdicional: '',
    
    // Campos adicionales del hecho
    mediaticoFlag: false,
    usoArmasFuegoFlag: false,
    usoArmasBlancasFlag: false,
    peligrosidadFlag: false,
    numeroComplices: 0,
    antecedentesFlag: false,
    reincicenteFlag: false,
    reiteranteFlag: false,
    detalleAntecedentes: '',
    
    // Campos adicionales requeridos
    created_at: '',
    updated_at: '',
    tipoVictima: '',
    nivelIncidenciaZona: '',
    institucionSensibleCercana: '',
    recursosLimitados: '',
    areaFronteriza: '',
    impactoPercepcion: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [delitosOriginales, setDelitosOriginales] = useState<{ id: number }[]>([]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchExpediente(parseInt(id));
    }
  }, [id]);

  const fetchExpediente = async (id: number) => {
    setLoading(true);
    try {
      const data = await expedienteService.getExpedienteById(id);
      console.log('Expediente cargado:', data);
      
      // Asegurarse de que las colecciones existan como arrays vacíos si son null
      if (!data.fotografias) data.fotografias = [];
      if (!data.documentos) data.documentos = [];
      if (!data.personas) data.personas = [];
      if (!data.delitos) data.delitos = [];
      
      setExpediente(data);
      // Guardar los delitos originales SOLO al cargar el expediente
      setDelitosOriginales(data.delitos ? [...data.delitos] : []);
      
      // Cargar fotografías independientemente si el array está vacío
      try {
        const fotos = await expedienteService.getFotografias(id);
        if (fotos && fotos.length > 0) {
          console.log('Fotografías cargadas separadamente:', fotos);
          setExpediente(prev => ({
            ...prev,
            fotografias: fotos
          }));
        }
      } catch (error) {
        console.error('Error al cargar fotografías:', error);
      }
      
      // Cargar documentos independientemente si el array está vacío
      try {
        const docs = await expedienteService.getDocumentos(id);
        if (docs && docs.length > 0) {
          console.log('Documentos cargados separadamente:', docs);
          setExpediente(prev => ({
            ...prev,
            documentos: docs
          }));
        }
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      }
      
      // Cargar personas relacionadas independientemente si el array está vacío
      try {
        const personas = await expedienteService.getPersonas(id);
        if (personas && personas.length > 0) {
          console.log('Personas cargadas separadamente:', personas);
          setExpediente(prev => ({
            ...prev,
            personas: personas
          }));
        }
      } catch (error) {
        console.error('Error al cargar personas:', error);
      }
      
    } catch (error) {
      console.error('Error al cargar expediente:', error);
      setError('Error al cargar los datos del expediente. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    navigate('/expedientes');
  };

  const handleFieldChange = (field: keyof Expediente, value: any) => {
    setExpediente(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (id && id !== 'new') {
        // Sincronizar delitos
        const actuales = expediente.delitos?.map(d => d.id) || [];
        const originales = delitosOriginales?.map(d => d.id) || [];
        // Delitos a asociar: SOLO los que no estaban antes
        const aAsociar = actuales.filter(idDelito => idDelito !== undefined && idDelito !== null && !originales.includes(idDelito));
        // Delitos a desasociar: SOLO los que estaban antes y ya no están
        const aDesasociar = originales.filter(idDelito => idDelito !== undefined && idDelito !== null && !actuales.includes(idDelito));

        // Debug: mostrar los ids
        console.log("Delitos actuales:", actuales);
        console.log("Delitos originales:", originales);
        console.log("Delitos a asociar (solo nuevos):", aAsociar);
        console.log("Delitos a desasociar:", aDesasociar);

        // Asociar nuevos delitos
        for (const delitoId of aAsociar) {
          if (delitoId !== undefined && delitoId !== null) {
            await delitoService.asociarDelitoExpediente({ expedienteId: parseInt(id), delitoId });
          } else {
            console.error("Intentando asociar un delito sin ID:", delitoId);
          }
        }
        // Desasociar delitos quitados
        if (aDesasociar.length > 0) {
          // Obtener los ExpedienteDelito actuales para saber los IDs de relación
          const delitosAsociados = await delitoService.getDelitosPorExpediente(parseInt(id));
          for (const delitoId of aDesasociar) {
            const rel = delitosAsociados.find((d: any) => d.delitoId === delitoId);
            if (rel && rel.id) {
              await delitoService.desasociarDelitoExpediente(rel.id);
            }
          }
        }
        await expedienteService.updateExpediente(parseInt(id), expediente);
        setSuccess('Expediente actualizado correctamente');
        // Actualizar delitosOriginales tras guardar exitosamente
        setDelitosOriginales(expediente.delitos ? [...expediente.delitos] : []);
      } else {
        const newExpediente = await expedienteService.createExpediente(expediente);
        setSuccess('Expediente creado correctamente');
        // Opcional: redirigir al expediente recién creado
        // navigate(`/expedientes/${newExpediente.id}`);
      }
      // Recargar delitos asociados y actualizar delitosOriginales
      if (id && id !== 'new') {
        const asociados = await delitoService.getDelitosPorExpediente(Number(id));
        setDelitosOriginales(asociados.map((d: any) => d.delitoId || d.id));
      }
    } catch (err: any) {
      console.error('Error al guardar:', err);
      if (err instanceof Error && err.message === 'El delito ya está asociado a este expediente.') {
        setSuccess('Expediente actualizado correctamente');
      } else {
        setError('Error al guardar los datos. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          Volver
        </Button>
        <Typography variant="h5" component="h1">
          {id && id !== 'new' ? 'Editar Expediente' : 'Nuevo Expediente'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          Guardar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Información Básica" {...a11yProps(0)} />
            <Tab label="Causa Judicial" {...a11yProps(1)} />
            <Tab label="Persona" {...a11yProps(2)} />
            <Tab label="Prófugo" {...a11yProps(3)} />
            <Tab label="Información del Hecho" {...a11yProps(4)} />
            <Tab label="Delito" {...a11yProps(5)} />
            <Tab label="Detención" {...a11yProps(6)} />
            <Tab label="Organización" {...a11yProps(7)} />
            <Tab label="Impacto" {...a11yProps(8)} />
            <Tab label="Fotografías" {...a11yProps(9)} />
            <Tab label="Documentos" {...a11yProps(10)} />
            <Tab label="Punto de Fuga" {...a11yProps(11)} />
            <Tab label="Punto de Detención" {...a11yProps(12)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <InformacionBasicaTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <InfoCausaJudicialTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <PersonasTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <InfoProfugoTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <InfoHechoTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          <DelitosTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={6}>
          <InfoDetencionTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={7}>
          <InfoOrganizacionTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={8}>
          <InfoImpactoTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={9}>
          <FotografiasTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={10}>
          <DocumentosTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        <TabPanel value={tabValue} index={11}>
          <FugaTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
        <TabPanel value={tabValue} index={12}>
          <DetencionGeoTab expediente={expediente} onChange={handleFieldChange} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ExpedienteFormPage; 