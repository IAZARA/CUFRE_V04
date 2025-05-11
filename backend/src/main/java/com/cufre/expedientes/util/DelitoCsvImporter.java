package com.cufre.expedientes.util;

import com.cufre.expedientes.model.Delito;
import com.cufre.expedientes.repository.DelitoRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.FileReader;
import java.time.LocalDate;

@Component
public class DelitoCsvImporter {

    @Autowired
    private DelitoRepository delitoRepository;

    /**
     * Ejecuta la importación manualmente.
     * Llama a este método desde un test, un endpoint temporal, o desde el main de una clase auxiliar.
     */
    public void importarDesdeCsv(String csvFile) throws Exception {
        try (CSVReader reader = new CSVReader(new FileReader(csvFile))) {
            String[] nextLine;
            boolean firstLine = true;
            int count = 0;
            while ((nextLine = reader.readNext()) != null) {
                if (firstLine) { // Saltar encabezado
                    firstLine = false;
                    continue;
                }
                // Mapear columnas
                String nombre = nextLine[1];
                String codigoPenal = nextLine[2];
                String tipoPena = nextLine[3];
                String penaMaxima = nextLine[4];
                String valoracionStr = nextLine[5];
                Integer valoracion = null;
                try {
                    valoracion = Integer.parseInt(valoracionStr);
                } catch (Exception e) {
                    // Si no es número, dejarlo nulo
                }

                // Validar duplicados por nombre y código penal
                boolean exists = delitoRepository.findByNombreContainingIgnoreCase(nombre)
                        .stream()
                        .anyMatch(d -> d.getCodigoPenal() != null && d.getCodigoPenal().equalsIgnoreCase(codigoPenal));
                if (!exists) {
                    Delito delito = new Delito();
                    delito.setNombre(nombre);
                    delito.setDescripcion(nombre); // O dejar vacío si prefieres
                    delito.setCodigoPenal(codigoPenal);
                    delito.setTipoPena(tipoPena);
                    delito.setPenaMaxima(penaMaxima);
                    delito.setValoracion(valoracion);
                    delito.setCreadoEn(LocalDate.now());
                    delito.setActualizadoEn(LocalDate.now());
                    delitoRepository.save(delito);
                    count++;
                }
            }
            System.out.println("Importación de delitos completada. Delitos importados: " + count);
        }
    }
} 