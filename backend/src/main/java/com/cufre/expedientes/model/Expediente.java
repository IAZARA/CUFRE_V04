package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "EXPEDIENTE")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"fotografias", "documentos", "personaExpedientes", "expedienteDelitos"})
public class Expediente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "NUMERO", unique = true, nullable = false, length = 50)
    private String numero;
    
    @Column(name = "FECHA_INGRESO")
    private LocalDate fechaIngreso;
    
    @Column(name = "ESTADO_SITUACION", length = 50)
    private String estadoSituacion;
    
    @Column(name = "FUERZA_ASIGNADA", length = 100)
    private String fuerzaAsignada;
    
    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;
    
    @Column(name = "AUTORIZACION_TAREAS", length = 200)
    private String autorizacionTareas;
    
    @Column(name = "FECHA_AUTORIZACION_TAREAS")
    private LocalDate fechaAutorizacionTareas;
    
    @Column(name = "DESCRIPCION", length = 1000)
    private String descripcion;
    
    @Column(name = "PRIORIDAD")
    private Integer prioridad;
    
    @Column(name = "RECOMPENSA", length = 200)
    private String recompensa;
    
    @Column(name = "FECHA_OFICIO")
    private LocalDate fechaOficio;
    
    @Column(name = "NUMERO_CAUSA", length = 50)
    private String numeroCausa;
    
    @Column(name = "CARATULA", length = 200)
    private String caratula;
    
    @Column(name = "JUZGADO", length = 100)
    private String juzgado;
    
    @Column(name = "SECRETARIA", length = 100)
    private String secretaria;
    
    @Column(name = "FISCALIA", length = 100)
    private String fiscalia;
    
    @Column(name = "JURISDICCION", length = 100)
    private String jurisdiccion;
    
    @Column(name = "PROVINCIA", length = 100)
    private String provincia;
    
    @Column(name = "TIPO_CAPTURA", length = 20)
    private String tipoCaptura;
    
    @Column(name = "PAIS", length = 100)
    private String pais;
    
    @Column(name = "MOTIVO_CAPTURA", length = 200)
    private String motivoCaptura;
    
    @Column(name = "DISPOSICION_JUZGADO", length = 200)
    private String disposicionJuzgado;
    
    // Datos del Prófugo
    @Column(name = "PROFUGO_TEZ", length = 50)
    private String profugoTez;
    
    @Column(name = "PROFUGO_CONTEXTURA_FISICA", length = 50)
    private String profugoContexturaFisica;
    
    @Column(name = "PROFUGO_CABELLO", length = 50)
    private String profugoCabello;
    
    @Column(name = "PROFUGO_OJOS", length = 50)
    private String profugoOjos;
    
    @Column(name = "PROFUGO_ESTATURA")
    private Double profugoEstatura;
    
    @Column(name = "PROFUGO_PESO")
    private Double profugoPeso;
    
    @Column(name = "PROFUGO_MARCAS_VISIBLES", length = 200)
    private String profugoMarcasVisibles;
    
    @Column(name = "PROFUGO_NIVEL_ESTUDIOS", length = 50)
    private String profugoNivelEstudios;
    
    @Column(name = "PROFUGO_PROFESION_OCUPACION", length = 50)
    private String profugoProfesionOcupacion;
    
    @Column(name = "PROFUGO_GRUPO_SANGUINEO", length = 10)
    private String profugoGrupoSanguineo;
    
    @Column(name = "PROFUGO_TELEFONO", length = 30)
    private String profugoTelefono;
    
    @Column(name = "PROFUGO_ANTECEDENTES_PENALES")
    private Boolean profugoAntecedentesPenales;
    
    @Column(name = "PROFUGO_DETALLE_ANTECEDENTES", length = 200)
    private String profugoDetalleAntecedentes;
    
    @Column(name = "PROFUGO_SITUACION_PROCESAL", length = 100)
    private String profugoSituacionProcesal;
    
    @Column(name = "PROFUGO_NUMERO_PRONTUARIO", length = 50)
    private String profugoNumeroProntuario;
    
    @Column(name = "PROFUGO_ULTIMA_VEZ_VISTO", length = 200)
    private String profugoUltimaVezVisto;
    
    @Column(name = "PROFUGO_ESTABA_DETENIDO")
    private Boolean profugoEstabaDetenido;
    
    @Column(name = "PROFUGO_NUMERO_DETENCIONES_PREVIAS")
    private Integer profugoNumeroDetencionesPrevias;
    
    // Datos del Hecho
    @Column(name = "FECHA_HECHO")
    private LocalDate fechaHecho;
    
    @Column(name = "LUGAR_HECHO", length = 200)
    private String lugarHecho;
    
    @Column(name = "DESCRIPCION_HECHO", length = 1000)
    private String descripcionHecho;
    
    @Column(name = "MEDIATICO_FLAG")
    private Boolean mediaticoFlag;
    
    @Column(name = "NUMERO_COMPLICES")
    private Integer numeroComplices;
    
    @Column(name = "TIPO_DANO", length = 50)
    private String tipoDano;
    
    @Column(name = "USO_ARMAS_FUEGO_FLAG")
    private Boolean usoArmasFuegoFlag;
    
    @Column(name = "USO_ARMAS_BLANCAS_FLAG")
    private Boolean usoArmasBlancasFlag;
    
    @Column(name = "PELIGROSIDAD_FLAG")
    private Boolean peligrosidadFlag;
    
    @Column(name = "ANTECEDENTES_FLAG")
    private Boolean antecedentesFlag;
    
    @Column(name = "DETALLE_ANTECEDENTES", length = 200)
    private String detalleAntecedentes;
    
    @Column(name = "REINCIDENTE_FLAG")
    private Boolean reincicenteFlag;
    
    @Column(name = "REITERANTE_FLAG")
    private Boolean reiteranteFlag;
    
    // Datos de la detención
    @Column(name = "FECHA_DETENCION")
    private LocalDate fechaDetencion;
    
    @Column(name = "LUGAR_DETENCION", length = 200)
    private String lugarDetencion;
    
    @Column(name = "FUERZA_DETENCION", length = 100)
    private String fuerzaDetencion;
    
    @Column(name = "DESCRIPCION_PROCEDIMIENTO", length = 500)
    private String descripcionProcedimiento;
    
    // Organización Criminal
    @Column(name = "BANDA_FLAG")
    private Boolean bandaFlag;
    
    @Column(name = "TERRORISMO_FLAG")
    private Boolean terrorismoFlag;
    
    @Column(name = "NOMBRE_BANDA", length = 100)
    private String nombreBanda;
    
    @Column(name = "NIVEL_ORGANIZACION", length = 20)
    private String nivelOrganizacion;
    
    @Column(name = "AMBITO_BANDA", length = 20)
    private String ambitoBanda;
    
    @Column(name = "CAPACIDAD_OPERATIVA", length = 10)
    private String capacidadOperativa;
    
    @Column(name = "PLANIFICACION_FLAG")
    private Boolean planificacionFlag;
    
    @Column(name = "PATRONES_REPETITIVOS")
    private Boolean patronesRepetitivos;
    
    @Column(name = "CONEXIONES_OTRAS_ACTIVIDADES_FLAG")
    private Boolean conexionesOtrasActividadesFlag;
    
    // Impacto y Contexto
    @Column(name = "IMPACTO_SOCIAL", length = 10)
    private String impactoSocial;
    
    @Column(name = "NIVEL_INCIDENCIA_ZONA", length = 10)
    private String nivelIncidenciaZona;
    
    @Column(name = "INSTITUCION_SENSIBLE_CERCANA", length = 20)
    private String institucionSensibleCercana;
    
    @Column(name = "IMPACTO_PERCEPCION", length = 10)
    private String impactoPercepcion;
    
    @Column(name = "RECURSOS_LIMITADOS", length = 50)
    private String recursosLimitados;
    
    @Column(name = "AREA_FRONTERIZA", length = 50)
    private String areaFronteriza;
    
    @Column(name = "TIPO_VICTIMA", length = 20)
    private String tipoVictima;
    
    // Relaciones
    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fotografia> fotografias = new ArrayList<>();
    
    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos = new ArrayList<>();
    
    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonaExpediente> personaExpedientes = new ArrayList<>();
    
    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExpedienteDelito> expedienteDelitos = new ArrayList<>();
    
    // Métodos de conveniencia
    /**
     * Agrega una fotografía a este expediente manteniendo la relación bidireccional
     * @param fotografia La fotografía a agregar
     * @return La fotografía agregada
     */
    public Fotografia addFotografia(Fotografia fotografia) {
        if (fotografias == null) {
            fotografias = new ArrayList<>();
        }
        fotografias.add(fotografia);
        fotografia.setExpediente(this);
        return fotografia;
    }
    
    public void removeFotografia(Fotografia fotografia) {
        fotografias.remove(fotografia);
        fotografia.setExpediente(null);
    }
    
    /**
     * Agrega un documento a este expediente manteniendo la relación bidireccional
     * @param documento El documento a agregar
     * @return El documento agregado
     */
    public Documento addDocumento(Documento documento) {
        if (documentos == null) {
            documentos = new ArrayList<>();
        }
        documentos.add(documento);
        documento.setExpediente(this);
        return documento;
    }
    
    public void removeDocumento(Documento documento) {
        documentos.remove(documento);
        documento.setExpediente(null);
    }
    
    public void addPersonaExpediente(PersonaExpediente personaExpediente) {
        personaExpedientes.add(personaExpediente);
        personaExpediente.setExpediente(this);
    }
    
    public void removePersonaExpediente(PersonaExpediente personaExpediente) {
        personaExpedientes.remove(personaExpediente);
        personaExpediente.setExpediente(null);
    }
    
    public void addExpedienteDelito(ExpedienteDelito expedienteDelito) {
        expedienteDelitos.add(expedienteDelito);
        expedienteDelito.setExpediente(this);
    }
    
    public void removeExpedienteDelito(ExpedienteDelito expedienteDelito) {
        expedienteDelitos.remove(expedienteDelito);
        expedienteDelito.setExpediente(null);
    }
}
