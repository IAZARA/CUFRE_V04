package com.cufre.expedientes.util;

import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.ExpedienteDelito;
import java.util.HashMap;
import java.util.Map;

public class PriorityCalculator {

    // --- MAPAS DE VALORES ---

    private static final Map<String, Integer> PROFESION_VALUES = new HashMap<>() {{
        put("OFICIO", 500);
        put("EMPLEADO", 500);
        put("PROFESIONAL", 800);
        put("FUERZA_SEGURIDAD", 800);
        put("FUERZA_ARMADA", 900);
        put("SERVICIO_INTELIGENCIA", 1000);
        put("DESOCUPADO", 100);
        put("COMERCIANTE", 800);
        put("OTRO", 0);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> TIPO_CAPTURA_VALUES = new HashMap<>() {{
        put("NACIONAL", 500);
        put("INTERNACIONAL", 1000);
        put("SIN_DATO", 0);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> TIPO_VICTIMA_VALUES = new HashMap<>() {{
        put("MENOR", 800);
        put("MUJER", 250);
        put("ANCIANO_JUBILADO", 500);
        put("POLITICO", 800);
        put("JUEZ", 1000);
        put("FISCAL", 1000);
        put("OTROS", 250);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> NIVEL_ORGANIZACION_VALUES = new HashMap<>() {{
        put("SIMPLE", 250);
        put("COMPLEJA", 800);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> AMBITO_BANDA_VALUES = new HashMap<>() {{
        put("NACIONAL", 750);
        put("PROVINCIAL", 500);
        put("BARRIAL", 250);
        put("INTERNACIONAL", 1000);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> CAPACIDAD_OPERATIVA_VALUES = new HashMap<>() {{
        put("ALTA", 1000);
        put("BAJA", 500);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> IMPACTO_SOCIAL_VALUES = new HashMap<>() {{
        put("ALTO", 500);
        put("BAJO", 250);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> TIPO_DANO_VALUES = new HashMap<>() {{
        put("FISICO", 250);
        put("PSICOLOGICO", 150);
        put("MATERIAL", 50);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> NIVEL_INCIDENCIA_ZONA_VALUES = new HashMap<>() {{
        put("ALTA", 500);
        put("MEDIA", 250);
        put("BAJA", 100);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> INSTITUCION_SENSIBLE_CERCANA_VALUES = new HashMap<>() {{
        put("ESCUELA", 600);
        put("HOSPITAL", 500);
        put("IGLESIA", 700);
        put("SINAGOGA", 1000);
        put("MEZQUITA", 800);
        put("OTRO", 100);
        put("DEFAULT", 0);
    }};

    private static final Map<String, Integer> IMPACTO_PERCEPCION_VALUES = new HashMap<>() {{
        put("ALTA", 500);
        put("MEDIA", 250);
        put("BAJA", 100);
        put("DEFAULT", 0);
    }};

    // --- FUNCIÓN PRINCIPAL ---
    public static int calcularPrioridad(Expediente expediente) {
        int prioridad = 0;

        // 1. Puntos base por delitos
        if (expediente.getExpedienteDelitos() != null) {
            for (ExpedienteDelito ed : expediente.getExpedienteDelitos()) {
                if (ed.getDelito() != null && ed.getDelito().getValoracion() != null) {
                    prioridad += ed.getDelito().getValoracion();
                }
            }
        }

        // 2. Factores de la persona (prófugo)
        // Nivel de estudios (todos 0 según tu tabla)
        // Profesión
        String profesion = safeUpper(expediente.getProfugoProfesionOcupacion());
        prioridad += PROFESION_VALUES.getOrDefault(profesion, PROFESION_VALUES.get("DEFAULT"));

        // Detenciones previas
        Integer detenciones = expediente.getProfugoNumeroDetencionesPrevias();
        if (detenciones == null || detenciones == 0) {
            prioridad += 0;
        } else if (detenciones <= 2) {
            prioridad += 200;
        } else if (detenciones <= 5) {
            prioridad += 750;
        } else {
            prioridad += 1000;
        }

        // 3. Factores del expediente
        // Número de cómplices
        Integer complices = expediente.getNumeroComplices();
        if (complices == null || complices == 0) {
            prioridad += 0;
        } else if (complices <= 2) {
            prioridad += 100;
        } else if (complices <= 5) {
            prioridad += 250;
        } else {
            prioridad += 1000;
        }

        // Tipo de captura
        String tipoCaptura = safeUpper(expediente.getTipoCaptura());
        prioridad += TIPO_CAPTURA_VALUES.getOrDefault(tipoCaptura, TIPO_CAPTURA_VALUES.get("DEFAULT"));

        // Tipo de víctima
        String tipoVictima = safeUpper(expediente.getTipoVictima());
        prioridad += TIPO_VICTIMA_VALUES.getOrDefault(tipoVictima, TIPO_VICTIMA_VALUES.get("DEFAULT"));

        // Caso mediático
        if (Boolean.TRUE.equals(expediente.getMediaticoFlag())) prioridad += 500;

        // Prófugo reincidente
        if (Boolean.TRUE.equals(expediente.getReincicenteFlag())) prioridad += 800;

        // Prófugo reiterante
        if (Boolean.TRUE.equals(expediente.getReiteranteFlag())) prioridad += 500;

        // Involucra banda
        if (Boolean.TRUE.equals(expediente.getBandaFlag())) prioridad += 500;

        // Involucra terrorismo
        if (Boolean.TRUE.equals(expediente.getTerrorismoFlag())) prioridad += 1000;

        // Nivel de organización de la banda
        String nivelOrganizacion = safeUpper(expediente.getNivelOrganizacion());
        prioridad += NIVEL_ORGANIZACION_VALUES.getOrDefault(nivelOrganizacion, NIVEL_ORGANIZACION_VALUES.get("DEFAULT"));

        // Ámbito de la banda
        String ambitoBanda = safeUpper(expediente.getAmbitoBanda());
        prioridad += AMBITO_BANDA_VALUES.getOrDefault(ambitoBanda, AMBITO_BANDA_VALUES.get("DEFAULT"));

        // Capacidad operativa de la banda
        String capacidadOperativa = safeUpper(expediente.getCapacidadOperativa());
        prioridad += CAPACIDAD_OPERATIVA_VALUES.getOrDefault(capacidadOperativa, CAPACIDAD_OPERATIVA_VALUES.get("DEFAULT"));

        // Hubo planificación
        if (expediente.getPlanificacionFlag() != null) {
            if (expediente.getPlanificacionFlag()) prioridad += 500;
            else prioridad += 100;
        }

        // Conexiones con otras actividades delictivas
        if (Boolean.TRUE.equals(expediente.getConexionesOtrasActividadesFlag())) prioridad += 500;

        // Impacto social
        String impactoSocial = safeUpper(expediente.getImpactoSocial());
        prioridad += IMPACTO_SOCIAL_VALUES.getOrDefault(impactoSocial, IMPACTO_SOCIAL_VALUES.get("DEFAULT"));

        // Tipo de daño
        String tipoDano = safeUpper(expediente.getTipoDano());
        prioridad += TIPO_DANO_VALUES.getOrDefault(tipoDano, TIPO_DANO_VALUES.get("DEFAULT"));

        // Uso de armas de fuego
        if (Boolean.TRUE.equals(expediente.getUsoArmasFuegoFlag())) prioridad += 500;

        // Uso de armas blancas
        if (Boolean.TRUE.equals(expediente.getUsoArmasBlancasFlag())) prioridad += 250;

        // Nivel de incidencia delictual en la zona
        String nivelIncidenciaZona = safeUpper(expediente.getNivelIncidenciaZona());
        prioridad += NIVEL_INCIDENCIA_ZONA_VALUES.getOrDefault(nivelIncidenciaZona, NIVEL_INCIDENCIA_ZONA_VALUES.get("DEFAULT"));

        // Cercanía a institución sensible
        String institucionSensible = safeUpper(expediente.getInstitucionSensibleCercana());
        prioridad += INSTITUCION_SENSIBLE_CERCANA_VALUES.getOrDefault(institucionSensible, INSTITUCION_SENSIBLE_CERCANA_VALUES.get("DEFAULT"));

        // Recursos limitados del investigado/banda
        String recursosLimitados = safeUpper(expediente.getRecursosLimitados());
        if ("SI".equals(recursosLimitados)) prioridad += 500;
        else if ("NO".equals(recursosLimitados)) prioridad += 200;

        // Ocurrió en área fronteriza
        String areaFronteriza = safeUpper(expediente.getAreaFronteriza());
        if ("SI".equals(areaFronteriza)) prioridad += 500;
        else if ("NO".equals(areaFronteriza)) prioridad += 100;

        // Impacto en la percepción de seguridad
        String impactoPercepcion = safeUpper(expediente.getImpactoPercepcion());
        prioridad += IMPACTO_PERCEPCION_VALUES.getOrDefault(impactoPercepcion, IMPACTO_PERCEPCION_VALUES.get("DEFAULT"));

        return prioridad;
    }

    private static String safeUpper(String value) {
        return value != null ? value.trim().toUpperCase() : "DEFAULT";
    }
} 