package com.nixsolutions.model.avro;

import static org.springframework.util.ResourceUtils.CLASSPATH_URL_PREFIX;
import static org.springframework.util.ResourceUtils.getFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.apache.avro.Schema;
import org.springframework.core.io.ClassPathResource;

public class SchemaRepository {

//  private static String SCHEMA = readFromAvroSchema();
    private static final String SCHEMA = "{\"type\":\"record\",\"name\":\"Message\",\"namespace\":\"avro\",\"fields\":[{\"name\":\"uuid\",\"type\":\"string\"},{\"name\":\"userId\",\"type\":\"string\"},{\"name\":\"ordersCount\",\"type\":[\"null\",\"int\"]},{\"name\":\"time\",\"type\":[\"null\",\"string\"]}]}";


//  Schema avroHttpRequest = SchemaBuilder.record("Message")
//      .namespace("com.nixsolutions.avro")
//      .fields().requiredString("uuid")
//      .requiredString("userId")
//      .requiredInt("ordersCount")
//      .name("time")
//      .type(String.valueOf(LogicalTypes.date()))
//      .noDefault()
//      .endRecord();

    public static final Schema SCHEMA_OBJECT = new Schema.Parser().parse(SCHEMA);

    private static SchemaRepository INSTANCE = new SchemaRepository();

    public static SchemaRepository instance() {
      return INSTANCE;
    }

    public static Schema getSchemaObject() {
        return SCHEMA_OBJECT;
    }

    private static String readFromAvroSchema()
    {
      String result = "";
//      File file = new File( "classpath:person.avsc" ) ;
//      if (!file.exists())
//      {
//        return result;
//      }

      ClassPathResource resource = new ClassPathResource("person.avsc");
//      InputStream inputStream = resource.getInputStream();

//      File file = ResourceUtils.getFile(ResourceUtils.CLASSPATH_URL_PREFIX + "any.json");

      try
      {
        File file = getFile(CLASSPATH_URL_PREFIX + "person.avsc");
        return new String(Files.readAllBytes(file.toPath()));

//        result = in != null ? in.toString() : "";
      }
      catch (IOException e)
      {
        e.printStackTrace();
      }
      return result;
    }

}
