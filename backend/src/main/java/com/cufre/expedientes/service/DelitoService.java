package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.DelitoDTO;
import com.cufre.expedientes.mapper.DelitoMapper;
import com.cufre.expedientes.model.Delito;
import com.cufre.expedientes.repository.DelitoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de delitos
 */
@Service
@Slf4j
public class DelitoService extends AbstractBaseService<Delito, DelitoDTO, Long, DelitoRepository, DelitoMapper> {

    public DelitoService(DelitoRepository repository, DelitoMapper mapper) {
        super(repository, mapper);
    }

    @Override
    protected DelitoDTO toDto(Delito entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Delito toEntity(DelitoDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Delito updateEntity(DelitoDTO dto, Delito entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Delito";
    }

    /**
     * Busca delitos por nombre
     * @param nombre Nombre o parte del nombre
     * @return Lista de delitos con nombre similar
     */
    @Transactional(readOnly = true)
    public List<DelitoDTO> findByNombre(String nombre) {
        return repository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca delitos por código del Código Penal
     * @param codigoCP Código del Código Penal
     * @return Lista de delitos con el código
     */
    @Transactional(readOnly = true)
    public List<DelitoDTO> findByCodigoCP(String codigoCP) {
        if (codigoCP != null && !codigoCP.trim().isEmpty()) {
            return repository.findByCodigoPenalContainingIgnoreCase(codigoCP).stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }
        return null;
    }

    /**
     * Busca delitos por expedienteId
     * @param expedienteId Id del expediente
     * @return Lista de delitos relacionados con el expediente
     */
    @Transactional(readOnly = true)
    public List<DelitoDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 