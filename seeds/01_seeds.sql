INSERT INTO users (name, email, password)
VALUES ('Harry Potter', 'hpotter@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Hermoini Granger', 'unicorn@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ron Weasly', 'gingerman@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Gryfinddor House', 'description', 'url', 'url', 1000, 20, 2, 10, 'England', 'Baker St', 'London', 'London', 'POSTAL'),
(2, 'Muggle home', 'description', 'url', 'url', 150, 2, 2, 2, 'England', 'United St', 'Manchester', 'Manchester', 'POSTAL'),
(3, 'Ginger house', 'description', 'url', 'url', 300, 0, 1, 1, 'Scotland', 'Red St', 'Edinburg', 'Edinburg', 'POSTAL');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-01-17', '2021-01-21', 1, 2),
('2021-01-12', '2021-01-15', 2, 3),
('2021-01-21', '2021-01-22', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 3, 6, 5, 'message'),
(2, 1, 4, 4, 'message'),
(3, 2, 5, 1, 'message');
