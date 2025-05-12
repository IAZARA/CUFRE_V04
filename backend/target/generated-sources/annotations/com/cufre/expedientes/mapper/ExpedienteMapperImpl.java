package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.dto.ExpedienteDTO;
import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.model.Documento;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Fotografia;
import com.cufre.expedientes.model.PersonaExpediente;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-12T14:52:16-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class ExpedienteMapperImpl implements ExpedienteMapper {

    @Autowired
    private FotografiaMapper fotografiaMapper;
    @Autowired
    private DocumentoMapper documentoMapper;
    @Autowired
    private PersonaExpedienteMapper personaExpedienteMapper;

    @Override
    public ExpedienteDTO toDto(Expediente expediente) {
        if ( expediente == null ) {
            return null;
        }

        ExpedienteDTO.ExpedienteDTOBuilder expedienteDTO = ExpedienteDTO.builder();

        expedienteDTO.fotografias( fotografiaListToFotografiaDTOList( expediente.getFotografias() ) );
        expedienteDTO.documentos( documentoListToDocumentoDTOList( expediente.getDocumentos() ) );
        expedienteDTO.personaExpedientes( personaExpedienteListToPersonaExpedienteDTOList( expediente.getPersonaExpedientes() ) );
        expedienteDTO.fotoPrincipalId( expediente.getFotoPrincipalId() );
        expedienteDTO.id( expediente.getId() );
        expedienteDTO.numero( expediente.getNumero() );
        expedienteDTO.fechaIngreso( expediente.getFechaIngreso() );
        expedienteDTO.fuerzaAsignada( expediente.getFuerzaAsignada() );
        expedienteDTO.fechaAsignacion( expediente.getFechaAsignacion() );
        expedienteDTO.autorizacionTareas( expediente.getAutorizacionTareas() );
        expedienteDTO.fechaAutorizacionTareas( expediente.getFechaAutorizacionTareas() );
        expedienteDTO.descripcion( expediente.getDescripcion() );
        expedienteDTO.prioridad( expediente.getPrioridad() );
        expedienteDTO.recompensa( expediente.getRecompensa() );
        expedienteDTO.fechaOficio( expediente.getFechaOficio() );
        expedienteDTO.numeroCausa( expediente.getNumeroCausa() );
        expedienteDTO.caratula( expediente.getCaratula() );
        expedienteDTO.juzgado( expediente.getJuzgado() );
        expedienteDTO.secretaria( expediente.getSecretaria() );
        expedienteDTO.fiscalia( expediente.getFiscalia() );
        expedienteDTO.jurisdiccion( expediente.getJurisdiccion() );
        expedienteDTO.provincia( expediente.getProvincia() );
        expedienteDTO.tipoCaptura( expediente.getTipoCaptura() );
        expedienteDTO.pais( expediente.getPais() );
        expedienteDTO.motivoCaptura( expediente.getMotivoCaptura() );
        expedienteDTO.disposicionJuzgado( expediente.getDisposicionJuzgado() );
        expedienteDTO.profugoTez( expediente.getProfugoTez() );
        expedienteDTO.profugoContexturaFisica( expediente.getProfugoContexturaFisica() );
        expedienteDTO.profugoCabello( expediente.getProfugoCabello() );
        expedienteDTO.profugoOjos( expediente.getProfugoOjos() );
        expedienteDTO.profugoEstatura( expediente.getProfugoEstatura() );
        expedienteDTO.profugoPeso( expediente.getProfugoPeso() );
        expedienteDTO.profugoMarcasVisibles( expediente.getProfugoMarcasVisibles() );
        expedienteDTO.profugoNivelEstudios( expediente.getProfugoNivelEstudios() );
        expedienteDTO.profugoProfesionOcupacion( expediente.getProfugoProfesionOcupacion() );
        expedienteDTO.profugoGrupoSanguineo( expediente.getProfugoGrupoSanguineo() );
        expedienteDTO.profugoTelefono( expediente.getProfugoTelefono() );
        expedienteDTO.profugoAntecedentesPenales( expediente.getProfugoAntecedentesPenales() );
        expedienteDTO.profugoDetalleAntecedentes( expediente.getProfugoDetalleAntecedentes() );
        expedienteDTO.profugoSituacionProcesal( expediente.getProfugoSituacionProcesal() );
        expedienteDTO.profugoNumeroProntuario( expediente.getProfugoNumeroProntuario() );
        expedienteDTO.profugoUltimaVezVisto( expediente.getProfugoUltimaVezVisto() );
        expedienteDTO.profugoEstabaDetenido( expediente.getProfugoEstabaDetenido() );
        expedienteDTO.profugoNumeroDetencionesPrevias( expediente.getProfugoNumeroDetencionesPrevias() );
        expedienteDTO.fechaHecho( expediente.getFechaHecho() );
        expedienteDTO.lugarHecho( expediente.getLugarHecho() );
        expedienteDTO.descripcionHecho( expediente.getDescripcionHecho() );
        expedienteDTO.mediaticoFlag( expediente.getMediaticoFlag() );
        expedienteDTO.numeroComplices( expediente.getNumeroComplices() );
        expedienteDTO.tipoDano( expediente.getTipoDano() );
        expedienteDTO.usoArmasFuegoFlag( expediente.getUsoArmasFuegoFlag() );
        expedienteDTO.usoArmasBlancasFlag( expediente.getUsoArmasBlancasFlag() );
        expedienteDTO.peligrosidadFlag( expediente.getPeligrosidadFlag() );
        expedienteDTO.antecedentesFlag( expediente.getAntecedentesFlag() );
        expedienteDTO.detalleAntecedentes( expediente.getDetalleAntecedentes() );
        expedienteDTO.reincicenteFlag( expediente.getReincicenteFlag() );
        expedienteDTO.reiteranteFlag( expediente.getReiteranteFlag() );
        expedienteDTO.fechaDetencion( expediente.getFechaDetencion() );
        expedienteDTO.lugarDetencion( expediente.getLugarDetencion() );
        expedienteDTO.fuerzaDetencion( expediente.getFuerzaDetencion() );
        expedienteDTO.descripcionProcedimiento( expediente.getDescripcionProcedimiento() );
        expedienteDTO.bandaFlag( expediente.getBandaFlag() );
        expedienteDTO.terrorismoFlag( expediente.getTerrorismoFlag() );
        expedienteDTO.nombreBanda( expediente.getNombreBanda() );
        expedienteDTO.nivelOrganizacion( expediente.getNivelOrganizacion() );
        expedienteDTO.ambitoBanda( expediente.getAmbitoBanda() );
        expedienteDTO.capacidadOperativa( expediente.getCapacidadOperativa() );
        expedienteDTO.planificacionFlag( expediente.getPlanificacionFlag() );
        expedienteDTO.patronesRepetitivos( expediente.getPatronesRepetitivos() );
        expedienteDTO.conexionesOtrasActividadesFlag( expediente.getConexionesOtrasActividadesFlag() );
        expedienteDTO.impactoSocial( expediente.getImpactoSocial() );
        expedienteDTO.nivelIncidenciaZona( expediente.getNivelIncidenciaZona() );
        expedienteDTO.institucionSensibleCercana( expediente.getInstitucionSensibleCercana() );
        expedienteDTO.impactoPercepcion( expediente.getImpactoPercepcion() );
        expedienteDTO.recursosLimitados( expediente.getRecursosLimitados() );
        expedienteDTO.areaFronteriza( expediente.getAreaFronteriza() );
        expedienteDTO.tipoVictima( expediente.getTipoVictima() );
        expedienteDTO.fugaDescripcion( expediente.getFugaDescripcion() );
        expedienteDTO.fugaLugar( expediente.getFugaLugar() );
        expedienteDTO.fugaLatitud( expediente.getFugaLatitud() );
        expedienteDTO.fugaLongitud( expediente.getFugaLongitud() );
        expedienteDTO.detencionDescripcion( expediente.getDetencionDescripcion() );
        expedienteDTO.detencionLugar( expediente.getDetencionLugar() );
        expedienteDTO.detencionLatitud( expediente.getDetencionLatitud() );
        expedienteDTO.detencionLongitud( expediente.getDetencionLongitud() );

        expedienteDTO.estadoSituacion( expediente.getEstadoSituacion() != null ? expediente.getEstadoSituacion().toUpperCase() : null );

        return expedienteDTO.build();
    }

    @Override
    public Expediente toEntity(ExpedienteDTO expedienteDTO) {
        if ( expedienteDTO == null ) {
            return null;
        }

        Expediente expediente = new Expediente();

        expediente.setFotoPrincipalId( expedienteDTO.getFotoPrincipalId() );
        expediente.setId( expedienteDTO.getId() );
        expediente.setNumero( expedienteDTO.getNumero() );
        expediente.setFechaIngreso( expedienteDTO.getFechaIngreso() );
        expediente.setEstadoSituacion( expedienteDTO.getEstadoSituacion() );
        expediente.setFuerzaAsignada( expedienteDTO.getFuerzaAsignada() );
        expediente.setFechaAsignacion( expedienteDTO.getFechaAsignacion() );
        expediente.setAutorizacionTareas( expedienteDTO.getAutorizacionTareas() );
        expediente.setFechaAutorizacionTareas( expedienteDTO.getFechaAutorizacionTareas() );
        expediente.setDescripcion( expedienteDTO.getDescripcion() );
        expediente.setPrioridad( expedienteDTO.getPrioridad() );
        expediente.setRecompensa( expedienteDTO.getRecompensa() );
        expediente.setFechaOficio( expedienteDTO.getFechaOficio() );
        expediente.setNumeroCausa( expedienteDTO.getNumeroCausa() );
        expediente.setCaratula( expedienteDTO.getCaratula() );
        expediente.setJuzgado( expedienteDTO.getJuzgado() );
        expediente.setSecretaria( expedienteDTO.getSecretaria() );
        expediente.setFiscalia( expedienteDTO.getFiscalia() );
        expediente.setJurisdiccion( expedienteDTO.getJurisdiccion() );
        expediente.setProvincia( expedienteDTO.getProvincia() );
        expediente.setTipoCaptura( expedienteDTO.getTipoCaptura() );
        expediente.setPais( expedienteDTO.getPais() );
        expediente.setMotivoCaptura( expedienteDTO.getMotivoCaptura() );
        expediente.setDisposicionJuzgado( expedienteDTO.getDisposicionJuzgado() );
        expediente.setProfugoTez( expedienteDTO.getProfugoTez() );
        expediente.setProfugoContexturaFisica( expedienteDTO.getProfugoContexturaFisica() );
        expediente.setProfugoCabello( expedienteDTO.getProfugoCabello() );
        expediente.setProfugoOjos( expedienteDTO.getProfugoOjos() );
        expediente.setProfugoEstatura( expedienteDTO.getProfugoEstatura() );
        expediente.setProfugoPeso( expedienteDTO.getProfugoPeso() );
        expediente.setProfugoMarcasVisibles( expedienteDTO.getProfugoMarcasVisibles() );
        expediente.setProfugoNivelEstudios( expedienteDTO.getProfugoNivelEstudios() );
        expediente.setProfugoProfesionOcupacion( expedienteDTO.getProfugoProfesionOcupacion() );
        expediente.setProfugoGrupoSanguineo( expedienteDTO.getProfugoGrupoSanguineo() );
        expediente.setProfugoTelefono( expedienteDTO.getProfugoTelefono() );
        expediente.setProfugoAntecedentesPenales( expedienteDTO.getProfugoAntecedentesPenales() );
        expediente.setProfugoDetalleAntecedentes( expedienteDTO.getProfugoDetalleAntecedentes() );
        expediente.setProfugoSituacionProcesal( expedienteDTO.getProfugoSituacionProcesal() );
        expediente.setProfugoNumeroProntuario( expedienteDTO.getProfugoNumeroProntuario() );
        expediente.setProfugoUltimaVezVisto( expedienteDTO.getProfugoUltimaVezVisto() );
        expediente.setProfugoEstabaDetenido( expedienteDTO.getProfugoEstabaDetenido() );
        expediente.setProfugoNumeroDetencionesPrevias( expedienteDTO.getProfugoNumeroDetencionesPrevias() );
        expediente.setFechaHecho( expedienteDTO.getFechaHecho() );
        expediente.setLugarHecho( expedienteDTO.getLugarHecho() );
        expediente.setDescripcionHecho( expedienteDTO.getDescripcionHecho() );
        expediente.setMediaticoFlag( expedienteDTO.getMediaticoFlag() );
        expediente.setNumeroComplices( expedienteDTO.getNumeroComplices() );
        expediente.setTipoDano( expedienteDTO.getTipoDano() );
        expediente.setUsoArmasFuegoFlag( expedienteDTO.getUsoArmasFuegoFlag() );
        expediente.setUsoArmasBlancasFlag( expedienteDTO.getUsoArmasBlancasFlag() );
        expediente.setPeligrosidadFlag( expedienteDTO.getPeligrosidadFlag() );
        expediente.setAntecedentesFlag( expedienteDTO.getAntecedentesFlag() );
        expediente.setDetalleAntecedentes( expedienteDTO.getDetalleAntecedentes() );
        expediente.setReincicenteFlag( expedienteDTO.getReincicenteFlag() );
        expediente.setReiteranteFlag( expedienteDTO.getReiteranteFlag() );
        expediente.setFechaDetencion( expedienteDTO.getFechaDetencion() );
        expediente.setLugarDetencion( expedienteDTO.getLugarDetencion() );
        expediente.setFuerzaDetencion( expedienteDTO.getFuerzaDetencion() );
        expediente.setDescripcionProcedimiento( expedienteDTO.getDescripcionProcedimiento() );
        expediente.setBandaFlag( expedienteDTO.getBandaFlag() );
        expediente.setTerrorismoFlag( expedienteDTO.getTerrorismoFlag() );
        expediente.setNombreBanda( expedienteDTO.getNombreBanda() );
        expediente.setNivelOrganizacion( expedienteDTO.getNivelOrganizacion() );
        expediente.setAmbitoBanda( expedienteDTO.getAmbitoBanda() );
        expediente.setCapacidadOperativa( expedienteDTO.getCapacidadOperativa() );
        expediente.setPlanificacionFlag( expedienteDTO.getPlanificacionFlag() );
        expediente.setPatronesRepetitivos( expedienteDTO.getPatronesRepetitivos() );
        expediente.setConexionesOtrasActividadesFlag( expedienteDTO.getConexionesOtrasActividadesFlag() );
        expediente.setImpactoSocial( expedienteDTO.getImpactoSocial() );
        expediente.setNivelIncidenciaZona( expedienteDTO.getNivelIncidenciaZona() );
        expediente.setInstitucionSensibleCercana( expedienteDTO.getInstitucionSensibleCercana() );
        expediente.setImpactoPercepcion( expedienteDTO.getImpactoPercepcion() );
        expediente.setRecursosLimitados( expedienteDTO.getRecursosLimitados() );
        expediente.setAreaFronteriza( expedienteDTO.getAreaFronteriza() );
        expediente.setTipoVictima( expedienteDTO.getTipoVictima() );
        expediente.setFugaDescripcion( expedienteDTO.getFugaDescripcion() );
        expediente.setFugaLugar( expedienteDTO.getFugaLugar() );
        expediente.setFugaLatitud( expedienteDTO.getFugaLatitud() );
        expediente.setFugaLongitud( expedienteDTO.getFugaLongitud() );
        expediente.setDetencionDescripcion( expedienteDTO.getDetencionDescripcion() );
        expediente.setDetencionLugar( expedienteDTO.getDetencionLugar() );
        expediente.setDetencionLatitud( expedienteDTO.getDetencionLatitud() );
        expediente.setDetencionLongitud( expedienteDTO.getDetencionLongitud() );

        return expediente;
    }

    @Override
    public Expediente updateEntity(ExpedienteDTO expedienteDTO, Expediente expediente) {
        if ( expedienteDTO == null ) {
            return expediente;
        }

        expediente.setFotoPrincipalId( expedienteDTO.getFotoPrincipalId() );
        expediente.setId( expedienteDTO.getId() );
        expediente.setNumero( expedienteDTO.getNumero() );
        expediente.setFechaIngreso( expedienteDTO.getFechaIngreso() );
        expediente.setEstadoSituacion( expedienteDTO.getEstadoSituacion() );
        expediente.setFuerzaAsignada( expedienteDTO.getFuerzaAsignada() );
        expediente.setFechaAsignacion( expedienteDTO.getFechaAsignacion() );
        expediente.setAutorizacionTareas( expedienteDTO.getAutorizacionTareas() );
        expediente.setFechaAutorizacionTareas( expedienteDTO.getFechaAutorizacionTareas() );
        expediente.setDescripcion( expedienteDTO.getDescripcion() );
        expediente.setPrioridad( expedienteDTO.getPrioridad() );
        expediente.setRecompensa( expedienteDTO.getRecompensa() );
        expediente.setFechaOficio( expedienteDTO.getFechaOficio() );
        expediente.setNumeroCausa( expedienteDTO.getNumeroCausa() );
        expediente.setCaratula( expedienteDTO.getCaratula() );
        expediente.setJuzgado( expedienteDTO.getJuzgado() );
        expediente.setSecretaria( expedienteDTO.getSecretaria() );
        expediente.setFiscalia( expedienteDTO.getFiscalia() );
        expediente.setJurisdiccion( expedienteDTO.getJurisdiccion() );
        expediente.setProvincia( expedienteDTO.getProvincia() );
        expediente.setTipoCaptura( expedienteDTO.getTipoCaptura() );
        expediente.setPais( expedienteDTO.getPais() );
        expediente.setMotivoCaptura( expedienteDTO.getMotivoCaptura() );
        expediente.setDisposicionJuzgado( expedienteDTO.getDisposicionJuzgado() );
        expediente.setProfugoTez( expedienteDTO.getProfugoTez() );
        expediente.setProfugoContexturaFisica( expedienteDTO.getProfugoContexturaFisica() );
        expediente.setProfugoCabello( expedienteDTO.getProfugoCabello() );
        expediente.setProfugoOjos( expedienteDTO.getProfugoOjos() );
        expediente.setProfugoEstatura( expedienteDTO.getProfugoEstatura() );
        expediente.setProfugoPeso( expedienteDTO.getProfugoPeso() );
        expediente.setProfugoMarcasVisibles( expedienteDTO.getProfugoMarcasVisibles() );
        expediente.setProfugoNivelEstudios( expedienteDTO.getProfugoNivelEstudios() );
        expediente.setProfugoProfesionOcupacion( expedienteDTO.getProfugoProfesionOcupacion() );
        expediente.setProfugoGrupoSanguineo( expedienteDTO.getProfugoGrupoSanguineo() );
        expediente.setProfugoTelefono( expedienteDTO.getProfugoTelefono() );
        expediente.setProfugoAntecedentesPenales( expedienteDTO.getProfugoAntecedentesPenales() );
        expediente.setProfugoDetalleAntecedentes( expedienteDTO.getProfugoDetalleAntecedentes() );
        expediente.setProfugoSituacionProcesal( expedienteDTO.getProfugoSituacionProcesal() );
        expediente.setProfugoNumeroProntuario( expedienteDTO.getProfugoNumeroProntuario() );
        expediente.setProfugoUltimaVezVisto( expedienteDTO.getProfugoUltimaVezVisto() );
        expediente.setProfugoEstabaDetenido( expedienteDTO.getProfugoEstabaDetenido() );
        expediente.setProfugoNumeroDetencionesPrevias( expedienteDTO.getProfugoNumeroDetencionesPrevias() );
        expediente.setFechaHecho( expedienteDTO.getFechaHecho() );
        expediente.setLugarHecho( expedienteDTO.getLugarHecho() );
        expediente.setDescripcionHecho( expedienteDTO.getDescripcionHecho() );
        expediente.setMediaticoFlag( expedienteDTO.getMediaticoFlag() );
        expediente.setNumeroComplices( expedienteDTO.getNumeroComplices() );
        expediente.setTipoDano( expedienteDTO.getTipoDano() );
        expediente.setUsoArmasFuegoFlag( expedienteDTO.getUsoArmasFuegoFlag() );
        expediente.setUsoArmasBlancasFlag( expedienteDTO.getUsoArmasBlancasFlag() );
        expediente.setPeligrosidadFlag( expedienteDTO.getPeligrosidadFlag() );
        expediente.setAntecedentesFlag( expedienteDTO.getAntecedentesFlag() );
        expediente.setDetalleAntecedentes( expedienteDTO.getDetalleAntecedentes() );
        expediente.setReincicenteFlag( expedienteDTO.getReincicenteFlag() );
        expediente.setReiteranteFlag( expedienteDTO.getReiteranteFlag() );
        expediente.setFechaDetencion( expedienteDTO.getFechaDetencion() );
        expediente.setLugarDetencion( expedienteDTO.getLugarDetencion() );
        expediente.setFuerzaDetencion( expedienteDTO.getFuerzaDetencion() );
        expediente.setDescripcionProcedimiento( expedienteDTO.getDescripcionProcedimiento() );
        expediente.setBandaFlag( expedienteDTO.getBandaFlag() );
        expediente.setTerrorismoFlag( expedienteDTO.getTerrorismoFlag() );
        expediente.setNombreBanda( expedienteDTO.getNombreBanda() );
        expediente.setNivelOrganizacion( expedienteDTO.getNivelOrganizacion() );
        expediente.setAmbitoBanda( expedienteDTO.getAmbitoBanda() );
        expediente.setCapacidadOperativa( expedienteDTO.getCapacidadOperativa() );
        expediente.setPlanificacionFlag( expedienteDTO.getPlanificacionFlag() );
        expediente.setPatronesRepetitivos( expedienteDTO.getPatronesRepetitivos() );
        expediente.setConexionesOtrasActividadesFlag( expedienteDTO.getConexionesOtrasActividadesFlag() );
        expediente.setImpactoSocial( expedienteDTO.getImpactoSocial() );
        expediente.setNivelIncidenciaZona( expedienteDTO.getNivelIncidenciaZona() );
        expediente.setInstitucionSensibleCercana( expedienteDTO.getInstitucionSensibleCercana() );
        expediente.setImpactoPercepcion( expedienteDTO.getImpactoPercepcion() );
        expediente.setRecursosLimitados( expedienteDTO.getRecursosLimitados() );
        expediente.setAreaFronteriza( expedienteDTO.getAreaFronteriza() );
        expediente.setTipoVictima( expedienteDTO.getTipoVictima() );
        expediente.setFugaDescripcion( expedienteDTO.getFugaDescripcion() );
        expediente.setFugaLugar( expedienteDTO.getFugaLugar() );
        expediente.setFugaLatitud( expedienteDTO.getFugaLatitud() );
        expediente.setFugaLongitud( expedienteDTO.getFugaLongitud() );
        expediente.setDetencionDescripcion( expedienteDTO.getDetencionDescripcion() );
        expediente.setDetencionLugar( expedienteDTO.getDetencionLugar() );
        expediente.setDetencionLatitud( expedienteDTO.getDetencionLatitud() );
        expediente.setDetencionLongitud( expedienteDTO.getDetencionLongitud() );

        return expediente;
    }

    protected List<FotografiaDTO> fotografiaListToFotografiaDTOList(List<Fotografia> list) {
        if ( list == null ) {
            return null;
        }

        List<FotografiaDTO> list1 = new ArrayList<FotografiaDTO>( list.size() );
        for ( Fotografia fotografia : list ) {
            list1.add( fotografiaMapper.toDto( fotografia ) );
        }

        return list1;
    }

    protected List<DocumentoDTO> documentoListToDocumentoDTOList(List<Documento> list) {
        if ( list == null ) {
            return null;
        }

        List<DocumentoDTO> list1 = new ArrayList<DocumentoDTO>( list.size() );
        for ( Documento documento : list ) {
            list1.add( documentoMapper.toDto( documento ) );
        }

        return list1;
    }

    protected List<PersonaExpedienteDTO> personaExpedienteListToPersonaExpedienteDTOList(List<PersonaExpediente> list) {
        if ( list == null ) {
            return null;
        }

        List<PersonaExpedienteDTO> list1 = new ArrayList<PersonaExpedienteDTO>( list.size() );
        for ( PersonaExpediente personaExpediente : list ) {
            list1.add( personaExpedienteMapper.toDto( personaExpediente ) );
        }

        return list1;
    }
}
