-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2026 at 01:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mine`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_permission`
--

CREATE TABLE `admin_permission` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `sub_module_id` int(11) NOT NULL,
  `d_in` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_permission`
--

INSERT INTO `admin_permission` (`id`, `role_id`, `module_id`, `sub_module_id`, `d_in`) VALUES
(443, 3, 2, 2, 0),
(444, 3, 2, 3, 0),
(651, 1, 12, 43, 0),
(652, 1, 12, 44, 0),
(653, 1, 12, 45, 0),
(654, 1, 12, 46, 0),
(655, 1, 13, 47, 0),
(656, 1, 13, 48, 0),
(657, 1, 13, 49, 0);

-- --------------------------------------------------------

--
-- Table structure for table `app_addresses`
--

CREATE TABLE `app_addresses` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'Home',
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `house_number` varchar(100) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_addresses`
--

INSERT INTO `app_addresses` (`id`, `customer_id`, `type`, `name`, `phone`, `house_number`, `street`, `area`, `city`, `state`, `pincode`, `is_default`) VALUES
(1, 1, 'Home', NULL, NULL, '', '', '', '', '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `app_categories`
--

CREATE TABLE `app_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_categories`
--

INSERT INTO `app_categories` (`id`, `name`, `image`, `sort_order`, `active`) VALUES
(1, 'Milk', 'assets/images/home/milk.png', 1, 1),
(2, 'Curd', 'assets/images/home/curd.png', 2, 1),
(3, 'Paneer', 'assets/images/home/paneer.png', 3, 1),
(4, 'Ghee', 'assets/images/home/ghee.png', 4, 1),
(5, 'Cheese', 'assets/images/home/cheese.png', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `app_coupons`
--

CREATE TABLE `app_coupons` (
  `code` varchar(30) NOT NULL,
  `percent` int(11) NOT NULL,
  `max_discount` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_coupons`
--

INSERT INTO `app_coupons` (`code`, `percent`, `max_discount`, `active`) VALUES
('MILKY10', 10, 100, 1);

-- --------------------------------------------------------

--
-- Table structure for table `app_customers`
--

CREATE TABLE `app_customers` (
  `id` int(11) NOT NULL,
  `firebase_uid` varchar(128) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_customers`
--

INSERT INTO `app_customers` (`id`, `firebase_uid`, `phone`, `first_name`, `last_name`, `email`, `fcm_token`, `created_at`) VALUES
(1, 'test-9999999999', '+919999999999', 'dsgsdg', 'sdgdsg', '', NULL, '2026-10-27 06:53:09');

-- --------------------------------------------------------

--
-- Table structure for table `app_delivery_slots`
--

CREATE TABLE `app_delivery_slots` (
  `id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_delivery_slots`
--

INSERT INTO `app_delivery_slots` (`id`, `label`, `active`) VALUES
(1, '7:00 AM - 9:00 AM', 1),
(2, '9:00 AM - 11:00 AM', 1),
(3, '5:00 PM - 7:00 PM', 1);

-- --------------------------------------------------------

--
-- Table structure for table `app_notifications`
--

CREATE TABLE `app_notifications` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` varchar(500) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_notifications`
--

INSERT INTO `app_notifications` (`id`, `customer_id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'order', 'Order Confirmed', 'Your order #MW5467238 has been placed.', 0, '2026-10-29 11:49:06');

-- --------------------------------------------------------

--
-- Table structure for table `app_orders`
--

CREATE TABLE `app_orders` (
  `id` int(11) NOT NULL,
  `order_no` varchar(20) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `address_json` text NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `delivery_slot` varchar(50) DEFAULT NULL,
  `payment_method` varchar(30) NOT NULL DEFAULT 'cod',
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `coupon_code` varchar(30) DEFAULT NULL,
  `status` enum('Placed','Preparing','Out for Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Placed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_orders`
--

INSERT INTO `app_orders` (`id`, `order_no`, `customer_id`, `address_json`, `delivery_date`, `delivery_slot`, `payment_method`, `subtotal`, `delivery_charge`, `discount`, `total`, `coupon_code`, `status`, `created_at`) VALUES
(1, 'MW5467238', 1, '{\"id\":1,\"type\":\"Home\",\"name\":null,\"phone\":null,\"houseNumber\":\"\",\"street\":\"\",\"area\":\"\",\"city\":\"\",\"state\":\"\",\"pincode\":\"\",\"isDefault\":true,\"address\":\"\",\"icon\":\"home-outline\"}', '2026-10-30', '7:00 AM - 9:00 AM', 'cod', 32.00, 40.00, 0.00, 72.00, NULL, 'Placed', '2026-10-29 11:49:06');

-- --------------------------------------------------------

--
-- Table structure for table `app_order_items`
--

CREATE TABLE `app_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `count` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_order_items`
--

INSERT INTO `app_order_items` (`id`, `order_id`, `product_id`, `name`, `quantity`, `price`, `count`, `image`) VALUES
(1, 1, 1, 'Fresh Cow Milk', '500 ml', 32.00, 1, 'assets/images/home/milk-product.png');

-- --------------------------------------------------------

--
-- Table structure for table `app_products`
--

CREATE TABLE `app_products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `vendor` varchar(100) DEFAULT NULL,
  `vendor_rating` decimal(2,1) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `reviews` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `serviceable` tinyint(1) NOT NULL DEFAULT 1,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_products`
--

INSERT INTO `app_products` (`id`, `category_id`, `name`, `quantity`, `price`, `old_price`, `vendor`, `vendor_rating`, `rating`, `reviews`, `image`, `description`, `serviceable`, `active`) VALUES
(1, 1, 'Fresh Cow Milk', '500 ml', 32.00, 36.00, 'Fresh Dairy', 4.7, 4.8, 124, 'assets/images/home/milk-product.png', 'Fresh and pure cow milk sourced from trusted dairy farms. Rich in nutrients and delivered fresh to your doorstep every morning.', 1, 1),
(2, 1, 'Fresh Buffalo Milk', '500 ml', 38.00, 42.00, 'Sri Dairy Farm', 4.6, 4.6, 80, 'assets/images/home/buffalo-milk.png', 'Creamy buffalo milk from local farms.', 1, 1),
(3, 1, 'A2 Cow Milk', '500 ml', 45.00, 50.00, 'Pure Milk', 4.8, 4.8, 64, 'assets/images/home/milk-product.png', 'A2 milk from indigenous cows.', 1, 1),
(4, 2, 'Fresh Curd', '400 g', 40.00, 45.00, 'Fresh Dairy', 4.7, 4.5, 52, 'assets/images/home/curd-product.png', 'Thick, set curd made daily.', 1, 1),
(5, 3, 'Premium Paneer', '200 g', 85.00, 95.00, 'Sri Dairy Farm', 4.6, 4.7, 41, 'assets/images/home/paneer-product.png', 'Soft paneer made from full cream milk.', 1, 1),
(6, 4, 'Pure Cow Ghee', '500 ml', 280.00, 320.00, 'Pure Milk', 4.8, 4.9, 30, 'assets/images/home/ghee.png', 'Traditional bilona cow ghee.', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `app_product_variants`
--

CREATE TABLE `app_product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_product_variants`
--

INSERT INTO `app_product_variants` (`id`, `product_id`, `label`, `price`) VALUES
(1, 1, '500 ml', 32.00),
(2, 1, '1 L', 60.00),
(3, 1, '2 L', 115.00);

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `setting_key` varchar(60) NOT NULL,
  `setting_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`setting_key`, `setting_value`) VALUES
('account.menu_items', '[{\"title\":\"My Orders\",\"subtitle\":\"View and track your orders\",\"icon\":\"receipt-outline\",\"action\":\"orders\"},{\"title\":\"My Addresses\",\"subtitle\":\"Manage your delivery addresses\",\"icon\":\"location-outline\",\"action\":\"addresses\"},{\"title\":\"Milk Subscription\",\"subtitle\":\"Manage your daily milk plan\",\"icon\":\"calendar-outline\",\"action\":\"subscription\"},{\"title\":\"Wishlist\",\"subtitle\":\"Your saved products\",\"icon\":\"heart-outline\",\"action\":\"wishlist\"}]'),
('account.support_items', '[{\"title\":\"Notifications\",\"subtitle\":\"Manage notification preferences\",\"icon\":\"notifications-outline\",\"action\":\"notifications\"},{\"title\":\"Help & Support\",\"subtitle\":\"Get help with your orders\",\"icon\":\"help-circle-outline\",\"action\":\"support\"},{\"title\":\"Privacy & Security\",\"subtitle\":\"Manage your account security\",\"icon\":\"shield-checkmark-outline\",\"action\":\"privacy\"}]'),
('checkout.delivery_charge', '40'),
('checkout.free_delivery_above', '500'),
('checkout.payment_methods', '[{\"id\":\"cod\",\"title\":\"Cash on Delivery\",\"subtitle\":\"Pay when your order arrives\",\"icon\":\"cash-outline\"},{\"id\":\"upi\",\"title\":\"UPI\",\"subtitle\":\"Google Pay, PhonePe, Paytm\",\"icon\":\"phone-portrait-outline\"},{\"id\":\"card\",\"title\":\"Credit / Debit Card\",\"subtitle\":\"Visa, Mastercard and more\",\"icon\":\"card-outline\"}]'),
('home.banners', '[{\"image\":\"assets/images/home/milk-banner.png\",\"alt\":\"Fresh Milk Delivered Daily\",\"link\":\"/products\"}]'),
('home.popular_count', '4'),
('home.search_placeholder', 'Search milk, curd, paneer...'),
('home.subscription_button', 'Start Subscription'),
('home.subscription_text', 'Get fresh milk delivered every morning.'),
('home.subscription_title', 'Daily Milk Subscription'),
('location.benefits', '[{\"icon\":\"location-outline\",\"title\":\"Find nearby delivery\",\"text\":\"See products available in your area.\"},{\"icon\":\"navigate-outline\",\"title\":\"Accurate delivery\",\"text\":\"Get your order delivered to the right location.\"}]'),
('location.description', 'Allow MilkyWay to access your location to find available milk delivery services near you.'),
('location.title', 'Enable Location'),
('login.brand_name', 'VD Dairy Fresh'),
('login.country_code', '+91'),
('login.features', '[{\"icon\":\"cart-outline\",\"title\":\"Fresh & Pure\",\"subtitle\":\"Milk\"},{\"icon\":\"leaf-outline\",\"title\":\"Daily\",\"subtitle\":\"Delivery\"},{\"icon\":\"shield-checkmark-outline\",\"title\":\"Safe &\",\"subtitle\":\"Secure\"}]'),
('login.hero_image', 'assets/images/login-milk.png'),
('login.logo', 'assets/images/logo.png'),
('login.phone_length', '10'),
('login.subtitle', 'Fresh milk, delivered daily'),
('login.title', 'Welcome Back!'),
('onboarding.slides', '[{\"title\":\"Fresh Milk\\nFor a Healthier You\",\"description\":\"Pure, fresh and nutritious milk delivered to your doorstep.\",\"image\":\"assets/images/onboarding/onboarding-1.png\",\"themeClass\":\"theme-slide-1\",\"buttonBg\":\"#5A4B3C\"},{\"title\":\"Wide Range\\nof Dairy Products\",\"description\":\"Milk, Curd, Paneer, Ghee and more, all in one place.\",\"image\":\"assets/images/onboarding/onboarding-2.png\",\"themeClass\":\"theme-slide-2\",\"buttonBg\":\"#176B4F\"},{\"title\":\"Subscribe &\\nSave Time\",\"description\":\"Set it once and get fresh milk delivered every day.\",\"image\":\"assets/images/onboarding/onboarding-3.png\",\"themeClass\":\"theme-slide-3\",\"buttonBg\":\"#176B4F\"}]'),
('order.timeline', '[{\"key\":\"placed\",\"title\":\"Order Placed\",\"description\":\"Your order has been placed successfully.\",\"icon\":\"receipt-outline\"},{\"key\":\"confirmed\",\"title\":\"Order Confirmed\",\"description\":\"Your order has been confirmed by the dairy.\",\"icon\":\"checkmark-circle-outline\"},{\"key\":\"preparing\",\"title\":\"Preparing\",\"description\":\"Your fresh dairy products are being prepared.\",\"icon\":\"time-outline\"},{\"key\":\"out\",\"title\":\"Out for Delivery\",\"description\":\"Your order is on the way to you.\",\"icon\":\"bicycle-outline\"},{\"key\":\"delivered\",\"title\":\"Delivered\",\"description\":\"Your order has been delivered.\",\"icon\":\"home-outline\"}]'),
('schedule.days', '[{\"id\":\"monday\",\"short\":\"MON\",\"name\":\"Monday\"},{\"id\":\"tuesday\",\"short\":\"TUE\",\"name\":\"Tuesday\"},{\"id\":\"wednesday\",\"short\":\"WED\",\"name\":\"Wednesday\"},{\"id\":\"thursday\",\"short\":\"THU\",\"name\":\"Thursday\"},{\"id\":\"friday\",\"short\":\"FRI\",\"name\":\"Friday\"},{\"id\":\"saturday\",\"short\":\"SAT\",\"name\":\"Saturday\"},{\"id\":\"sunday\",\"short\":\"SUN\",\"name\":\"Sunday\"}]'),
('schedule.default_days', '[\"monday\",\"wednesday\",\"friday\"]'),
('schedule.time_slots', '[{\"id\":\"morning\",\"title\":\"Morning\",\"time\":\"7:00 AM - 9:00 AM\",\"icon\":\"sunny-outline\"},{\"id\":\"late-morning\",\"title\":\"Late Morning\",\"time\":\"9:00 AM - 11:00 AM\",\"icon\":\"time-outline\"},{\"id\":\"evening\",\"title\":\"Evening\",\"time\":\"5:00 PM - 7:00 PM\",\"icon\":\"moon-outline\"}]'),
('splash.duration_ms', '2500'),
('splash.image', 'assets/images/splash/splash-milk.png'),
('subscription.max_quantity', '10'),
('subscription.plans', '[{\"id\":\"daily\",\"title\":\"Daily\",\"description\":\"Fresh milk delivered every day\",\"icon\":\"sunny-outline\",\"daysPerMonth\":30},{\"id\":\"alternate\",\"title\":\"Alternate Days\",\"description\":\"Milk delivered every other day\",\"icon\":\"calendar-outline\",\"daysPerMonth\":15},{\"id\":\"custom\",\"title\":\"Custom\",\"description\":\"Choose your preferred delivery days\",\"icon\":\"options-outline\",\"daysPerMonth\":20}]'),
('subscription.product_category', 'Milk');

-- --------------------------------------------------------

--
-- Table structure for table `app_subscriptions`
--

CREATE TABLE `app_subscriptions` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `plan` enum('daily','alternate','custom') NOT NULL DEFAULT 'daily',
  `custom_days` varchar(30) DEFAULT NULL,
  `delivery_slot` varchar(50) DEFAULT NULL,
  `status` enum('active','paused','cancelled') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_wishlist`
--

CREATE TABLE `app_wishlist` (
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_wishlist`
--

INSERT INTO `app_wishlist` (`customer_id`, `product_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL DEFAULT '',
  `gender` varchar(225) DEFAULT NULL,
  `role_id` int(11) DEFAULT 1,
  `role` varchar(25) DEFAULT NULL,
  `pwd` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `GST` varchar(225) DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `pincode` varchar(225) DEFAULT NULL,
  `document` varchar(225) DEFAULT NULL,
  `active_status` int(11) NOT NULL DEFAULT 0,
  `d_in` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `number`, `email`, `gender`, `role_id`, `role`, `pwd`, `GST`, `address`, `pincode`, `document`, `active_status`, `d_in`) VALUES
(1, 'Super Admin', '7799822811', 'admin@gmail.com', 'Male', 1, 'Super Admin', '1234', '122333435', 'RJY', NULL, NULL, 0, 0),
(2, 'Rehman', '8978688887', 'undefined', 'undefined', 1, 'Super Admin', '88887', 'undefined', 'RJY', 'undefined', '', 0, 1),
(3, 'prasad', '9010933109', '', NULL, 3, 'Admin', '1234', NULL, 'Rajahmundry', NULL, NULL, 0, 1),
(4, 'Reception', '9063914333', '', NULL, 4, 'Reception', '4333', NULL, 'Rjy', NULL, NULL, 0, 1),
(5, 'Medical', '7993312157', '', NULL, 5, 'medical', '2157', NULL, 'RJY', NULL, NULL, 0, 1),
(6, 'undefined', 'undefined', '', NULL, 0, 'undefined', 'undefined', NULL, 'undefined', NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `main_module`
--

CREATE TABLE `main_module` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `badge` varchar(255) NOT NULL,
  `badgeClass` varchar(255) NOT NULL,
  `isExternalLink` tinyint(1) NOT NULL DEFAULT 0,
  `main_module_order` int(11) DEFAULT NULL,
  `d_in` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_module`
--

INSERT INTO `main_module` (`id`, `title`, `path`, `icon`, `class`, `badge`, `badgeClass`, `isExternalLink`, `main_module_order`, `d_in`) VALUES
(1, 'Dashboard', '/dashboard', 'ri-bar-chart-2-fill', '', '', '', 0, 1, 0),
(2, 'User Management', '', 'ri-group-2-fill', 'sub', '', '', 0, 2, 0),
(3, 'Master', '', 'ri-database-2-line', 'sub', '', '', 0, 3, 0),
(4, 'Sales', '', 'ri-shopping-bag-3-line', 'sub', '', '', 0, 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `roleName` varchar(225) DEFAULT NULL,
  `d_in` int(11) NOT NULL DEFAULT 0,
  `it_s` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `roleName`, `d_in`, `it_s`) VALUES
(1, 'undefined', 1, '2025-03-21'),
(3, 'Admin', 1, '2026-09-28'),
(4, 'Reception', 0, '2026-10-02'),
(5, 'medical', 1, '2026-10-03'),
(6, 'Staff', 0, '2026-10-14'),
(7, 'undefined', 0, '2026-10-27');

-- --------------------------------------------------------

--
-- Table structure for table `sub_module`
--

CREATE TABLE `sub_module` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL DEFAULT '',
  `isExternalLink` tinyint(1) NOT NULL DEFAULT 0,
  `badgeClass` varchar(255) NOT NULL,
  `badge` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL DEFAULT 'bx bx-right-arrow-alt',
  `module_id` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `module_order` int(11) NOT NULL,
  `d_in` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_module`
--

INSERT INTO `sub_module` (`id`, `title`, `path`, `class`, `isExternalLink`, `badgeClass`, `badge`, `icon`, `module_id`, `parentId`, `module_order`, `d_in`) VALUES
(1, 'Analysis', '/', '', 0, '', '', 'bx bx-right-arrow-alt', 1, 1, 1, 1),
(2, 'Create Role', '/usermanagment/role', '', 0, '', '', 'bx bx-right-arrow-alt', 2, 2, 1, 0),
(3, 'Users', '/usermanagment/employee', '', 0, '', '', 'bx bx-right-arrow-alt', 2, 2, 2, 0),
(4, 'Categories', '/create/varients', '', 0, '', '', 'bx bx-right-arrow-alt', 3, 3, 1, 0),
(5, 'Products', '/create/items', '', 0, '', '', 'bx bx-right-arrow-alt', 3, 3, 2, 0),
(6, 'Coupons', '/create/coupons', '', 0, '', '', 'bx bx-right-arrow-alt', 3, 3, 3, 0),
(7, 'Delivery Slots', '/create/delivery-slots', '', 0, '', '', 'bx bx-right-arrow-alt', 3, 3, 4, 0),
(8, 'App Orders', '/create/app-orders', '', 0, '', '', 'bx bx-right-arrow-alt', 4, 4, 1, 0),
(9, 'App Subscriptions', '/create/app-subscriptions', '', 0, '', '', 'bx bx-right-arrow-alt', 4, 4, 2, 0),
(10, 'App Customers', '/create/app-customers', '', 0, '', '', 'bx bx-right-arrow-alt', 4, 4, 3, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_permission`
--
ALTER TABLE `admin_permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `app_addresses`
--
ALTER TABLE `app_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `app_categories`
--
ALTER TABLE `app_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `app_coupons`
--
ALTER TABLE `app_coupons`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `app_customers`
--
ALTER TABLE `app_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firebase_uid` (`firebase_uid`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `app_delivery_slots`
--
ALTER TABLE `app_delivery_slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `app_notifications`
--
ALTER TABLE `app_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `app_orders`
--
ALTER TABLE `app_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_no` (`order_no`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `app_order_items`
--
ALTER TABLE `app_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `app_products`
--
ALTER TABLE `app_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `app_product_variants`
--
ALTER TABLE `app_product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `app_subscriptions`
--
ALTER TABLE `app_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `app_wishlist`
--
ALTER TABLE `app_wishlist`
  ADD PRIMARY KEY (`customer_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `main_module`
--
ALTER TABLE `main_module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_module`
--
ALTER TABLE `sub_module`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_permission`
--
ALTER TABLE `admin_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=658;

--
-- AUTO_INCREMENT for table `app_addresses`
--
ALTER TABLE `app_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_categories`
--
ALTER TABLE `app_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `app_customers`
--
ALTER TABLE `app_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `app_delivery_slots`
--
ALTER TABLE `app_delivery_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `app_notifications`
--
ALTER TABLE `app_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_orders`
--
ALTER TABLE `app_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_order_items`
--
ALTER TABLE `app_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_products`
--
ALTER TABLE `app_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `app_product_variants`
--
ALTER TABLE `app_product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `app_subscriptions`
--
ALTER TABLE `app_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `main_module`
--
ALTER TABLE `main_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sub_module`
--
ALTER TABLE `sub_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_addresses`
--
ALTER TABLE `app_addresses`
  ADD CONSTRAINT `app_addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `app_customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_notifications`
--
ALTER TABLE `app_notifications`
  ADD CONSTRAINT `app_notifications_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `app_customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_orders`
--
ALTER TABLE `app_orders`
  ADD CONSTRAINT `app_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `app_customers` (`id`);

--
-- Constraints for table `app_order_items`
--
ALTER TABLE `app_order_items`
  ADD CONSTRAINT `app_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `app_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_products`
--
ALTER TABLE `app_products`
  ADD CONSTRAINT `app_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `app_categories` (`id`);

--
-- Constraints for table `app_product_variants`
--
ALTER TABLE `app_product_variants`
  ADD CONSTRAINT `app_product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `app_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_subscriptions`
--
ALTER TABLE `app_subscriptions`
  ADD CONSTRAINT `app_subscriptions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `app_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_subscriptions_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `app_products` (`id`);

--
-- Constraints for table `app_wishlist`
--
ALTER TABLE `app_wishlist`
  ADD CONSTRAINT `app_wishlist_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `app_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `app_products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
