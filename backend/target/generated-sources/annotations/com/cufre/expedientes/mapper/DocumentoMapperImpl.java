package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.model.Documento;
import com.cufre.expedientes.model.Expediente;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-12T14:52:16-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class DocumentoMapperImpl implements DocumentoMapper {

    @Override
    public DocumentoDTO toDto(Documento documento) {
        if ( documento == null ) {
            return null;
        }

        DocumentoDTO.DocumentoDTOBuilder documentoDTO = DocumentoDTO.builder();

        documentoDTO.expedienteId( documentoExpedienteId( documento ) );
        documentoDTO.id( documento.getId() );
        documentoDTO.tipo( documento.getTipo() );
        documentoDTO.rutaArchivo( documento.getRutaArchivo() );
        documentoDTO.descripcion( documento.getDescripcion() );
        documentoDTO.fecha( documento.getFecha() );
        documentoDTO.nombreArchivo( documento.getNombreArchivo() );
        documentoDTO.tipoArchivo( documento.getTipoArchivo() );
        documentoDTO.tamanio( documento.getTamanio() );

        return documentoDTO.build();
    }

    @Override
    public Documento toEntity(DocumentoDTO documentoDTO) {
        if ( documentoDTO == null ) {
            return null;
        }

        Documento documento = new Documento();

        documento.setId( documentoDTO.getId() );
        documento.setTipo( documentoDTO.getTipo() );
        documento.setRutaArchivo( documentoDTO.getRutaArchivo() );
        documento.setDescripcion( documentoDTO.getDescripcion() );
        documento.setFecha( documentoDTO.getFecha() );
        documento.setNombreArchivo( documentoDTO.getNombreArchivo() );
        documento.setTipoArchivo( documentoDTO.getTipoArchivo() );
        documento.setTamanio( documentoDTO.getTamanio() );

        return documento;
    }

    @Override
    public Documento updateEntity(DocumentoDTO documentoDTO, Documento documento) {
        if ( documentoDTO == null ) {
            return documento;
        }

        documento.setId( documentoDTO.getId() );
        documento.setTipo( documentoDTO.getTipo() );
        documento.setRutaArchivo( documentoDTO.getRutaArchivo() );
        documento.setDescripcion( documentoDTO.getDescripcion() );
        documento.setFecha( documentoDTO.getFecha() );
        documento.setNombreArchivo( documentoDTO.getNombreArchivo() );
        documento.setTipoArchivo( documentoDTO.getTipoArchivo() );
        documento.setTamanio( documentoDTO.getTamanio() );

        return documento;
    }

    private Long documentoExpedienteId(Documento documento) {
        if ( documento == null ) {
            return null;
        }
        Expediente expediente = documento.getExpediente();
        if ( expediente == null ) {
            return null;
        }
        Long id = expediente.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
