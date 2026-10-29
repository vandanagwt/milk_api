-- Resets the dashboard sidebar to the modules the milk app needs.
-- BACK UP the database first: this DELETES the old clinic modules (Reception, Doctor, Labs, Medicine,
-- Case Sheet, Reports, Notifications) and every role permission that points at them.
-- Kept: Dashboard (main 1) and User Management (main 2, sub 2 Create Role and sub 3 Users).
-- Run once.

DELETE FROM admin_permission WHERE module_id NOT IN (1, 2) OR sub_module_id NOT IN (2, 3);
DELETE FROM sub_module WHERE id NOT IN (2, 3);
DELETE FROM main_module WHERE id NOT IN (1, 2);

INSERT INTO main_module (title, path, icon, class, badge, badgeClass, isExternalLink, main_module_order, d_in)
VALUES ('Master', '', 'ri-database-2-line', 'sub', '', '', 0, 3, 0);
SET @master_id = LAST_INSERT_ID();

INSERT INTO main_module (title, path, icon, class, badge, badgeClass, isExternalLink, main_module_order, d_in)
VALUES ('Sales', '', 'ri-shopping-bag-3-line', 'sub', '', '', 0, 4, 0);
SET @sales_id = LAST_INSERT_ID();

INSERT INTO sub_module (title, path, class, isExternalLink, badgeClass, badge, icon, module_id, parentId, module_order, d_in) VALUES
('Categories',        '/create/varients',          '', 0, '', '', 'bx bx-right-arrow-alt', @master_id, @master_id, 1, 0),
('Products',          '/create/items',             '', 0, '', '', 'bx bx-right-arrow-alt', @master_id, @master_id, 2, 0),
('Coupons',           '/create/coupons',           '', 0, '', '', 'bx bx-right-arrow-alt', @master_id, @master_id, 3, 0),
('Delivery Slots',    '/create/delivery-slots',    '', 0, '', '', 'bx bx-right-arrow-alt', @master_id, @master_id, 4, 0),
('App Orders',        '/create/app-orders',        '', 0, '', '', 'bx bx-right-arrow-alt', @sales_id,  @sales_id,  1, 0),
('App Subscriptions', '/create/app-subscriptions', '', 0, '', '', 'bx bx-right-arrow-alt', @sales_id,  @sales_id,  2, 0),
('App Customers',     '/create/app-customers',     '', 0, '', '', 'bx bx-right-arrow-alt', @sales_id,  @sales_id,  3, 0);

-- role 1 = Super Admin gets every module
INSERT INTO admin_permission (role_id, module_id, sub_module_id, d_in)
SELECT 1, module_id, id, 0 FROM sub_module WHERE module_id IN (@master_id, @sales_id);
