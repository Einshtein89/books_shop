package com.nixsolutions.model.avro;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import org.apache.avro.Schema;
import org.apache.avro.file.DataFileWriter;
import org.apache.avro.generic.GenericDatumWriter;
import org.apache.kafka.common.serialization.Serializer;

import avro.Message;

public class AvroMessageSerializer implements Serializer<Message>
{

  private Schema schema = null;

  @Override
  public void configure(Map<String, ?> map, boolean b)
  {
    schema = (Schema) map.get("SCHEMA");
  }

  @Override
  public byte[] serialize(String arg0, Message message)
  {
    byte[] retVal = null;

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    GenericDatumWriter<Message> datumWriter = new GenericDatumWriter<>(schema);

    DataFileWriter<Message> dataFileWriter = new DataFileWriter<>(datumWriter);
    try
    {
      dataFileWriter.create(schema, outputStream);
      dataFileWriter.append(message);
      dataFileWriter.flush();
      dataFileWriter.close();
      retVal = outputStream.toByteArray();
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    return retVal;
  }

  @Override
  public void close()
  {
  }

}
