package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExpedienteDTO {
    
    private Long id;
    private String numero;
    private LocalDate fechaIngreso;
    private String estadoSituacion;
    private String fuerzaAsignada;
    private LocalDate fechaAsignacion;
    private String autorizacionTareas;
    private LocalDate fechaAutorizacionTareas;
    private String descripcion;
    private Integer prioridad;
    private String recompensa;
    private LocalDate fechaOficio;
    
    // Datos judiciales
    private String numeroCausa;
    private String caratula;
    private String juzgado;
    private String secretaria;
    private String fiscalia;
    private String jurisdiccion;
    private String provincia;
    
    // Datos de captura
    private String tipoCaptura;
    private String pais;
    private String motivoCaptura;
    private String disposicionJuzgado;
    
    // Datos del prófugo
    private String profugoTez;
    private String profugoContexturaFisica;
    private String profugoCabello;
    private String profugoOjos;
    private Double profugoEstatura;
    private Double profugoPeso;
    private String profugoMarcasVisibles;
    private String profugoNivelEstudios;
    private String profugoProfesionOcupacion;
    private String profugoGrupoSanguineo;
    private String profugoTelefono;
    private Boolean profugoAntecedentesPenales;
    private String profugoDetalleAntecedentes;
    private String profugoSituacionProcesal;
    private String profugoNumeroProntuario;
    private String profugoUltimaVezVisto;
    private Boolean profugoEstabaDetenido;
    private Integer profugoNumeroDetencionesPrevias;
    
    // Datos del hecho
    private LocalDate fechaHecho;
    private String lugarHecho;
    private String descripcionHecho;
    private Boolean mediaticoFlag;
    private Integer numeroComplices;
    private String tipoDano;
    private Boolean usoArmasFuegoFlag;
    private Boolean usoArmasBlancasFlag;
    private Boolean peligrosidadFlag;
    private Boolean antecedentesFlag;
    private String detalleAntecedentes;
    private Boolean reincicenteFlag;
    private Boolean reiteranteFlag;
    
    // Datos de la detención
    private LocalDate fechaDetencion;
    private String lugarDetencion;
    private String fuerzaDetencion;
    private String descripcionProcedimiento;
    
    // Datos de organización criminal
    private Boolean bandaFlag;
    private Boolean terrorismoFlag;
    private String nombreBanda;
    private String nivelOrganizacion;
    private String ambitoBanda;
    private String capacidadOperativa;
    private Boolean planificacionFlag;
    private Boolean patronesRepetitivos;
    private Boolean conexionesOtrasActividadesFlag;
    
    // Impacto y contexto
    private String impactoSocial;
    private String nivelIncidenciaZona;
    private String institucionSensibleCercana;
    private String impactoPercepcion;
    private String recursosLimitados;
    private String areaFronteriza;
    private String tipoVictima;
    
    // Relaciones
    private List<PersonaExpedienteDTO> personaExpedientes = new ArrayList<>();
    private List<DelitoDTO> delitos = new ArrayList<>();
    private List<FotografiaDTO> fotografias = new ArrayList<>();
    private List<DocumentoDTO> documentos = new ArrayList<>();
}
