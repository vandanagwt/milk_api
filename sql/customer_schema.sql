-- Customer mobile app tables (prefix app_ to avoid clashing with admin tables)
CREATE TABLE IF NOT EXISTS app_customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) DEFAULT NULL,
  last_name VARCHAR(100) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  fcm_token VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) DEFAULT NULL,
  vendor VARCHAR(100) DEFAULT NULL,
  vendor_rating DECIMAL(2,1) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT NULL,
  reviews INT NOT NULL DEFAULT 0,
  image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  serviceable TINYINT(1) NOT NULL DEFAULT 1,
  active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES app_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  label VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES app_products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'Home',
  name VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  house_number VARCHAR(100) DEFAULT NULL,
  street VARCHAR(255) DEFAULT NULL,
  area VARCHAR(100) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  state VARCHAR(100) DEFAULT NULL,
  pincode VARCHAR(10) DEFAULT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_coupons (
  code VARCHAR(30) PRIMARY KEY,
  percent INT NOT NULL,
  max_discount INT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_delivery_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(20) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  address_json TEXT NOT NULL,
  delivery_date DATE DEFAULT NULL,
  delivery_slot VARCHAR(50) DEFAULT NULL,
  payment_method VARCHAR(30) NOT NULL DEFAULT 'cod',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  coupon_code VARCHAR(30) DEFAULT NULL,
  status ENUM('Placed','Preparing','Out for Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Placed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  count INT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (order_id) REFERENCES app_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_wishlist (
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY (customer_id, product_id),
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES app_products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  plan ENUM('daily','alternate','custom') NOT NULL DEFAULT 'daily',
  custom_days VARCHAR(30) DEFAULT NULL,
  delivery_slot VARCHAR(50) DEFAULT NULL,
  status ENUM('active','paused','cancelled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES app_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data (mirrors what the app previously hardcoded)
INSERT INTO app_categories (id, name, image, sort_order) VALUES
(1,'Milk','assets/images/home/milk.png',1),
(2,'Curd','assets/images/home/curd.png',2),
(3,'Paneer','assets/images/home/paneer.png',3),
(4,'Ghee','assets/images/home/ghee.png',4),
(5,'Cheese','assets/images/home/cheese.png',5);

INSERT INTO app_products (id,category_id,name,quantity,price,old_price,vendor,vendor_rating,rating,reviews,image,description,serviceable) VALUES
(1,1,'Fresh Cow Milk','500 ml',32,36,'Fresh Dairy',4.7,4.8,124,'assets/images/home/milk-product.png','Fresh and pure cow milk sourced from trusted dairy farms. Rich in nutrients and delivered fresh to your doorstep every morning.',1),
(2,1,'Fresh Buffalo Milk','500 ml',38,42,'Sri Dairy Farm',4.6,4.6,80,'assets/images/home/buffalo-milk.png','Creamy buffalo milk from local farms.',1),
(3,1,'A2 Cow Milk','500 ml',45,50,'Pure Milk',4.8,4.8,64,'assets/images/home/milk-product.png','A2 milk from indigenous cows.',1),
(4,2,'Fresh Curd','400 g',40,45,'Fresh Dairy',4.7,4.5,52,'assets/images/home/curd-product.png','Thick, set curd made daily.',1),
(5,3,'Premium Paneer','200 g',85,95,'Sri Dairy Farm',4.6,4.7,41,'assets/images/home/paneer-product.png','Soft paneer made from full cream milk.',1),
(6,4,'Pure Cow Ghee','500 ml',280,320,'Pure Milk',4.8,4.9,30,'assets/images/home/ghee.png','Traditional bilona cow ghee.',0);

INSERT INTO app_product_variants (product_id,label,price) VALUES
(1,'500 ml',32),(1,'1 L',60),(1,'2 L',115);

INSERT INTO app_coupons (code,percent,max_discount) VALUES ('MILKY10',10,100);

INSERT INTO app_delivery_slots (label) VALUES
('7:00 AM - 9:00 AM'),('9:00 AM - 11:00 AM'),('5:00 PM - 7:00 PM');

-- Editable app content (login screen text, features, country code)
CREATE TABLE IF NOT EXISTS app_settings (
  setting_key VARCHAR(60) PRIMARY KEY,
  setting_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO app_settings (setting_key, setting_value) VALUES
('login.title', 'Welcome Back!'),
('login.subtitle', 'Fresh milk, delivered daily'),
('login.logo', 'assets/images/logo.png'),
('login.hero_image', 'assets/images/login-milk.png'),
('login.brand_name', 'VD Dairy Fresh'),
('login.country_code', '+91'),
('login.phone_length', '10'),
('login.features', '[{"icon":"cart-outline","title":"Fresh & Pure","subtitle":"Milk"},{"icon":"leaf-outline","title":"Daily","subtitle":"Delivery"},{"icon":"shield-checkmark-outline","title":"Safe &","subtitle":"Secure"}]')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- Dynamic page content (one row per setting; JSON for lists)
INSERT INTO app_settings (setting_key, setting_value) VALUES
('splash.image', 'assets/images/splash/splash-milk.png'),
('splash.duration_ms', '2500'),
('onboarding.slides', '[{\"title\":\"Fresh Milk\\nFor a Healthier You\",\"description\":\"Pure, fresh and nutritious milk delivered to your doorstep.\",\"image\":\"assets/images/onboarding/onboarding-1.png\",\"themeClass\":\"theme-slide-1\",\"buttonBg\":\"#5A4B3C\"},{\"title\":\"Wide Range\\nof Dairy Products\",\"description\":\"Milk, Curd, Paneer, Ghee and more, all in one place.\",\"image\":\"assets/images/onboarding/onboarding-2.png\",\"themeClass\":\"theme-slide-2\",\"buttonBg\":\"#176B4F\"},{\"title\":\"Subscribe &\\nSave Time\",\"description\":\"Set it once and get fresh milk delivered every day.\",\"image\":\"assets/images/onboarding/onboarding-3.png\",\"themeClass\":\"theme-slide-3\",\"buttonBg\":\"#176B4F\"}]'),
('location.title', 'Enable Location'),
('location.description', 'Allow MilkyWay to access your location to find available milk delivery services near you.'),
('location.benefits', '[{\"icon\":\"location-outline\",\"title\":\"Find nearby delivery\",\"text\":\"See products available in your area.\"},{\"icon\":\"navigate-outline\",\"title\":\"Accurate delivery\",\"text\":\"Get your order delivered to the right location.\"}]'),
('home.search_placeholder', 'Search milk, curd, paneer...'),
('home.banners', '[{\"image\":\"assets/images/home/milk-banner.png\",\"alt\":\"Fresh Milk Delivered Daily\",\"link\":\"/products\"}]'),
('home.subscription_title', 'Daily Milk Subscription'),
('home.subscription_text', 'Get fresh milk delivered every morning.'),
('home.subscription_button', 'Start Subscription'),
('home.popular_count', '4'),
('account.menu_items', '[{\"title\":\"My Orders\",\"subtitle\":\"View and track your orders\",\"icon\":\"receipt-outline\",\"action\":\"orders\"},{\"title\":\"My Addresses\",\"subtitle\":\"Manage your delivery addresses\",\"icon\":\"location-outline\",\"action\":\"addresses\"},{\"title\":\"Milk Subscription\",\"subtitle\":\"Manage your daily milk plan\",\"icon\":\"calendar-outline\",\"action\":\"subscription\"},{\"title\":\"Wishlist\",\"subtitle\":\"Your saved products\",\"icon\":\"heart-outline\",\"action\":\"wishlist\"}]'),
('account.support_items', '[{\"title\":\"Notifications\",\"subtitle\":\"Manage notification preferences\",\"icon\":\"notifications-outline\",\"action\":\"notifications\"},{\"title\":\"Help & Support\",\"subtitle\":\"Get help with your orders\",\"icon\":\"help-circle-outline\",\"action\":\"support\"},{\"title\":\"Privacy & Security\",\"subtitle\":\"Manage your account security\",\"icon\":\"shield-checkmark-outline\",\"action\":\"privacy\"}]'),
('subscription.plans', '[{\"id\":\"daily\",\"title\":\"Daily\",\"description\":\"Fresh milk delivered every day\",\"icon\":\"sunny-outline\",\"daysPerMonth\":30},{\"id\":\"alternate\",\"title\":\"Alternate Days\",\"description\":\"Milk delivered every other day\",\"icon\":\"calendar-outline\",\"daysPerMonth\":15},{\"id\":\"custom\",\"title\":\"Custom\",\"description\":\"Choose your preferred delivery days\",\"icon\":\"options-outline\",\"daysPerMonth\":20}]'),
('subscription.max_quantity', '10'),
('subscription.product_category', 'Milk'),
('schedule.days', '[{\"id\":\"monday\",\"short\":\"MON\",\"name\":\"Monday\"},{\"id\":\"tuesday\",\"short\":\"TUE\",\"name\":\"Tuesday\"},{\"id\":\"wednesday\",\"short\":\"WED\",\"name\":\"Wednesday\"},{\"id\":\"thursday\",\"short\":\"THU\",\"name\":\"Thursday\"},{\"id\":\"friday\",\"short\":\"FRI\",\"name\":\"Friday\"},{\"id\":\"saturday\",\"short\":\"SAT\",\"name\":\"Saturday\"},{\"id\":\"sunday\",\"short\":\"SUN\",\"name\":\"Sunday\"}]'),
('schedule.default_days', '[\"monday\",\"wednesday\",\"friday\"]'),
('schedule.time_slots', '[{\"id\":\"morning\",\"title\":\"Morning\",\"time\":\"7:00 AM - 9:00 AM\",\"icon\":\"sunny-outline\"},{\"id\":\"late-morning\",\"title\":\"Late Morning\",\"time\":\"9:00 AM - 11:00 AM\",\"icon\":\"time-outline\"},{\"id\":\"evening\",\"title\":\"Evening\",\"time\":\"5:00 PM - 7:00 PM\",\"icon\":\"moon-outline\"}]'),
('order.timeline', '[{\"key\":\"placed\",\"title\":\"Order Placed\",\"description\":\"Your order has been placed successfully.\",\"icon\":\"receipt-outline\"},{\"key\":\"confirmed\",\"title\":\"Order Confirmed\",\"description\":\"Your order has been confirmed by the dairy.\",\"icon\":\"checkmark-circle-outline\"},{\"key\":\"preparing\",\"title\":\"Preparing\",\"description\":\"Your fresh dairy products are being prepared.\",\"icon\":\"time-outline\"},{\"key\":\"out\",\"title\":\"Out for Delivery\",\"description\":\"Your order is on the way to you.\",\"icon\":\"bicycle-outline\"},{\"key\":\"delivered\",\"title\":\"Delivered\",\"description\":\"Your order has been delivered.\",\"icon\":\"home-outline\"}]'),
('checkout.payment_methods', '[{\"id\":\"cod\",\"title\":\"Cash on Delivery\",\"subtitle\":\"Pay when your order arrives\",\"icon\":\"cash-outline\"},{\"id\":\"upi\",\"title\":\"UPI\",\"subtitle\":\"Google Pay, PhonePe, Paytm\",\"icon\":\"phone-portrait-outline\"},{\"id\":\"card\",\"title\":\"Credit / Debit Card\",\"subtitle\":\"Visa, Mastercard and more\",\"icon\":\"card-outline\"}]'),
('checkout.free_delivery_above', '500'),
('checkout.delivery_charge', '40')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
