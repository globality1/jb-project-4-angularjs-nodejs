-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2020 at 10:12 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `store`
--
CREATE DATABASE IF NOT EXISTS `store` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `store`;

-- --------------------------------------------------------

--
-- Table structure for table `completed_orders`
--

CREATE TABLE `completed_orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(70) NOT NULL,
  `shopping_cart_id` int(11) NOT NULL,
  `total_order_price` int(11) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `order_creation_date` datetime NOT NULL,
  `order_delivery_date` datetime NOT NULL,
  `cc_last_digits` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `completed_orders`
--

INSERT INTO `completed_orders` (`id`, `user_id`, `shopping_cart_id`, `total_order_price`, `city`, `address`, `order_creation_date`, `order_delivery_date`, `cc_last_digits`) VALUES
(5, 'ef5f450f-26e9-474c-9650-dc38275bb416', 4, 2114, 'Hertzelia', 'Monkey Area', '2020-06-13 21:50:26', '2020-06-23 03:00:00', 8055),
(7, 'ef5f450f-26e9-474c-9650-dc38275bb416', 9, 209, 'Hertzelia', 'Monkey Area', '2020-06-14 18:02:37', '2020-06-23 03:00:00', 3500),
(23, 'ef5f450f-26e9-474c-9650-dc38275bb416', 17, 63, 'Hertzelia', 'Monkey Area', '2020-06-14 18:57:54', '2020-06-24 03:00:00', 4587),
(24, 'ef5f450f-26e9-474c-9650-dc38275bb416', 18, 32, 'Hertzelia', 'Monkey Area', '2020-06-14 19:08:22', '2020-06-26 03:00:00', 1254),
(25, 'ef5f450f-26e9-474c-9650-dc38275bb416', 19, 174, 'Hertzelia', 'Monkey Area', '2020-06-14 20:21:58', '2020-06-23 03:00:00', 6589),
(26, 'ef5f450f-26e9-474c-9650-dc38275bb416', 20, 169, 'Hertzelia', 'Monkey Area', '2020-06-14 20:23:11', '2020-06-26 03:00:00', 7589),
(27, '89b1420d-c83b-4d32-bcc8-939ccaf21bd4', 22, 98, 'Raanana', 'some where', '2020-06-14 20:55:45', '2020-06-25 03:00:00', 8569);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(60) NOT NULL,
  `product_category_id` int(11) NOT NULL,
  `product_price` float NOT NULL,
  `product_image` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `product_category_id`, `product_price`, `product_image`) VALUES
(1, 'Milk', 1, 3.8, 'e547030a-99c2-4208-99d8-58342f897083.jpg'),
(2, 'Ice Cream', 1, 6.4, 'ice-cream.jpg'),
(3, 'Kinder Bueno', 1, 2.5, 'kinder-bueno.jpg'),
(4, 'Dark Chocolate', 1, 2.5, 'dark-chocolate.jpg'),
(5, 'Heineken Beer', 3, 8.5, 'b7c32526-3f8e-4c36-9729-5400dafba22f.png'),
(6, 'Chilli Cor Carne', 2, 12, 'b12d81c7-0499-434a-b2c1-5a37c3e81f12.png'),
(7, 'Broccoli', 4, 2.3, 'f19249dc-7b9c-4a46-bb62-01f7edb427d0.png'),
(8, 'Tomato', 4, 4.5, 'bdeb9c12-ee75-4563-8f0b-8b98e0949b5a.png'),
(9, 'Salamon', 2, 5.5, 'f7e9771e-d85f-4b55-9dda-61bb9c468deb.png'),
(10, 'Sugar Free Milk', 1, 3.5, '2fa92250-6edc-472b-a329-32be1f9d6ee8.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `category_name`) VALUES
(1, 'Milk & Eggs'),
(2, 'Meat & Fish'),
(3, 'Wine & Drinks'),
(4, 'Vegetables & Fruits');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `id` int(11) NOT NULL,
  `user_id` varchar(70) NOT NULL,
  `creation_date` datetime NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shopping_cart`
--

INSERT INTO `shopping_cart` (`id`, `user_id`, `creation_date`, `active`) VALUES
(2, '34555c18-3dfb-4327-8ad6-42f527747854', '2020-06-08 18:21:29', 1),
(3, '0a2b784d-3efa-4040-84e5-de6cea1a6d4f', '2020-06-10 16:08:43', 1),
(4, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-10 16:12:58', 0),
(5, '7a40adc5-afbc-479c-8c51-28d1f0406a3c', '2020-06-10 16:15:50', 1),
(6, '182881c0-1928-4634-a6e4-afb5db425e5b', '2020-06-10 16:18:30', 1),
(7, '63d19db3-e3bb-4cad-9ea1-fbec84c6cd17', '2020-06-10 16:20:18', 1),
(8, 'f78533c8-c339-4fb2-accc-492671ee3432', '2020-06-10 16:23:31', 1),
(9, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-13 21:47:19', 0),
(10, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 17:58:42', 0),
(11, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 18:03:44', 0),
(17, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 18:19:40', 0),
(18, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 18:57:55', 0),
(19, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 19:08:22', 0),
(20, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 20:21:59', 0),
(21, 'ef5f450f-26e9-474c-9650-dc38275bb416', '2020-06-14 20:23:11', 1),
(22, '89b1420d-c83b-4d32-bcc8-939ccaf21bd4', '2020-06-14 20:55:05', 0),
(23, '89b1420d-c83b-4d32-bcc8-939ccaf21bd4', '2020-06-14 20:55:45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart_items`
--

CREATE TABLE `shopping_cart_items` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `shopping_cart_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shopping_cart_items`
--

INSERT INTO `shopping_cart_items` (`id`, `product_id`, `shopping_cart_id`, `quantity`, `total_price`) VALUES
(49, 3, 2, 25, 62.5),
(52, 4, 8, 25, 62.5),
(54, 4, 8, 25, 62.5),
(55, 2, 8, 35, 224),
(57, 4, 8, 35, 87.5),
(70, 3, 2, 250, 625),
(73, 3, 2, 53, 132.5),
(75, 4, 2, 55, 137.5),
(76, 4, 2, 12, 30),
(78, 4, 2, 5, 12.5),
(79, 4, 2, 2500, 6250),
(97, 6, 4, 25, 300),
(98, 9, 4, 2, 11),
(99, 3, 4, 5, 12.5),
(100, 1, 4, 25, 95),
(101, 7, 4, 12, 27.6),
(102, 5, 4, 125, 1062.5),
(103, 3, 4, 85, 212.5),
(104, 5, 4, 25, 212.5),
(105, 6, 4, 15, 180),
(106, 6, 9, 2, 24),
(110, 6, 9, 5, 60),
(112, 4, 9, 2, 5),
(113, 6, 9, 5, 60),
(114, 6, 9, 5, 60),
(116, 6, 10, 52, 624),
(117, 5, 10, 53, 450.5),
(118, 6, 11, 12, 144),
(119, 4, 11, 10, 25),
(133, 5, 17, 5, 42.5),
(134, 4, 17, 8, 20),
(135, 10, 18, 5, 17.5),
(136, 10, 18, 4, 14),
(137, 4, 19, 5, 12.5),
(138, 3, 19, 7, 17.5),
(139, 6, 19, 12, 144),
(140, 6, 20, 12, 144),
(141, 4, 20, 10, 25),
(142, 6, 22, 5, 60),
(143, 4, 22, 8, 20),
(144, 3, 22, 7, 17.5),
(148, 6, 21, 12, 144),
(149, 4, 21, 15, 37.5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `personal_id` int(9) NOT NULL,
  `password` varchar(250) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `isAdmin` int(1) NOT NULL,
  `uuid` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `personal_id`, `password`, `city`, `address`, `isAdmin`, `uuid`) VALUES
(1, 'Admin', 'Admin', 'Admin@google.com', 123456789, 'b21b236a1a16e727ccdf9ca609df3c29f7147cafae023d31c69bcc3564167c323f3f5ebeb80f27bdaf464830aa2d9b046dcdef3671881efc39f210b4a03f3afa', 'Haifa', 'Cactus', 1, '34555c18-3dfb-4327-8ad6-42f527747854'),
(10, 'David', 'Ashuah', 'david.a87@yahoom.com', 245848745, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Beer Sheva', 'somewhere around the conor', 0, '34555c19-3dfb-4328-8ad6-42f527747854'),
(11, 'User', 'First', 'userone@gmail.com', 123456782, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Hertzelia', 'Monkey Area', 0, 'ef5f450f-26e9-474c-9650-dc38275bb416'),
(12, 'User', 'Second', 'usertwo@gmail.com', 123456783, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Bat Yam', 'Rosh Shel Dag', 0, '0a2b784d-3efa-4040-84e5-de6cea1a6d4f'),
(13, 'user', 'third', 'userthree@gmail.com', 123456784, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Aza', 'Gaza 4', 0, '7a40adc5-afbc-479c-8c51-28d1f0406a3c'),
(14, 'user', 'fourth', 'userfour@gmail.com', 123456785, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Tel Aviv', 'Generals of doom', 0, '182881c0-1928-4634-a6e4-afb5db425e5b'),
(15, 'user', 'fifth', 'userfive@gmail.com', 123456786, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Hertzelia', 'Somewhere', 0, '63d19db3-e3bb-4cad-9ea1-fbec84c6cd17'),
(16, 'user', 'sixth', 'usersix@gmail.com', 123456787, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Tel Aviv', 'Mishlohim', 0, 'f78533c8-c339-4fb2-accc-492671ee3432'),
(17, 'User', 'seventh', 'userseven@gmail.com', 123456254, '2a2a7a3cbff273dca1845d0e2d8584de9c82832202ec8e1da5e657105de60ee766a24039f4bf80fba1a1451796c4379794f1d6fc3e8545a258b8fcdbb5e1d75e', 'Haifa', 'some where', 0, '89b1420d-c83b-4d32-bcc8-939ccaf21bd4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `completed_orders`
--
ALTER TABLE `completed_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `shopping_card_id_index` (`shopping_cart_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_category_id_index` (`product_category_id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_cart_index` (`user_id`);

--
-- Indexes for table `shopping_cart_items`
--
ALTER TABLE `shopping_cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id_index` (`product_id`),
  ADD KEY `shopping_cart_index` (`shopping_cart_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD UNIQUE KEY `personal_unique` (`personal_id`),
  ADD KEY `uuid_users_index` (`uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `completed_orders`
--
ALTER TABLE `completed_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `shopping_cart_items`
--
ALTER TABLE `shopping_cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `completed_orders`
--
ALTER TABLE `completed_orders`
  ADD CONSTRAINT `completed_orders_ibfk_2` FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart` (`id`),
  ADD CONSTRAINT `completed_orders_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`product_category_id`) REFERENCES `product_category` (`id`);

--
-- Constraints for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`);

--
-- Constraints for table `shopping_cart_items`
--
ALTER TABLE `shopping_cart_items`
  ADD CONSTRAINT `shopping_cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `shopping_cart_items_ibfk_2` FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
