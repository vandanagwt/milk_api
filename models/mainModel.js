var sqldb = require('../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');
var http = require("https");
var fs = require('fs');
var express = require('express');
router = express.Router();

//**************************** Vandana Dashboard Start *************************************************/

exports.checkUserExistMdl = function (number, pwd, callback) {
	var cntxtDtls = "in checkUserExistMdl";
	var QRY_TO_EXEC = ` SELECT * from employees where number ='${number}' and  pwd ='${pwd}' and d_in <> 1;`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getUserDataMdl = function (role_id, callback) {
	var cntxtDtls = "in getUserDataMdl";
	var QRY_TO_EXEC = `SELECT mm.* from main_module as mm join admin_permission as ps on mm.id=ps.module_id  where ps.role_id ='${role_id}' and ps.d_in <> 1 and mm.d_in=0 group by ps.module_id ORDER BY mm.main_module_order;
	SELECT mm.* from sub_module as mm join admin_permission as ps on mm.id=ps.sub_module_id  where ps.role_id ='${role_id}' and ps.d_in <> 1 and mm.d_in=0 order by module_order;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.checkNumbermdl = function (data, callback) {
	var cntxtDtls = "in checkNumbermdl";
	var QRY_TO_EXEC = `select * from roles where roleName='${data.roleName}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.submitusersloginmdl = function (data, callback) {
	var cntxtDtls = "in submitusersloginmdl";
	var QRY_TO_EXEC = `INSERT INTO roles(roleName) VALUES ('${data.roleName}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.submitpermissions = function (lastid, data, callback) {
	var cntxtDtls = "in submitpermissions";
	var host = data.selectedmoduleslist || [];
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into admin_permission(role_id, module_id,sub_module_id)values('${lastid}','${host[i].module_id}','${host[i].submodule_id}');`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
	}
	console.log();

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, MU_QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getpermissionlistcompanywisemdl = function (callback) {
	var cntxtDtls = "in getpermissionlistcompanywisemdl";
	var QRY_TO_EXEC = `SELECT l.*,  GROUP_CONCAT(DISTINCT m.title) AS module_nm, COUNT(m.title) AS mcnt, GROUP_CONCAT(sm.title) AS sub_menu, 
CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('submodule_id', p.sub_module_id, 'module_id', p.module_id)), ']') AS permissions
FROM admin_permission AS p
JOIN sub_module AS sm ON p.sub_module_id = sm.id
JOIN main_module AS m ON p.module_id = m.id
JOIN roles AS l ON l.id = p.role_id
WHERE p.d_in = 0 AND l.d_in = 0 AND m.d_in = 0
GROUP BY p.role_id;
`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


//**************************** Customer App Start *************************************************/

var PRODUCT_QRY = `SELECT p.*, c.name AS category FROM app_products p JOIN app_categories c ON c.id = p.category_id WHERE p.active = 1`;

exports.upsertAppCustomerMdl = function (uid, phone) {
	var cntxtDtls = "in upsertAppCustomerMdl";
	var QRY_TO_EXEC = `INSERT INTO app_customers (firebase_uid, phone) VALUES (?, ?) ON DUPLICATE KEY UPDATE phone = VALUES(phone)`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [uid, phone], cntxtDtls);
};
exports.getAppCustomerByUidMdl = function (uid) {
	var cntxtDtls = "in getAppCustomerByUidMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_customers WHERE firebase_uid = ?`, [uid], cntxtDtls);
};
exports.getAppCustomerMdl = function (id) {
	var cntxtDtls = "in getAppCustomerMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_customers WHERE id = ?`, [id], cntxtDtls);
};
exports.updateAppCustomerMdl = function (id, data) {
	var cntxtDtls = "in updateAppCustomerMdl";
	var QRY_TO_EXEC = `UPDATE app_customers SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
		email = COALESCE(?, email), fcm_token = COALESCE(?, fcm_token) WHERE id = ?`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC,
		[data.firstName ?? null, data.lastName ?? null, data.email ?? null, data.fcmToken ?? null, id], cntxtDtls);
};

//catalog
exports.getAppCategoriesMdl = function () {
	var cntxtDtls = "in getAppCategoriesMdl";
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT id, name, image FROM app_categories WHERE active = 1 ORDER BY sort_order`, cntxtDtls);
};
exports.getAppProductsMdl = function (category, search) {
	var cntxtDtls = "in getAppProductsMdl";
	var QRY_TO_EXEC = PRODUCT_QRY;
	var params = [];
	if (category) { QRY_TO_EXEC += ` AND c.name = ?`; params.push(category); }
	if (search) { QRY_TO_EXEC += ` AND p.name LIKE ?`; params.push('%' + search + '%'); }
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC + ` ORDER BY p.id`, params, cntxtDtls);
};
exports.getAppProductMdl = function (id) {
	var cntxtDtls = "in getAppProductMdl";
	return dbutil.execParams(sqldb.MySQLConPool, PRODUCT_QRY + ` AND p.id = ?`, [id], cntxtDtls);
};
exports.getAppProductVariantsMdl = function (productId) {
	var cntxtDtls = "in getAppProductVariantsMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT id, label, price FROM app_product_variants WHERE product_id = ?`, [productId], cntxtDtls);
};
exports.getAppSimilarProductsMdl = function (categoryId, productId) {
	var cntxtDtls = "in getAppSimilarProductsMdl";
	return dbutil.execParams(sqldb.MySQLConPool, PRODUCT_QRY + ` AND p.category_id = ? AND p.id <> ? LIMIT 6`, [categoryId, productId], cntxtDtls);
};
exports.getAppOrderableProductsMdl = function (ids) {
	var cntxtDtls = "in getAppOrderableProductsMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_products WHERE active = 1 AND serviceable = 1 AND id IN (?)`, [ids], cntxtDtls);
};
exports.getAppDeliverySlotsMdl = function () {
	var cntxtDtls = "in getAppDeliverySlotsMdl";
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT id, label FROM app_delivery_slots WHERE active = 1`, cntxtDtls);
};

//addresses
exports.getAppAddressesMdl = function (customerId) {
	var cntxtDtls = "in getAppAddressesMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_addresses WHERE customer_id = ? ORDER BY is_default DESC, id`, [customerId], cntxtDtls);
};
exports.getAppAddressMdl = function (id, customerId) {
	var cntxtDtls = "in getAppAddressMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_addresses WHERE id = ? AND customer_id = ?`, [id, customerId], cntxtDtls);
};
exports.countAppAddressesMdl = function (customerId) {
	var cntxtDtls = "in countAppAddressesMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT COUNT(*) AS n FROM app_addresses WHERE customer_id = ?`, [customerId], cntxtDtls);
};
exports.insertAppAddressMdl = function (customerId, a, isDefault) {
	var cntxtDtls = "in insertAppAddressMdl";
	var QRY_TO_EXEC = `INSERT INTO app_addresses (customer_id, type, name, phone, house_number, street, area, city, state, pincode, is_default)
		VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC,
		[customerId, a.addressType || a.type || 'Home', a.name, a.phone, a.houseNumber, a.street, a.area, a.city, a.state, a.pincode, isDefault], cntxtDtls);
};
exports.updateAppAddressMdl = function (id, customerId, a) {
	var cntxtDtls = "in updateAppAddressMdl";
	var QRY_TO_EXEC = `UPDATE app_addresses SET type=?, name=?, phone=?, house_number=?, street=?, area=?, city=?, state=?, pincode=?
		WHERE id = ? AND customer_id = ?`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC,
		[a.addressType || a.type || 'Home', a.name, a.phone, a.houseNumber, a.street, a.area, a.city, a.state, a.pincode, id, customerId], cntxtDtls);
};
exports.setAppDefaultAddressMdl = function (id, customerId) {
	var cntxtDtls = "in setAppDefaultAddressMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_addresses SET is_default = (id = ?) WHERE customer_id = ?`, [id, customerId], cntxtDtls);
};
exports.deleteAppAddressMdl = function (id) {
	var cntxtDtls = "in deleteAppAddressMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_addresses WHERE id = ?`, [id], cntxtDtls);
};

//wishlist
exports.getAppWishlistMdl = function (customerId) {
	var cntxtDtls = "in getAppWishlistMdl";
	return dbutil.execParams(sqldb.MySQLConPool, PRODUCT_QRY + ` AND p.id IN (SELECT product_id FROM app_wishlist WHERE customer_id = ?)`, [customerId], cntxtDtls);
};
exports.deleteAppWishlistMdl = function (customerId, productId) {
	var cntxtDtls = "in deleteAppWishlistMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_wishlist WHERE customer_id = ? AND product_id = ?`, [customerId, productId], cntxtDtls);
};
exports.insertAppWishlistMdl = function (customerId, productId) {
	var cntxtDtls = "in insertAppWishlistMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `INSERT INTO app_wishlist (customer_id, product_id) VALUES (?, ?)`, [customerId, productId], cntxtDtls);
};

//coupons / orders
exports.getAppCouponMdl = function (code) {
	var cntxtDtls = "in getAppCouponMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT * FROM app_coupons WHERE code = ? AND active = 1`, [code], cntxtDtls);
};
exports.insertAppOrderMdl = function (o) {
	var cntxtDtls = "in insertAppOrderMdl";
	var QRY_TO_EXEC = `INSERT INTO app_orders (order_no, customer_id, address_json, delivery_date, delivery_slot, payment_method,
		subtotal, delivery_charge, discount, total, coupon_code, status) VALUES (?,?,?,?,?,?,?,?,?,?,?, 'Placed')`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC,
		[o.orderNo, o.customerId, o.addressJson, o.deliveryDate, o.deliverySlot, o.paymentMethod,
			o.subtotal, o.deliveryCharge, o.discount, o.total, o.couponCode], cntxtDtls);
};
exports.insertAppOrderItemsMdl = function (rows) {
	var cntxtDtls = "in insertAppOrderItemsMdl";
	return dbutil.execParams(sqldb.MySQLConPool,
		`INSERT INTO app_order_items (order_id, product_id, name, quantity, price, count, image) VALUES ?`, [rows], cntxtDtls);
};
exports.getAppOrdersMdl = function (customerId, orderNo) {
	var cntxtDtls = "in getAppOrdersMdl";
	var QRY_TO_EXEC = `SELECT * FROM app_orders WHERE customer_id = ?` + (orderNo ? ` AND order_no = ?` : ``) + ` ORDER BY id DESC`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, orderNo ? [customerId, orderNo] : [customerId], cntxtDtls);
};
exports.getAppOrderItemsMdl = function (orderIds) {
	var cntxtDtls = "in getAppOrderItemsMdl";
	var QRY_TO_EXEC = `SELECT i.*, p.vendor FROM app_order_items i LEFT JOIN app_products p ON p.id = i.product_id WHERE i.order_id IN (?)`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [orderIds], cntxtDtls);
};
exports.cancelAppOrderMdl = function (orderNo, customerId) {
	var cntxtDtls = "in cancelAppOrderMdl";
	var QRY_TO_EXEC = `UPDATE app_orders SET status = 'Cancelled' WHERE order_no = ? AND customer_id = ? AND status IN ('Placed','Preparing')`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [orderNo, customerId], cntxtDtls);
};

//notifications
exports.insertAppNotificationMdl = function (customerId, type, title, message) {
	var cntxtDtls = "in insertAppNotificationMdl";
	return dbutil.execParams(sqldb.MySQLConPool,
		`INSERT INTO app_notifications (customer_id, type, title, message) VALUES (?, ?, ?, ?)`, [customerId, type, title, message], cntxtDtls);
};
exports.getAppNotificationsMdl = function (customerId) {
	var cntxtDtls = "in getAppNotificationsMdl";
	return dbutil.execParams(sqldb.MySQLConPool,
		`SELECT id, type, title, message, is_read AS \`read\`, created_at AS createdAt FROM app_notifications WHERE customer_id = ? ORDER BY id DESC`, [customerId], cntxtDtls);
};
exports.readAppNotificationsMdl = function (customerId) {
	var cntxtDtls = "in readAppNotificationsMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_notifications SET is_read = 1 WHERE customer_id = ?`, [customerId], cntxtDtls);
};

//subscriptions
exports.getAppSubscriptionsMdl = function (customerId) {
	var cntxtDtls = "in getAppSubscriptionsMdl";
	var QRY_TO_EXEC = `SELECT s.*, p.name, p.quantity AS size, p.price, p.image FROM app_subscriptions s
		JOIN app_products p ON p.id = s.product_id WHERE s.customer_id = ? AND s.status <> 'cancelled'`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [customerId], cntxtDtls);
};
exports.insertAppSubscriptionMdl = function (customerId, data) {
	var cntxtDtls = "in insertAppSubscriptionMdl";
	var QRY_TO_EXEC = `INSERT INTO app_subscriptions (customer_id, product_id, quantity, plan, custom_days, delivery_slot) VALUES (?,?,?,?,?,?)`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC,
		[customerId, data.productId, data.quantity, data.plan, data.customDays, data.deliverySlot], cntxtDtls);
};
exports.updateAppSubscriptionStatusMdl = function (id, customerId, status) {
	var cntxtDtls = "in updateAppSubscriptionStatusMdl";
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_subscriptions SET status = ? WHERE id = ? AND customer_id = ?`, [status, id, customerId], cntxtDtls);
};
exports.getAppSettingsMdl = function (prefix) {
	var cntxtDtls = "in getAppSettingsMdl";
	return dbutil.execParams(sqldb.MySQLConPool, "SELECT setting_key, setting_value FROM app_settings WHERE setting_key LIKE ?", [prefix + '%'], cntxtDtls);
};
//**************************** Customer App Admin (dashboard) *************************************************/
exports.getAdminCouponsMdl = function () {
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT code, percent, max_discount, active FROM app_coupons ORDER BY code`, "in getAdminCouponsMdl");
};
exports.insertAdminCouponMdl = function (d) {
	return dbutil.execParams(sqldb.MySQLConPool, `INSERT INTO app_coupons (code, percent, max_discount, active) VALUES (?,?,?,?)`,
		[d.code, d.percent, d.maxDiscount, d.active ? 1 : 0], "in insertAdminCouponMdl");
};
exports.updateAdminCouponMdl = function (code, d) {
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_coupons SET percent = ?, max_discount = ?, active = ? WHERE code = ?`,
		[d.percent, d.maxDiscount, d.active ? 1 : 0, code], "in updateAdminCouponMdl");
};
exports.deleteAdminCouponMdl = function (code) {
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_coupons WHERE code = ?`, [code], "in deleteAdminCouponMdl");
};

exports.getAdminSlotsMdl = function () {
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT id, label, active FROM app_delivery_slots ORDER BY id`, "in getAdminSlotsMdl");
};
exports.insertAdminSlotMdl = function (d) {
	return dbutil.execParams(sqldb.MySQLConPool, `INSERT INTO app_delivery_slots (label, active) VALUES (?,?)`, [d.label, d.active ? 1 : 0], "in insertAdminSlotMdl");
};
exports.updateAdminSlotMdl = function (id, d) {
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_delivery_slots SET label = ?, active = ? WHERE id = ?`, [d.label, d.active ? 1 : 0, id], "in updateAdminSlotMdl");
};
exports.deleteAdminSlotMdl = function (id) {
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_delivery_slots WHERE id = ?`, [id], "in deleteAdminSlotMdl");
};

exports.getAdminOrdersMdl = function () {
	var QRY_TO_EXEC = `SELECT o.id, o.order_no, o.status, o.total, o.payment_method, o.delivery_date, o.delivery_slot, o.coupon_code,
		o.created_at, CONCAT_WS(' ', c.first_name, c.last_name) AS customer, c.phone
		FROM app_orders o JOIN app_customers c ON c.id = o.customer_id ORDER BY o.id DESC`;
	return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, "in getAdminOrdersMdl");
};
exports.getAdminOrderItemsMdl = function (id) {
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT name, quantity, price, count FROM app_order_items WHERE order_id = ?`, [id], "in getAdminOrderItemsMdl");
};
exports.updateAdminOrderStatusMdl = function (id, status) {
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_orders SET status = ? WHERE id = ?`, [status, id], "in updateAdminOrderStatusMdl");
};

exports.getAdminSubscriptionsMdl = function () {
	var QRY_TO_EXEC = `SELECT s.id, s.quantity, s.plan, s.custom_days, s.delivery_slot, s.status, s.created_at, p.name AS product,
		CONCAT_WS(' ', c.first_name, c.last_name) AS customer, c.phone
		FROM app_subscriptions s JOIN app_products p ON p.id = s.product_id JOIN app_customers c ON c.id = s.customer_id ORDER BY s.id DESC`;
	return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, "in getAdminSubscriptionsMdl");
};
exports.updateAdminSubscriptionStatusMdl = function (id, status) {
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_subscriptions SET status = ? WHERE id = ?`, [status, id], "in updateAdminSubscriptionStatusMdl");
};

exports.getAdminCustomersMdl = function () {
	var QRY_TO_EXEC = `SELECT c.id, c.phone, c.first_name, c.last_name, c.email,
		(SELECT COUNT(*) FROM app_orders o WHERE o.customer_id = c.id) AS orders
		FROM app_customers c ORDER BY c.id DESC`;
	return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, "in getAdminCustomersMdl");
};
exports.getAdminCategoriesMdl = function () {
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT id, name, image, sort_order, active FROM app_categories ORDER BY sort_order, id`, "in getAdminCategoriesMdl");
};
exports.insertAdminCategoryMdl = function (d) {
	return dbutil.execParams(sqldb.MySQLConPool, `INSERT INTO app_categories (name, image, sort_order, active) VALUES (?,?,?,?)`,
		[d.name, d.image || null, d.sortOrder || 0, d.active ? 1 : 0], "in insertAdminCategoryMdl");
};
exports.updateAdminCategoryMdl = function (id, d) {
	return dbutil.execParams(sqldb.MySQLConPool, `UPDATE app_categories SET name = ?, image = ?, sort_order = ?, active = ? WHERE id = ?`,
		[d.name, d.image || null, d.sortOrder || 0, d.active ? 1 : 0, id], "in updateAdminCategoryMdl");
};
exports.deleteAdminCategoryMdl = function (id) {
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_categories WHERE id = ?`, [id], "in deleteAdminCategoryMdl");
};

exports.getAdminProductsMdl = function () {
	return dbutil.execQuery(sqldb.MySQLConPool, `SELECT p.*, c.name AS category FROM app_products p JOIN app_categories c ON c.id = p.category_id ORDER BY p.id DESC`, "in getAdminProductsMdl");
};
exports.getAdminProductVariantsMdl = function (id) {
	return dbutil.execParams(sqldb.MySQLConPool, `SELECT label, price FROM app_product_variants WHERE product_id = ? ORDER BY id`, [id], "in getAdminProductVariantsMdl");
};
exports.insertAdminProductMdl = function (d) {
	var QRY_TO_EXEC = `INSERT INTO app_products (category_id, name, quantity, price, old_price, vendor, description, image, serviceable, active)
		VALUES (?,?,?,?,?,?,?,?,?,?)`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [d.categoryId, d.name, d.quantity, d.price, d.oldPrice || null,
		d.vendor || null, d.description || null, d.image || null, d.serviceable ? 1 : 0, d.active ? 1 : 0], "in insertAdminProductMdl");
};
exports.updateAdminProductMdl = function (id, d) {
	var QRY_TO_EXEC = `UPDATE app_products SET category_id = ?, name = ?, quantity = ?, price = ?, old_price = ?, vendor = ?,
		description = ?, image = ?, serviceable = ?, active = ? WHERE id = ?`;
	return dbutil.execParams(sqldb.MySQLConPool, QRY_TO_EXEC, [d.categoryId, d.name, d.quantity, d.price, d.oldPrice || null,
		d.vendor || null, d.description || null, d.image || null, d.serviceable ? 1 : 0, d.active ? 1 : 0, id], "in updateAdminProductMdl");
};
exports.replaceAdminProductVariantsMdl = async function (id, variants) {
	await dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_product_variants WHERE product_id = ?`, [id], "in replaceAdminProductVariantsMdl");
	if (variants.length) {
		await dbutil.execParams(sqldb.MySQLConPool, `INSERT INTO app_product_variants (product_id, label, price) VALUES ?`,
			[variants.map(function (v) { return [id, v.label, v.price]; })], "in replaceAdminProductVariantsMdl");
	}
};
exports.deleteAdminProductMdl = function (id) {
	return dbutil.execParams(sqldb.MySQLConPool, `DELETE FROM app_products WHERE id = ?`, [id], "in deleteAdminProductMdl");
};
//**************************** Customer App End *************************************************/
