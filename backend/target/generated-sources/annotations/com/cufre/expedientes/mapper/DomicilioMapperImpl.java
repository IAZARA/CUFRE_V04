package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.model.Persona;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-11T11:19:39-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class DomicilioMapperImpl implements DomicilioMapper {

    @Override
    public DomicilioDTO toDto(Domicilio domicilio) {
        if ( domicilio == null ) {
            return null;
        }

        DomicilioDTO.DomicilioDTOBuilder domicilioDTO = DomicilioDTO.builder();

        domicilioDTO.personaId( domicilioPersonaId( domicilio ) );
        domicilioDTO.id( domicilio.getId() );
        domicilioDTO.calle( domicilio.getCalle() );
        domicilioDTO.numero( domicilio.getNumero() );
        domicilioDTO.piso( domicilio.getPiso() );
        domicilioDTO.departamento( domicilio.getDepartamento() );
        domicilioDTO.barrio( domicilio.getBarrio() );
        domicilioDTO.codigoPostal( domicilio.getCodigoPostal() );
        domicilioDTO.localidad( domicilio.getLocalidad() );
        domicilioDTO.provincia( domicilio.getProvincia() );
        domicilioDTO.pais( domicilio.getPais() );
        domicilioDTO.tipo( domicilio.getTipo() );
        domicilioDTO.esPrincipal( domicilio.getEsPrincipal() );
        domicilioDTO.descripcion( domicilio.getDescripcion() );

        return domicilioDTO.build();
    }

    @Override
    public Domicilio toEntity(DomicilioDTO domicilioDTO) {
        if ( domicilioDTO == null ) {
            return null;
        }

        Domicilio domicilio = new Domicilio();

        domicilio.setId( domicilioDTO.getId() );
        domicilio.setCalle( domicilioDTO.getCalle() );
        domicilio.setNumero( domicilioDTO.getNumero() );
        domicilio.setPiso( domicilioDTO.getPiso() );
        domicilio.setDepartamento( domicilioDTO.getDepartamento() );
        domicilio.setBarrio( domicilioDTO.getBarrio() );
        domicilio.setCodigoPostal( domicilioDTO.getCodigoPostal() );
        domicilio.setLocalidad( domicilioDTO.getLocalidad() );
        domicilio.setProvincia( domicilioDTO.getProvincia() );
        domicilio.setPais( domicilioDTO.getPais() );
        domicilio.setTipo( domicilioDTO.getTipo() );
        domicilio.setEsPrincipal( domicilioDTO.getEsPrincipal() );
        domicilio.setDescripcion( domicilioDTO.getDescripcion() );

        return domicilio;
    }

    @Override
    public Domicilio updateEntity(DomicilioDTO domicilioDTO, Domicilio domicilio) {
        if ( domicilioDTO == null ) {
            return domicilio;
        }

        domicilio.setId( domicilioDTO.getId() );
        domicilio.setCalle( domicilioDTO.getCalle() );
        domicilio.setNumero( domicilioDTO.getNumero() );
        domicilio.setPiso( domicilioDTO.getPiso() );
        domicilio.setDepartamento( domicilioDTO.getDepartamento() );
        domicilio.setBarrio( domicilioDTO.getBarrio() );
        domicilio.setCodigoPostal( domicilioDTO.getCodigoPostal() );
        domicilio.setLocalidad( domicilioDTO.getLocalidad() );
        domicilio.setProvincia( domicilioDTO.getProvincia() );
        domicilio.setPais( domicilioDTO.getPais() );
        domicilio.setTipo( domicilioDTO.getTipo() );
        domicilio.setEsPrincipal( domicilioDTO.getEsPrincipal() );
        domicilio.setDescripcion( domicilioDTO.getDescripcion() );

        return domicilio;
    }

    private Long domicilioPersonaId(Domicilio domicilio) {
        if ( domicilio == null ) {
            return null;
        }
        Persona persona = domicilio.getPersona();
        if ( persona == null ) {
            return null;
        }
        Long id = persona.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
