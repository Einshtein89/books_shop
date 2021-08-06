package com.nixsolutions.model.avro;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.avro.Schema;
import org.apache.avro.file.DataFileReader;
import org.apache.avro.file.SeekableByteArrayInput;
import org.apache.avro.io.DatumReader;
import org.apache.avro.specific.SpecificDatumReader;
import org.apache.kafka.common.serialization.Deserializer;

import avro.Message;

public class AvroMessageDeserializer implements Deserializer<Message> {

    private Schema schema = null;

    @Override
    public void configure(Map configs, boolean isKey) {
        schema = (Schema) configs.get("SCHEMA");
    }

    @Override
    public Message deserialize(String s, byte[] bytes) {
        DatumReader<Message> datumReader = new SpecificDatumReader<>(schema);
        SeekableByteArrayInput arrayInput = new SeekableByteArrayInput(bytes);
        List<Message> records = new ArrayList<>();

        DataFileReader<Message> dataFileReader;
        try {
            dataFileReader = new DataFileReader<>(arrayInput, datumReader);
            while (dataFileReader.hasNext()) {
                Message record = dataFileReader.next();
                records.add(record);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return records.get(0);

    }
}
