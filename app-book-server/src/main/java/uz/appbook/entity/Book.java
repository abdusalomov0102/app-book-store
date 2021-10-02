package uz.appbook.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String coverPhotoURL;

    private Long isbnNumber;
    private Double price;

    private String language;
    private String genre;

    @JsonCreator
    public Book(@JsonProperty("id") Long id, @JsonProperty("title") String title, @JsonProperty("author") String author,
                @JsonProperty("coverPhotoURL") String coverPhotoURL, @JsonProperty("isbnNumber") Long isbnNumber,
                @JsonProperty("price") Double price, @JsonProperty("language") String language) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.coverPhotoURL = coverPhotoURL;
        this.isbnNumber = isbnNumber;
        this.price = price;
        this.language = language;
    }

}
