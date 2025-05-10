import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';
import InformacionBasicaTab from './InformacionBasicaTab';
import InfoCausaJudicialTab from './InfoCausaJudicialTab';
import InfoProfugoTab from './InfoProfugoTab';
import InfoHechoTab from './InfoHechoTab';
import InfoDetencionTab from './InfoDetencionTab';
import InfoOrganizacionTab from './InfoOrganizacionTab';
import InfoImpactoTab from './InfoImpactoTab';
import PersonasTab from './PersonasTab';
import DocumentosTab from './DocumentosTab';
import FotografiasTab from './FotografiasTab';
import DelitosTab from './DelitosTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Panel para el contenido de cada tab
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expediente-tabpanel-${index}`}
      aria-labelledby={`expediente-tab-${index}`}
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

// Propiedades para el componente principal
interface ExpedienteFormProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
  readOnly?: boolean;
}

const ExpedienteForm: React.FC<ExpedienteFormProps> = ({ expediente, onChange, readOnly = false }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Renderizar los tabs que no requieren expedienteId
  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return <InformacionBasicaTab expediente={expediente} onChange={onChange} />;
      case 1:
        return <InfoCausaJudicialTab expediente={expediente} onChange={onChange} />;
      case 2:
        return <InfoProfugoTab expediente={expediente} onChange={onChange} />;
      case 3:
        return <InfoHechoTab expediente={expediente} onChange={onChange} />;
      case 4:
        return <InfoDetencionTab expediente={expediente} onChange={onChange} />;
      case 5:
        return <InfoOrganizacionTab expediente={expediente} onChange={onChange} />;
      case 6:
        return <InfoImpactoTab expediente={expediente} onChange={onChange} />;
      case 7:
        return expediente.id ? <DelitosTab expediente={expediente} onChange={onChange} /> : <p>Debe guardar el expediente primero</p>;
      case 8:
        return <PersonasTab expediente={expediente} onChange={onChange} />;
      case 9:
        return <DocumentosTab expediente={expediente} onChange={onChange} />;
      case 10:
        return <FotografiasTab expediente={expediente} onChange={onChange} />;
      default:
        return null;
    }
  };

  // Lista de tabs para mostrar
  const tabs = [
    { id: 0, label: 'Información Básica' },
    { id: 1, label: 'Causa Judicial' },
    { id: 2, label: 'Información del Prófugo' },
    { id: 3, label: 'Información del Hecho' },
    { id: 4, label: 'Información de Detención' },
    { id: 5, label: 'Organización Criminal' },
    { id: 6, label: 'Impacto' },
    { id: 7, label: 'Delitos' },
    { id: 8, label: 'Personas Relacionadas' },
    { id: 9, label: 'Documentos' },
    { id: 10, label: 'Fotografías' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ borderRadius: '4px', mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="expediente tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} id={`expediente-tab-${tab.id}`} />
          ))}
        </Tabs>

        {tabs.map((tab) => (
          <TabPanel key={tab.id} value={currentTab} index={tab.id}>
            {renderTabContent(tab.id)}
          </TabPanel>
        ))}
      </Paper>
    </Box>
  );
};

export default ExpedienteForm; 