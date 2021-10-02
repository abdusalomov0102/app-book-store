package uz.appbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import uz.appbook.entity.Book;
import uz.appbook.entity.Role;
import uz.appbook.entity.User;
import uz.appbook.service.IService;

@SpringBootApplication
public class AppBookServer implements CommandLineRunner {

    @Autowired
    private IService<User> userService;

    @Autowired
    private IService<Role> roleService;

    @Autowired
    private IService<Book> bookService;

    public static void main(String[] args) {
        SpringApplication.run(AppBookServer.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        if (roleService.findAll().isEmpty()) {
            roleService.saveOrUpdate(new Role(1L, "admin"));
            roleService.saveOrUpdate(new Role(2L, "user"));
        }

        if (userService.findAll().isEmpty()) {
            User user1 = new User();
            user1.setEmail("test@user.com");
            user1.setName("Test User");
            user1.setMobile("9787456545");
            user1.setRole(roleService.findById(2L).get());
            user1.setPassword(new BCryptPasswordEncoder().encode("testuser"));
            userService.saveOrUpdate(user1);

            User user2 = new User();
            user2.setEmail("test@admin.com");
            user2.setName("Test Admin");
            user2.setMobile("9787456545");
            user2.setRole(roleService.findById(1L).get());
            user2.setPassword(new BCryptPasswordEncoder().encode("testadmin"));
            userService.saveOrUpdate(user2);
        }

        if (bookService.findAll().isEmpty()) {
            for (int i = 1; i <= 50; i++) {
                Book book = new Book();
                book.setTitle("Spring Microservices in Action " + i);
                book.setAuthor("John Carnell " + i);
                book.setCoverPhotoURL("https://images-na.ssl-images-amazon.com/images/I/417zLTa1uqL._SX397_BO1,204,203,200_.jpg");
                book.setIsbnNumber(1617293989L + i);
                book.setPrice(2776.00 + i);
                book.setLanguage("English " + i);
                book.setGenre("Technology " + i);
                bookService.saveOrUpdate(book);
            }
            for (int i = 1; i <= 50; i++) {
                Book book1 = new Book();
                book1.setTitle("Java Persistence, Hibernate " + i);
                book1.setAuthor("Christian, Gavin King " + i);
                book1.setCoverPhotoURL("https://images.manning.com/720/960/resize/book/d/2ea186d-c683-4d54-95f9-cca25b6fe49e/bauer2.png");
                book1.setIsbnNumber(1632143989L + i);
                book1.setPrice(771.00 + i);
                book1.setLanguage("French " + i);
                book1.setGenre("History " + i);
                bookService.saveOrUpdate(book1);
            }
            for (int i = 1; i <= 50; i++) {
                Book book2 = new Book();
                book2.setTitle("Spring in Action " + i);
                book2.setAuthor("Craig Walls " + i);
                book2.setCoverPhotoURL("https://images-na.ssl-images-amazon.com/images/I/51gHy16h5TL.jpg");
                book2.setIsbnNumber(1613213989L + i);
                book2.setPrice(630.00 + i);
                book2.setLanguage("Arabic " + i);
                book2.setGenre("Fantasy " + i);
                bookService.saveOrUpdate(book2);
            }
            for (int i = 1; i <= 50; i++) {
                Book book4 = new Book();
                book4.setTitle("Glen Smith, Ledbrook " + i);
                book4.setAuthor("Grails in Action " + i);
                book4.setCoverPhotoURL("https://images.manning.com/720/960/resize/book/6/3e9d5ed-4155-466d-ab46-538bb355948d/gsmith2.png");
                book4.setIsbnNumber(1617290963L + i);
                book4.setPrice(2907.00 + i);
                book4.setLanguage("Chinese " + i);
                book4.setGenre("Horror " + i);
                bookService.saveOrUpdate(book4);
            }
        }

    }

}
