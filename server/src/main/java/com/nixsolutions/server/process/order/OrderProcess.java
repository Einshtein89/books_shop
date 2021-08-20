package com.nixsolutions.server.process.order;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.springframework.http.ResponseEntity.ok;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.nixsolutions.server.dao.BookRepository;
import com.nixsolutions.server.dao.OrderRepository;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.Book;
import com.nixsolutions.server.entity.OrderPosition;
import com.nixsolutions.server.entity.OrderPositionExtension;
import com.nixsolutions.server.process.kafka.KafkaProcess;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderProcess
{
  private static final String ORDERS = "orders";
  private static final String BOOKS_COUNT = "books_count";
  private final OrderRepository orderRepository;
  private final UserRepository userRepository;
  private final BookRepository bookRepository;
  private final KafkaProcess kafkaProcess;

  public String getOrders(Long userId)
  {
    List<OrderPosition> ordersByUser = orderRepository.getAllByUserIdOrderById(userId);
    Map<LocalDate, Map<Long, List<OrderPositionExtension>>> processedOrders = ordersByUser.stream()
        .map(this::toOrderExtension)
        .collect(groupingBy(OrderPosition::getDate, groupingBy(OrderPosition::getUniqueId)));
    JSONObject response = new JSONObject();
    response.put(ORDERS, processedOrders);
    if (!CollectionUtils.isEmpty(processedOrders))
    {
      Map<String, Integer> booksCount = kafkaProcess.getBooksCountByOrderId(userId);
      response.put(BOOKS_COUNT, booksCount);
      return response.toString();
    }
    return EMPTY;
  }
  
  public ResponseEntity<?> placeOrders(Map<String, Book> orderMap)
  {
    HashMap<Book, Long> preparedMap = preProcess(orderMap);
    long uniqueId = Calendar.getInstance().getTimeInMillis();
    List<OrderPosition> orderPositions = preparedMap.entrySet().stream()
        .map(toOrder(uniqueId))
        .collect(toList());
    if (!CollectionUtils.isEmpty(orderPositions))
    {
      orderRepository.saveAll(orderPositions);
      kafkaProcess.sendMessage(orderPositions);
      return ok(uniqueId);
    }
    return ResponseEntity.badRequest().build();
  }
  
  private OrderPositionExtension toOrderExtension(OrderPosition orderPosition)
  {
    OrderPositionExtension orderExtension = new OrderPositionExtension(orderPosition);
    Optional<Book> book = bookRepository.findById(orderPosition.getBookId());
    orderExtension.setBook(book.orElseThrow(
        () -> new RuntimeException("cannot find book with id: " + orderPosition.getBookId())));
    return orderExtension;
  }
  
  private HashMap<Book, Long> preProcess(Map<String, Book> orderMap)
  {
    HashMap<Book, Long> map = new HashMap<>();
    orderMap.forEach((key, value) -> map.put(value, processKeys(key)));
    return map;
  }
  
  private Long processKeys(String key)
  {
    return Long.parseLong(key.substring(0 , key.indexOf("_")));
  }
  
  private Function<Map.Entry<Book, Long>, OrderPosition> toOrder(long uniqueId)
  {
    return entry -> {
      OrderPosition orderPosition = new OrderPosition();
      orderPosition.setBookId(entry.getKey().getId());
      orderPosition.setAmount(entry.getValue());
      User principal = (User)
          SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      com.nixsolutions.server.entity.users.User currentUser = userRepository.findByEmail(principal.getUsername());
      orderPosition.setUserId(currentUser.getId());
      orderPosition.setDate(LocalDate.now());
      orderPosition.setUniqueId(uniqueId);
      return orderPosition;
    };
  }
}
