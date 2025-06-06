package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.DelitoDTO;
import com.cufre.expedientes.dto.ExpedienteDTO;
import com.cufre.expedientes.dto.ExpedienteDelitoDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.ExpedienteMapper;
import com.cufre.expedientes.mapper.PersonaMapper;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.PersonaExpedienteRepository;
import com.cufre.expedientes.mapper.PersonaExpedienteMapper;
import com.cufre.expedientes.util.PriorityCalculator;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de expedientes
 */
@Service
@Slf4j
public class ExpedienteService extends AbstractBaseService<Expediente, ExpedienteDTO, Long, ExpedienteRepository, ExpedienteMapper> {

    private final DelitoService delitoService;
    private final ExpedienteDelitoService expedienteDelitoService;
    private final PersonaMapper personaMapper;
    private final DomicilioService domicilioService;
    private final PersonaExpedienteRepository personaExpedienteRepository;
    private final PersonaExpedienteMapper personaExpedienteMapper;
    private final ActividadSistemaService actividadSistemaService;

    public ExpedienteService(
            ExpedienteRepository repository, 
            ExpedienteMapper mapper,
            DelitoService delitoService,
            ExpedienteDelitoService expedienteDelitoService,
            PersonaMapper personaMapper,
            DomicilioService domicilioService,
            PersonaExpedienteRepository personaExpedienteRepository,
            PersonaExpedienteMapper personaExpedienteMapper,
            ActividadSistemaService actividadSistemaService) {
        super(repository, mapper);
        this.delitoService = delitoService;
        this.expedienteDelitoService = expedienteDelitoService;
        this.personaMapper = personaMapper;
        this.domicilioService = domicilioService;
        this.personaExpedienteRepository = personaExpedienteRepository;
        this.personaExpedienteMapper = personaExpedienteMapper;
        this.actividadSistemaService = actividadSistemaService;
    }

    @Override
    protected ExpedienteDTO toDto(Expediente entity) {
        ExpedienteDTO dto = mapper.toDto(entity);
        // Poblar manualmente los delitos asociados
        List<DelitoDTO> delitos = delitoService.findByExpedienteId(entity.getId());
        dto.setDelitos(delitos);
        return dto;
    }

    @Override
    protected Expediente toEntity(ExpedienteDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Expediente updateEntity(ExpedienteDTO dto, Expediente entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Expediente";
    }
    
    /**
     * Sobrescribe el método findById del servicio base para cargar manualmente
     * las relaciones muchos-a-muchos de personas y expedientes.
     */
    @Override
    @Transactional(readOnly = true)
    public ExpedienteDTO findById(Long id) {
        Expediente entity = ((ExpedienteRepository) repository).findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con ID: " + id));

        // Inicializar colecciones explícitamente
        Hibernate.initialize(entity.getFotografias());
        Hibernate.initialize(entity.getDocumentos());

        return toDto(entity);
    }

    /**
     * Busca expedientes por rango de fechas de ingreso
     * @param fechaInicio Fecha de inicio
     * @param fechaFin Fecha de fin
     * @return Lista de expedientes en el rango de fechas
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findByFechaIngresoBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findByFechaIngresoBetween(fechaInicio, fechaFin).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca expedientes por número de expediente
     * @param numeroExpediente Número de expediente
     * @return Lista de expedientes con el número indicado
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findByNumeroExpediente(String numeroExpediente) {
        return repository.findByNumeroContainingIgnoreCase(numeroExpediente).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca expedientes con personaId
     * @param personaId Id de la persona
     * @return Lista de expedientes relacionados con la persona
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findByPersonaId(Long personaId) {
        return repository.findByPersonaId(personaId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca expedientes por delitoId
     * @param delitoId Id del delito
     * @return Lista de expedientes relacionados con el delito
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findByDelitoId(Long delitoId) {
        List<Expediente> expedientes = ((ExpedienteRepository) repository).findByDelitoId(delitoId);
        return expedientes.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene estadísticas de expedientes por provincia
     * @return Mapa con provincia y cantidad de expedientes
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getEstadisticasPorProvincia() {
        return repository.countByProvincia().stream()
                .collect(Collectors.toMap(
                        item -> (String) item[0],
                        item -> (Long) item[1]
                ));
    }
    
    /**
     * Obtiene estadísticas de expedientes por período
     * @param fechaInicio Fecha de inicio
     * @param fechaFin Fecha de fin
     * @return Cantidad de expedientes en el período
     */
    @Transactional(readOnly = true)
    public Long getEstadisticasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.countByFechaIngresoBetween(fechaInicio, fechaFin);
    }

    /**
     * Crea un nuevo expediente calculando la prioridad antes de guardar
     */
    @Transactional
    public ExpedienteDTO create(ExpedienteDTO dto) {
        Expediente entity = toEntity(dto);
        // Calcular prioridad antes de guardar
        entity.setPrioridad(PriorityCalculator.calcularPrioridad(entity));
        entity = repository.save(entity);
        ExpedienteDTO result = toDto(entity);
        // Registrar actividad de creación de expediente
        String usuario = obtenerUsuarioActual();
        actividadSistemaService.registrarActividad(usuario, "CREAR_EXPEDIENTE", "Expediente creado: " + result.getNumero());
        return result;
    }

    /**
     * Sobrescribe el método update del servicio base para mantener las relaciones
     * existentes (fotografías, documentos, personas) al actualizar el expediente
     */
    @Override
    @Transactional
    public ExpedienteDTO update(Long id, ExpedienteDTO dto) {
        Expediente existingEntity = ((ExpedienteRepository) repository).findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException(getEntityName() + " no encontrado con id: " + id));
        // Inicializamos las colecciones manualmente para evitar MultipleBagFetchException
        try {
            if (existingEntity.getFotografias() != null) existingEntity.getFotografias().size();
            if (existingEntity.getDocumentos() != null) existingEntity.getDocumentos().size();
            if (existingEntity.getPersonaExpedientes() != null) existingEntity.getPersonaExpedientes().size();
            if (existingEntity.getExpedienteDelitos() != null) existingEntity.getExpedienteDelitos().size();
        } catch (Exception e) {
            log.warn("Error al inicializar colecciones del expediente: {}", e.getMessage());
        }
        Expediente updatedEntity = updateEntity(dto, existingEntity);
        updatedEntity = repository.save(updatedEntity);
        ExpedienteDTO result = toDto(updatedEntity);
        // Registrar actividad de edición de expediente
        String usuario = obtenerUsuarioActual();
        actividadSistemaService.registrarActividad(usuario, "EDITAR_EXPEDIENTE", "Expediente editado: " + result.getNumero());
        return result;
    }

    /**
     * Busca un expediente con toda su información completa, incluyendo relaciones.
     * 
     * @param id El ID del expediente
     * @return DTO completo con la información del expediente y todas sus relaciones cargadas
     */
    @Transactional(readOnly = true)
    public ExpedienteDTO findByIdComplete(Long id) {
        log.debug("Buscando expediente completo con ID: {}", id);
        
        Expediente entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con ID: " + id));
        
        // Inicializar manualmente todas las colecciones
        Hibernate.initialize(entity.getPersonaExpedientes());
        Hibernate.initialize(entity.getFotografias());
        Hibernate.initialize(entity.getDocumentos());
        
        return toDto(entity);
    }

    /**
     * Encuentra todos los delitos asociados a un expediente
     * @param expedienteId ID del expediente
     * @return Lista de DelitoDTO
     */
    @Transactional(readOnly = true)
    public List<DelitoDTO> findDelitosByExpedienteId(Long expedienteId) {
        return delitoService.findByExpedienteId(expedienteId);
    }
    
    /**
     * Encuentra todas las fotografías asociadas a un expediente
     * @param expedienteId ID del expediente
     * @return Lista de FotografiaDTO
     */
    @Transactional(readOnly = true)
    public List<com.cufre.expedientes.dto.FotografiaDTO> findFotografiasByExpedienteId(Long expedienteId) {
        log.info("Buscando fotografías para expediente con ID: {}", expedienteId);
        Expediente expediente = repository.findById(expedienteId)
                .orElseThrow(() -> new com.cufre.expedientes.exception.ResourceNotFoundException("Expediente no encontrado con ID: " + expedienteId));
        
        // Inicializar colección de fotografías
        Hibernate.initialize(expediente.getFotografias());
        
        return expediente.getFotografias().stream()
                .map(fotografia -> {
                    com.cufre.expedientes.dto.FotografiaDTO dto = new com.cufre.expedientes.dto.FotografiaDTO();
                    dto.setId(fotografia.getId());
                    dto.setExpedienteId(expedienteId);
                    dto.setRutaArchivo(fotografia.getRutaArchivo());
                    dto.setDescripcion(fotografia.getDescripcion());
                    dto.setNombreArchivo(fotografia.getNombreArchivo());
                    dto.setTipoArchivo(fotografia.getTipoArchivo());
                    dto.setFecha(fotografia.getFecha());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Encuentra todos los documentos asociados a un expediente
     * @param expedienteId ID del expediente
     * @return Lista de DocumentoDTO
     */
    @Transactional(readOnly = true)
    public List<com.cufre.expedientes.dto.DocumentoDTO> findDocumentosByExpedienteId(Long expedienteId) {
        log.info("Buscando documentos para expediente con ID: {}", expedienteId);
        Expediente expediente = repository.findById(expedienteId)
                .orElseThrow(() -> new com.cufre.expedientes.exception.ResourceNotFoundException("Expediente no encontrado con ID: " + expedienteId));
        
        // Inicializar colección de documentos
        Hibernate.initialize(expediente.getDocumentos());
        
        return expediente.getDocumentos().stream()
                .map(documento -> {
                    com.cufre.expedientes.dto.DocumentoDTO dto = new com.cufre.expedientes.dto.DocumentoDTO();
                    dto.setId(documento.getId());
                    dto.setExpedienteId(expedienteId);
                    dto.setRutaArchivo(documento.getRutaArchivo());
                    dto.setTipo(documento.getTipo());
                    dto.setDescripcion(documento.getDescripcion());
                    dto.setNombreArchivo(documento.getNombreArchivo());
                    dto.setTipoArchivo(documento.getTipoArchivo());
                    dto.setFecha(documento.getFecha());
                    dto.setTamanio(documento.getTamanio());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Encuentra todas las personas asociadas a un expediente
     * @param expedienteId ID del expediente
     * @return Lista de PersonaExpedienteDTO
     */
    @Transactional(readOnly = true)
    public List<com.cufre.expedientes.dto.PersonaExpedienteDTO> findPersonasByExpedienteId(Long expedienteId) {
        log.info("Buscando personas para expediente con ID: {} (usando EntityGraph)", expedienteId);
        return personaExpedienteRepository.findByExpedienteId(expedienteId)
            .stream()
            .map(personaExpedienteMapper::toDto)
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Asocia un delito a un expediente
     * @param expedienteDelitoDTO Datos de la relación
     * @return DTO con los datos de la relación creada
     */
    @Transactional
    public ExpedienteDelitoDTO addDelito(ExpedienteDelitoDTO expedienteDelitoDTO) {
        log.info("Asociando delito: expedienteId={}, delitoId={}", expedienteDelitoDTO.getExpedienteId(), expedienteDelitoDTO.getDelitoId());
        return expedienteDelitoService.save(expedienteDelitoDTO);
    }
    
    /**
     * Elimina la relación entre un expediente y un delito
     * @param expedienteId ID del expediente
     * @param delitoId ID del delito
     */
    @Transactional
    public void removeDelito(Long expedienteId, Long delitoId) {
        // Buscar la relación por expedienteId y delitoId
        List<ExpedienteDelitoDTO> relaciones = expedienteDelitoService.findByExpedienteId(expedienteId);
        
        for (ExpedienteDelitoDTO relacion : relaciones) {
            if (relacion.getDelitoId().equals(delitoId)) {
                expedienteDelitoService.delete(relacion.getId());
                break;
            }
        }
    }

    @Transactional(readOnly = true)
    public ExpedienteDTO getExpedienteById(Long id) {
        log.info("Buscando expediente con ID: {}", id);
        Expediente expediente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con ID: " + id));
        
        // Cargar explícitamente las colecciones para asegurar que estén inicializadas
        Hibernate.initialize(expediente.getFotografias());
        Hibernate.initialize(expediente.getDocumentos());
        Hibernate.initialize(expediente.getPersonaExpedientes());
        
        // Mapear a DTO incluyendo toda la información relacionada
        return toDto(expediente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findAll() {
        List<Expediente> expedientes = repository.findAll();
        List<ExpedienteDTO> dtos = expedientes.stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
        // Poblar el campo 'profugos' en cada DTO
        for (int i = 0; i < expedientes.size(); i++) {
            Expediente expediente = expedientes.get(i);
            ExpedienteDTO dto = dtos.get(i);
            if (expediente.getPersonaExpedientes() != null) {
                List<String> profugos = expediente.getPersonaExpedientes().stream()
                    .filter(pe -> pe.getTipoRelacion() != null && pe.getTipoRelacion().trim().equalsIgnoreCase("Imputado"))
                    .map(pe -> {
                        if (pe.getPersona() != null) {
                            String nombre = pe.getPersona().getNombre() != null ? pe.getPersona().getNombre() : "";
                            String apellido = pe.getPersona().getApellido() != null ? pe.getPersona().getApellido() : "";
                            return (nombre + " " + apellido).trim();
                        }
                        return null;
                    })
                    .filter(n -> n != null && !n.isEmpty())
                    .collect(java.util.stream.Collectors.toList());
                dto.setProfugos(profugos);
            }
        }
        return dtos;
    }

    /**
     * Actualiza la foto principal de un expediente
     */
    @Transactional
    public void setFotoPrincipal(Long expedienteId, Long fotoId) {
        Expediente expediente = repository.findById(expedienteId)
            .orElseThrow(() -> new com.cufre.expedientes.exception.ResourceNotFoundException("Expediente no encontrado con ID: " + expedienteId));
        expediente.setFotoPrincipalId(fotoId);
        repository.save(expediente);
    }

    /**
     * Devuelve los expedientes más buscados (mayor prioridad primero) solo con estado CAPTURA VIGENTE
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> findMasBuscados(int limit) {
        List<Expediente> expedientes = repository.findAllByEstadoSituacionOrderByPrioridadAsc("CAPTURA VIGENTE", PageRequest.of(0, limit));
        return expedientes.stream().map(this::toDto).collect(Collectors.toList());
    }

    /**
     * Búsqueda avanzada de expedientes y personas
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDTO> busquedaAvanzada(String nombre, String apellido, String numeroExpediente, String tipoBusqueda, String numeroIdentificacion) {
        List<Expediente> expedientesPorNumero = new ArrayList<>();
        List<Expediente> expedientesPorPersona = new ArrayList<>();
        boolean buscarPorExpediente = tipoBusqueda == null || tipoBusqueda.equalsIgnoreCase("expediente") || tipoBusqueda.equalsIgnoreCase("ambos");
        boolean buscarPorPersona = tipoBusqueda == null || tipoBusqueda.equalsIgnoreCase("persona") || tipoBusqueda.equalsIgnoreCase("ambos");

        // Buscar por número de expediente
        if (buscarPorExpediente && numeroExpediente != null && !numeroExpediente.isEmpty()) {
            expedientesPorNumero = repository.findByNumeroContainingIgnoreCase(numeroExpediente);
            // Si no encuentra nada, intenta buscar quitando ceros a la izquierda
            if (expedientesPorNumero.isEmpty()) {
                String sinCeros = numeroExpediente.replaceFirst("^0+(?!$)", "");
                if (!sinCeros.equals(numeroExpediente)) {
                    expedientesPorNumero = repository.findByNumeroContainingIgnoreCase(sinCeros);
                }
            }
        }

        // Buscar por persona asociada
        if (buscarPorPersona && ( (nombre != null && !nombre.isEmpty()) || (apellido != null && !apellido.isEmpty()) || (numeroIdentificacion != null && !numeroIdentificacion.isEmpty()) )) {
            expedientesPorPersona = personaExpedienteRepository.findExpedientesByPersonaDatos(nombre, apellido, numeroIdentificacion);
        }

        // Unir resultados sin duplicados
        List<Expediente> resultado = new ArrayList<>();
        if (!expedientesPorNumero.isEmpty()) resultado.addAll(expedientesPorNumero);
        for (Expediente e : expedientesPorPersona) {
            if (resultado.stream().noneMatch(x -> x.getId().equals(e.getId()))) {
                resultado.add(e);
            }
        }
        // Si no hay filtros, retorna vacío
        if (resultado.isEmpty() && ( (numeroExpediente == null || numeroExpediente.isEmpty()) && (nombre == null || nombre.isEmpty()) && (apellido == null || apellido.isEmpty()) && (numeroIdentificacion == null || numeroIdentificacion.isEmpty()) )) {
            return new ArrayList<>();
        }
        // Mapear a DTO
        return resultado.stream().map(this::toDto).collect(Collectors.toList());
    }

    /**
     * Obtiene el email del usuario autenticado actual
     */
    private String obtenerUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "desconocido";
    }

    @Override
    @Transactional
    public ExpedienteDTO save(ExpedienteDTO dto) {
        return this.create(dto);
    }
} 