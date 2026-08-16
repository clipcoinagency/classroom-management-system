package com.classconnect.config;

import com.classconnect.model.Difficulty;
import com.classconnect.model.Experiment;
import com.classconnect.repository.ExperimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ExperimentSeeder implements CommandLineRunner {

    @Autowired
    private ExperimentRepository experimentRepository;

    @Override
    public void run(String... args) {
        if (experimentRepository.count() > 0) {
            return;
        }

        List<Experiment> experiments = List.of(
                new Experiment(1, "Write a user story and test cases (Hotel Booking, Flipkart)", "Requirements & Testing", Difficulty.EASY),
                new Experiment(2, "Write a JavaScript program for form validation", "JavaScript & CSS", Difficulty.EASY),
                new Experiment(3, "Write a JavaScript program for 3 ways to insert CSS selectors in HTML", "JavaScript & CSS", Difficulty.EASY),
                new Experiment(4, "Write a program to create a login form in React", "React", Difficulty.MEDIUM),
                new Experiment(5, "Demonstrate a React JS program using hooks (useState)", "React", Difficulty.EASY),
                new Experiment(6, "Demonstrate a React JS program using Context (MyContext, useMyContext)", "React", Difficulty.MEDIUM),
                new Experiment(7, "Write a program to toggle text state in React", "React", Difficulty.EASY),
                new Experiment(8, "Write a program for text input state in React", "React", Difficulty.EASY),
                new Experiment(9, "Write a basic props program in React", "React", Difficulty.EASY),
                new Experiment(10, "Write a program to create React Router in React", "React", Difficulty.MEDIUM),
                new Experiment(11, "Write a Spring Boot application with a REST controller that returns \"Hello World\"", "Spring Boot REST", Difficulty.EASY),
                new Experiment(12, "Write a Spring Boot application with a REST controller that adds two numbers", "Spring Boot REST", Difficulty.EASY),
                new Experiment(13, "Write a Java program to connect to a MySQL database, retrieve data and display it", "JDBC & MySQL", Difficulty.MEDIUM),
                new Experiment(14, "Create a Java application to insert new records into an existing database table", "JDBC & MySQL", Difficulty.MEDIUM),
                new Experiment(15, "Develop a program that uses a prepared statement to insert data", "JDBC & MySQL", Difficulty.MEDIUM),
                new Experiment(16, "Write a JDBC program that uses a prepared statement to update records", "JDBC & MySQL", Difficulty.MEDIUM),
                new Experiment(17, "Perform CRUD operations using MongoDB (Employee database)", "MongoDB", Difficulty.MEDIUM),
                new Experiment(18, "Perform CRUD operations using MongoDB (Library Management database)", "MongoDB", Difficulty.MEDIUM),
                new Experiment(19, "Create Student.java entity class; design a REST Controller with GET, PUT, POST, DELETE APIs", "Spring Boot REST", Difficulty.HARD)
        );

        experimentRepository.saveAll(experiments);
    }
}
