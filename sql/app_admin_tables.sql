-- New tables for the next customer app admin modules. Safe to re-run (IF NOT EXISTS).
-- Existing tables are in customer_schema.sql (customers, categories, products, orders, subscriptions, coupons, slots).

-- Home screen banners (replaces the home.banners JSON in app_settings)
CREATE TABLE IF NOT EXISTS app_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  link VARCHAR(100) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Delivery staff and the route/area they cover
CREATE TABLE IF NOT EXISTS app_delivery_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  area VARCHAR(100) DEFAULT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Who delivers each order (NULL = not assigned yet)
ALTER TABLE app_orders ADD COLUMN delivery_staff_id INT DEFAULT NULL;

-- One row per subscription delivery day: delivered, skipped or missed
CREATE TABLE IF NOT EXISTS app_subscription_deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT NOT NULL,
  delivery_date DATE NOT NULL,
  staff_id INT DEFAULT NULL,
  status ENUM('scheduled','delivered','skipped','missed') NOT NULL DEFAULT 'scheduled',
  UNIQUE KEY uq_sub_day (subscription_id, delivery_date),
  FOREIGN KEY (subscription_id) REFERENCES app_subscriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customer wallet: one ledger row per credit or debit
CREATE TABLE IF NOT EXISTS app_wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  type ENUM('credit','debit') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  note VARCHAR(150) DEFAULT NULL,
  order_id INT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Push notification campaigns sent from the dashboard
CREATE TABLE IF NOT EXISTS app_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  audience ENUM('all','subscribers','inactive') NOT NULL DEFAULT 'all',
  sent_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Help and support tickets raised from the app
CREATE TABLE IF NOT EXISTS app_support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('open','in_progress','resolved') NOT NULL DEFAULT 'open',
  reply TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES app_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
