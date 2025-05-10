package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.ExpedienteDelitoDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.ExpedienteDelitoMapper;
import com.cufre.expedientes.model.Delito;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.ExpedienteDelito;
import com.cufre.expedientes.repository.DelitoRepository;
import com.cufre.expedientes.repository.ExpedienteDelitoRepository;
import com.cufre.expedientes.repository.ExpedienteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para la gestión de relaciones entre expedientes y delitos
 */
@Service
@Slf4j
public class ExpedienteDelitoService extends AbstractBaseService<ExpedienteDelito, ExpedienteDelitoDTO, Long, ExpedienteDelitoRepository, ExpedienteDelitoMapper> {

    private final ExpedienteRepository expedienteRepository;
    private final DelitoRepository delitoRepository;

    public ExpedienteDelitoService(ExpedienteDelitoRepository repository, ExpedienteDelitoMapper mapper,
                                  ExpedienteRepository expedienteRepository, DelitoRepository delitoRepository) {
        super(repository, mapper);
        this.expedienteRepository = expedienteRepository;
        this.delitoRepository = delitoRepository;
    }

    @Override
    protected ExpedienteDelitoDTO toDto(ExpedienteDelito entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected ExpedienteDelito toEntity(ExpedienteDelitoDTO dto) {
        ExpedienteDelito expedienteDelito = mapper.toEntity(dto);
        setRelaciones(expedienteDelito, dto.getExpedienteId(), dto.getDelitoId());
        return expedienteDelito;
    }

    @Override
    protected ExpedienteDelito updateEntity(ExpedienteDelitoDTO dto, ExpedienteDelito entity) {
        ExpedienteDelito expedienteDelito = mapper.updateEntity(dto, entity);
        setRelaciones(expedienteDelito, dto.getExpedienteId(), dto.getDelitoId());
        return expedienteDelito;
    }

    @Override
    protected String getEntityName() {
        return "ExpedienteDelito";
    }

    private void setRelaciones(ExpedienteDelito expedienteDelito, Long expedienteId, Long delitoId) {
        if (expedienteId != null) {
            Expediente expediente = expedienteRepository.findById(expedienteId)
                    .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con id: " + expedienteId));
            expedienteDelito.setExpediente(expediente);
        }
        
        if (delitoId != null) {
            Delito delito = delitoRepository.findById(delitoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Delito no encontrado con id: " + delitoId));
            expedienteDelito.setDelito(delito);
        }
    }

    /**
     * Busca relaciones por ID de expediente
     * @param expedienteId ID del expediente
     * @return Lista de relaciones con el expediente especificado
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDelitoDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca relaciones por ID de delito
     * @param delitoId ID del delito
     * @return Lista de relaciones con el delito especificado
     */
    @Transactional(readOnly = true)
    public List<ExpedienteDelitoDTO> findByDelitoId(Long delitoId) {
        return repository.findByDelitoId(delitoId).stream()
                .map(this::toDto)
                .toList();
    }
} 