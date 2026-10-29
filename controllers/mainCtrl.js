var moment = require('moment');
var express = require('express');
router = express.Router();
var http = require("https");
var fs = require('fs');
process.env.SECRET_KEY = "thisismysecretkey";
var appmdl = require('../models/mainModel')
var sqldb = require('../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var request = require('request'); //for otp

//**************************** Vandana Dashboard  Start ***************/

exports.getUserDataCtrl = function (req, res) {
    var phone = req.body.phone;
    var usr_pwd = req.body.password;
    appmdl.checkUserExistMdl(phone, usr_pwd, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": "Server Error" });
            return;
        }
        if (results && results.length > 0) {
            appmdl.getUserDataMdl(results[0].role_id, function (err, usrMenu) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                usrMenu[1].map(res => {
                    res.children = [];
                })
                usrMenu[0].map(res => {
                    var subdata = usrMenu[1].filter(obj => {
                        obj.active = false;
                        return obj.module_id == res.id;
                    })
                    if (subdata.length) {
                        res.children = subdata;
                    } else {
                        res.children = [];
                    }
                })
                //
                res.send({ 'status': 200, 'data': usrMenu[0], 'usr_data': results });
            });
        } else {
            res.send({ "status": 202, "message": 'invalid UserName or Password' });
        }
    });
}

exports.mainmodulesCtrl = function (req, res) {
    var cntxtDtls = "in mainmodulesCtrl";
    var QRY_TO_EXEC = `Select *  from main_module where  d_in='0';`;
    //console.log(QRY_TO_EXEC);
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}

exports.submodulesCtrl = function (req, res) {
    var cntxtDtls = "in submodulesCtrl";
    var QRY_TO_EXEC = `Select *  from sub_module where  d_in='0';`;
    //console.log(QRY_TO_EXEC);
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}

exports.submitusersloginctrl = function (req, res) {
    appmdl.checkNumbermdl(req.body, function (err, results) {
        if (results.length > 0) {
            res.send({ 'status': 300 })
        }
        else {
            appmdl.submitusersloginmdl(req.body, function (err, results) {
                if (results) {
                    appmdl.submitpermissions(results.insertId, req.body, function (err, results) {
                        if (results) {
                            res.send({ 'status': 200 });
                        } else {
                            res.send({ 'status': 500 })
                        }
                    });
                } else {
                    res.send({ 'status': 500 });
                }
            });
        }
    })
}

exports.getpermissionlistcompanywisectrl = function (req, res) {
    appmdl.getpermissionlistcompanywisemdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatroleCtrl = function (req, res) {
    var data = req.body
    var dataarr = data.permissions
    var req_data = req.params.id;
    var cntxtDtls = "in updatroleCtrl";
    //console.log(data);

    var QRY_TO_EXEC = `update roles set roleName = '${data.roleName}' where id='${req_data}';
    DELETE FROM admin_permission WHERE role_id = '${req_data}';`;
    //console.log(QRY_TO_EXEC, 'vandana');
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            //console.log("eldjskhkjds");

            var QRY_TO_EXEC = '';
            var MU_QRY_TO_EXEC = '';
            for (let i = 0; i < dataarr.length; i++) {
                QRY_TO_EXEC = `insert into admin_permission(role_id, module_id,sub_module_id)values('${req_data}','${dataarr[i].module_id}','${dataarr[i].submodule_id}');`
                MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
                //console.log(MU_QRY_TO_EXEC);

            }
            dbutil.execQuery(sqldb.MySQLConPool, MU_QRY_TO_EXEC, cntxtDtls, function (err, results) {
                // callback(err, results);
                if (err) {
                    res.send({ 'status': 500, 'data': [] });
                    return;
                } else {
                    res.send({ 'status': 200, 'data': results });
                }
            });
        }
    });
}

exports.deleteroleCtrl = function (req, res) {
    var cntxtDtls = "in deleteroleCtrl";
    var req_data = req.params.id;
    var QRY_TO_EXEC = `UPDATE roles SET d_in = '1' WHERE id = ${req_data};`;
    //console.log(QRY_TO_EXEC);

    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}

//add employees start
exports.employeesCtrl = function (req, res) {

    var cntxtDtls = "in employeesCtrl";
    var QRY_TO_EXEC = `Select *  from employees where  d_in='0' order by id desc;`;
    //console.log(QRY_TO_EXEC);

    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}
exports.employeesbyroleCtrl = function (req, res) {

    var cntxtDtls = "in employeesbyroleCtrl";
    var QRY_TO_EXEC = `Select *  from employees where  d_in='0' and role_id='${req.params.id}' order by id desc;`;
    //console.log(QRY_TO_EXEC);

    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}

exports.postemployeesCtrl = function (req, res) {
    var req_data = req.body;
    var cntxtDtls = "in postemployeesCtrl";

    var QRY_TO_EXEC = `select * from  employees where d_in='0' and number='${req_data.number}'`;
    //console.log(QRY_TO_EXEC);

    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            if (results.length > 0) {
                res.send({ 'status': 300, 'data': [] });
                return;
            } else {
                var cntxtDtls2 = "in addusrsMdl";
                var QRY_TO_EXEC = ` insert into employees (name,number,role_id,role,pwd,address) values ('${req_data.name}','${req_data.number}','${req_data.role_id}','${req_data.role}','${req_data.password}','${req_data.address}'); `;
                //console.log(QRY_TO_EXEC);

                dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls2, function (err2, postresults) {
                    if (err2) {
                        res.send({ 'status': 500, 'data': [] });
                        return;
                    } else {
                        res.send({ 'status': 200, 'data': postresults });
                    }

                });
            }
        }
    });
}
exports.deleteemployeesCtrl = function (req, res) {
    var cntxtDtls = "in deleteemployeesCtrl";
    var req_data = req.params.id;
    var QRY_TO_EXEC = `UPDATE employees SET d_in = '1' WHERE id = ${req_data};`;
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}

exports.updateemployeesCtrl = function (req, res) {
    var data = req.body
    var req_data = req.params.id;
    var cntxtDtls = "in updateemployeesCtrl";
    // console.log(data);
    if (data.document && data.document.startsWith("data:image")) {
        var image_url = data.document;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = 'png';
        fs.writeFile("../public_html/images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
            if (err) console.log("File save error:", err);
        });
        imageUpload = "https://mykisaankart.com/images/" + unicnumber + '.' + filetype;
    } else {
        imageUpload = data.document || ''; // keep old image if not changed
    }

    var QRY_TO_EXEC = `update employees set name = '${data.name}',number = '${data.number}',email = '${data.email}',gender = '${data.gender}',role_id = '${data.role_id}',role = '${data.role}',pwd = '${data.password}', address='${data.address}', GST='${data.GST}', pincode = '${data.pincode}', document = '${imageUpload}' where id='${req_data}';`;
    //console.log(QRY_TO_EXEC, 'vandana');
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': [] });
            return;
        } else {
            res.send({ 'status': 200, 'data': results });
        }
    });
}
//add employees end

//add categories start
exports.saveCategoryCtrl = function (req, res) {

    var data = req.body;
    var cntxtDtls = "in saveCategoryCtrl";

    var categoryImage =
        uploadBase64File(
            data.categoryImage,
            'png'
        );

    var checkQry = `
        SELECT id
        FROM categories
        WHERE categoryName = ?
        AND categoryType = 'MASTER'
        AND d_in = 0
    `;

    dbutil.sqlinjection(
        sqldb.MySQLConPool,
        checkQry,
        [data.categoryName],
        cntxtDtls,
        function (err, results) {

            if (err) {

                return res.send({
                    status: 500,
                    message: "Error checking category"
                });

            }

            if (results.length > 0) {

                return res.send({
                    status: 300,
                    message: "Category already exists"
                });

            }

            var qry = `
                INSERT INTO categories
                (
                    categoryName,
                    categoryImage,
                    categoryType,
                    isApproved,
                    isGlobal
                )
                VALUES
                (
                    ?, ?, 'MASTER', 1, 1
                )
            `;

            dbutil.sqlinjection(
                sqldb.MySQLConPool,
                qry,
                [
                    data.categoryName,
                    categoryImage
                ],
                cntxtDtls,
                function (err, result) {

                    if (err) {

                        return res.send({
                            status: 500,
                            message: "Failed to save category"
                        });

                    }

                    res.send({
                        status: 200,
                        categoryId: result.insertId,
                        message: "Category Saved Successfully"
                    });

                }
            );

        }
    );

};
exports.getCategoriesCtrl = function (req, res) {

    var cntxtDtls = "in getCategoriesCtrl";

    var qry = `
        SELECT *
        FROM categories c

        WHERE
            AND c.d_in='0'

        ORDER BY c.categoryName
    `;

    dbutil.sqlinjection(
        sqldb.MySQLConPool,
        qry,
        [],
        cntxtDtls,
        function (err, categories) {

            if (err) {

                return res.send({
                    status: 500
                });

            }


            res.send({ status: 200, data: categories });

        }
    );

};

exports.deleteCategoryCtrl = function (req, res) {

    var data = req.params.id;
    var cntxtDtls = "in deleteCategoryCtrl";

    var qry = `
        UPDATE categories
        SET d_in = 1
        WHERE id = ?
    `;

    dbutil.sqlinjection(
        sqldb.MySQLConPool,
        qry,
        [data],
        cntxtDtls,
        function (err) {

            if (err) {

                return res.send({
                    status: 500,
                    message: "Delete Failed"
                });

            }

            res.send({
                status: 200,
                message: "Category Deleted Successfully"
            });

        }
    );

};
exports.updateCategoryCtrl = function (req, res) {

    var data = req.body;
    var cntxtDtls = "in updateCategoryCtrl";

    var categoryImage = data.categoryImage;

    if (
        data.categoryImage &&
        data.categoryImage.includes('base64')
    ) {

        categoryImage =
            uploadBase64File(
                data.categoryImage,
                'png'
            );

    }

    var qry = `
        UPDATE categories
        SET
            categoryName = ?,
            categoryImage = ?
        WHERE id = ?
    `;

    dbutil.sqlinjection(
        sqldb.MySQLConPool,
        qry,
        [
            data.categoryName,
            categoryImage,
            req.params.id
        ],
        cntxtDtls,
        function (err) {

            if (err) {

                return res.send({
                    status: 500,
                    message: "Update Failed"
                });

            }

            res.send({
                status: 200,
                message: "Category Updated Successfully"
            });

        }
    );

};
//add categories end


//**************************** Customer App Start ***************/

var jwt = require('jsonwebtoken');
var firebaseAdmin = require('firebase-admin');
var appcfg = require('../config/env');

firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(require(appcfg.FIREBASE_KEY_PATH)) });

// turns a rejected promise into a 500 response
function appHandler(fn) {
    return function (req, res) {
        fn(req, res).catch(function (err) {
            console.error(err);
            res.send({ 'status': 500, 'message': 'Server Error' });
        });
    };
}

// token check for the customer app routes
exports.appAuth = function (req, res, next) {
    var token = (req.headers.authorization || '').replace(/^Bearer /, '');
    try {
        req.customerId = jwt.verify(token, appcfg.JWT_SECRET).id;
        next();
    } catch (e) {
        res.status(401).send({ 'status': 401, 'message': 'Unauthorized' });
    }
};

function toAppProduct(r) {
    return {
        id: r.id, name: r.name, category: r.category, quantity: r.quantity,
        price: Number(r.price), oldPrice: r.old_price ? Number(r.old_price) : null,
        discount: r.old_price ? Math.round((1 - r.price / r.old_price) * 100) + '% OFF' : '',
        vendor: r.vendor, vendorRating: Number(r.vendor_rating), rating: Number(r.rating), reviews: r.reviews,
        image: r.image, description: r.description, serviceable: !!r.serviceable
    };
}

function toAppAddress(a) {
    return {
        id: a.id, type: a.type, name: a.name, phone: a.phone, houseNumber: a.house_number, street: a.street,
        area: a.area, city: a.city, state: a.state, pincode: a.pincode, isDefault: !!a.is_default,
        address: [a.house_number, a.street].filter(Boolean).join(', '),
        icon: { Home: 'home-outline', Work: 'briefcase-outline' }[a.type] || 'location-outline'
    };
}

function fmtAppDate(d) {
    return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
}

//auth: OTP is sent and checked by Firebase on the device, the API verifies the resulting ID token
exports.appVerifyCtrl = appHandler(async function (req, res) {
    var decoded;
    try {
        decoded = await firebaseAdmin.auth().verifyIdToken(req.body.idToken);
    } catch (e) {
        return res.status(401).send({ 'status': 401, 'message': 'Invalid OTP session' });
    }
    if (!decoded.phone_number) {
        return res.status(400).send({ 'status': 400, 'message': 'Phone sign-in required' });
    }
    await appSignIn(res, decoded.uid, decoded.phone_number);
});

// creates the customer on first login and returns the app session token
async function appSignIn(res, uid, phone) {
    await appmdl.upsertAppCustomerMdl(uid, phone);
    var customer = (await appmdl.getAppCustomerByUidMdl(uid))[0];
    var token = jwt.sign({ id: customer.id }, appcfg.JWT_SECRET, { expiresIn: appcfg.JWT_EXPIRES });
    res.send({ 'status': 200, 'token': token, 'customer': customer, 'isNew': !customer.first_name });
}

//test account: fixed number and OTP, no SMS (disabled in production, see config/env.js)
exports.appTestLoginCtrl = appHandler(async function (req, res) {
    if (!appcfg.TEST_LOGIN_ENABLED
        || req.body.phone !== appcfg.TEST_LOGIN_PHONE
        || req.body.otp !== appcfg.TEST_LOGIN_OTP) {
        return res.status(401).send({ 'status': 401, 'message': 'Invalid OTP' });
    }
    await appSignIn(res, 'test-' + appcfg.TEST_LOGIN_PHONE, '+91' + appcfg.TEST_LOGIN_PHONE);
});

exports.appGetMeCtrl = appHandler(async function (req, res) {
    var rows = await appmdl.getAppCustomerMdl(req.customerId);
    res.send({ 'status': 200, 'data': rows[0] });
});

exports.appUpdateMeCtrl = appHandler(async function (req, res) {
    await appmdl.updateAppCustomerMdl(req.customerId, req.body);
    var rows = await appmdl.getAppCustomerMdl(req.customerId);
    res.send({ 'status': 200, 'data': rows[0] });
});

//catalog
exports.appCategoriesCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAppCategoriesMdl() });
});

exports.appProductsCtrl = appHandler(async function (req, res) {
    var rows = await appmdl.getAppProductsMdl(req.query.category, req.query.search);
    res.send({ 'status': 200, 'data': rows.map(toAppProduct) });
});

exports.appProductCtrl = appHandler(async function (req, res) {
    var row = (await appmdl.getAppProductMdl(req.params.id))[0];
    if (!row) {
        return res.status(404).send({ 'status': 404, 'message': 'Product not found' });
    }
    var variants = await appmdl.getAppProductVariantsMdl(row.id);
    var similar = await appmdl.getAppSimilarProductsMdl(row.category_id, row.id);
    res.send({
        'status': 200,
        'data': toAppProduct(row),
        'variants': variants.map(function (v) { return { id: v.id, label: v.label, price: Number(v.price) }; }),
        'similar': similar.map(toAppProduct)
    });
});

exports.appDeliverySlotsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAppDeliverySlotsMdl() });
});

//addresses
exports.appAddressesCtrl = appHandler(async function (req, res) {
    var rows = await appmdl.getAppAddressesMdl(req.customerId);
    res.send({ 'status': 200, 'data': rows.map(toAppAddress) });
});

exports.appSaveAddressCtrl = appHandler(async function (req, res) {
    var count = (await appmdl.countAppAddressesMdl(req.customerId))[0].n;
    var result = await appmdl.insertAppAddressMdl(req.customerId, req.body, count === 0 ? 1 : 0);
    res.send({ 'status': 200, 'id': result.insertId });
});

exports.appUpdateAddressCtrl = appHandler(async function (req, res) {
    await appmdl.updateAppAddressMdl(req.params.id, req.customerId, req.body);
    res.send({ 'status': 200 });
});

exports.appDefaultAddressCtrl = appHandler(async function (req, res) {
    await appmdl.setAppDefaultAddressMdl(req.params.id, req.customerId);
    res.send({ 'status': 200 });
});

exports.appDeleteAddressCtrl = appHandler(async function (req, res) {
    var address = (await appmdl.getAppAddressMdl(req.params.id, req.customerId))[0];
    if (!address) {
        return res.status(404).send({ 'status': 404, 'message': 'Address not found' });
    }
    if (address.is_default) {
        return res.status(400).send({ 'status': 400, 'message': 'Default address cannot be deleted' });
    }
    await appmdl.deleteAppAddressMdl(req.params.id);
    res.send({ 'status': 200 });
});

//wishlist
exports.appWishlistCtrl = appHandler(async function (req, res) {
    var rows = await appmdl.getAppWishlistMdl(req.customerId);
    res.send({ 'status': 200, 'data': rows.map(toAppProduct) });
});

exports.appToggleWishlistCtrl = appHandler(async function (req, res) {
    var removed = await appmdl.deleteAppWishlistMdl(req.customerId, req.params.productId);
    if (removed.affectedRows) {
        return res.send({ 'status': 200, 'wishlisted': false });
    }
    await appmdl.insertAppWishlistMdl(req.customerId, req.params.productId);
    res.send({ 'status': 200, 'wishlisted': true });
});

//coupons / orders
async function appDiscount(code, subtotal) {
    if (!code) {
        return 0;
    }
    var coupon = (await appmdl.getAppCouponMdl(String(code).trim().toUpperCase()))[0];
    return coupon ? Math.min(Math.round(subtotal * coupon.percent / 100), coupon.max_discount) : 0;
}

exports.appApplyCouponCtrl = appHandler(async function (req, res) {
    var discount = await appDiscount(req.body.code, Number(req.body.subtotal) || 0);
    res.send({ 'status': 200, 'discount': discount, 'valid': discount > 0 });
});

exports.appPlaceOrderCtrl = appHandler(async function (req, res) {
    var data = req.body;
    if (!Array.isArray(data.items) || !data.items.length) {
        return res.status(400).send({ 'status': 400, 'message': 'Cart is empty' });
    }
    var address = (await appmdl.getAppAddressMdl(data.addressId, req.customerId))[0];
    if (!address) {
        return res.status(400).send({ 'status': 400, 'message': 'Select a delivery address' });
    }

    // prices always come from the database, never from the client
    var products = await appmdl.getAppOrderableProductsMdl(data.items.map(function (i) { return Number(i.id); }));
    var lines = [];
    for (var item of data.items) {
        var product = products.find(function (p) { return p.id === Number(item.id); });
        if (!product) {
            return res.status(400).send({ 'status': 400, 'message': 'Product unavailable: ' + item.id });
        }
        lines.push({ p: product, count: Math.max(1, parseInt(item.cartQuantity || item.count, 10) || 1) });
    }
    var subtotal = lines.reduce(function (s, l) { return s + Number(l.p.price) * l.count; }, 0);
    var checkout = await appLoadConfig('checkout');
    var freeAbove = checkout.freeDeliveryAbove != null ? checkout.freeDeliveryAbove : appcfg.FREE_DELIVERY_ABOVE;
    var deliveryCharge = subtotal >= freeAbove ? 0 : (checkout.deliveryCharge != null ? checkout.deliveryCharge : appcfg.DELIVERY_CHARGE);
    var discount = await appDiscount(data.couponCode, subtotal);
    var total = subtotal + deliveryCharge - discount;
    var orderNo = 'MW' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);

    var result = await appmdl.insertAppOrderMdl({
        orderNo: orderNo, customerId: req.customerId, addressJson: JSON.stringify(toAppAddress(address)),
        deliveryDate: data.deliveryDate || null, deliverySlot: data.deliverySlot || null,
        paymentMethod: data.paymentMethod || 'cod', subtotal: subtotal, deliveryCharge: deliveryCharge,
        discount: discount, total: total, couponCode: data.couponCode || null
    });
    await appmdl.insertAppOrderItemsMdl(lines.map(function (l) {
        return [result.insertId, l.p.id, l.p.name, l.p.quantity, l.p.price, l.count, l.p.image];
    }));
    await appmdl.insertAppNotificationMdl(req.customerId, 'order', 'Order Confirmed', 'Your order #' + orderNo + ' has been placed.');
    res.send({ 'status': 200, 'orderNo': orderNo, 'total': total });
});

async function appLoadOrders(customerId, orderNo) {
    var orders = await appmdl.getAppOrdersMdl(customerId, orderNo);
    if (!orders.length) {
        return [];
    }
    var items = await appmdl.getAppOrderItemsMdl(orders.map(function (o) { return o.id; }));
    return orders.map(function (o) {
        var its = items.filter(function (i) { return i.order_id === o.id; });
        var lineItems = its.map(function (i) {
            return { id: i.product_id, name: i.name, quantity: i.quantity, count: i.count, price: Number(i.price), image: i.image };
        });
        return {
            id: o.order_no, createdAt: o.created_at, date: fmtAppDate(o.created_at), deliveryDate: fmtAppDate(o.delivery_date),
            deliverySlot: o.delivery_slot, status: o.status,
            statusType: o.status === 'Delivered' ? 'delivered' : o.status === 'Cancelled' ? 'cancelled' : 'active',
            items: lineItems, itemCount: lineItems.reduce(function (s, i) { return s + i.count; }, 0),
            subtotal: Number(o.subtotal), deliveryCharge: Number(o.delivery_charge), discount: Number(o.discount),
            totalAmount: Number(o.total), amount: Number(o.total), payment: o.payment_method,
            address: JSON.parse(o.address_json),
            vendor: { name: (its[0] && its[0].vendor) || '', phone: '' }
        };
    });
}

exports.appOrdersCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appLoadOrders(req.customerId) });
});

exports.appOrderCtrl = appHandler(async function (req, res) {
    var order = (await appLoadOrders(req.customerId, req.params.orderNo))[0];
    if (!order) {
        return res.status(404).send({ 'status': 404, 'message': 'Order not found' });
    }
    res.send({ 'status': 200, 'data': order });
});

exports.appCancelOrderCtrl = appHandler(async function (req, res) {
    var result = await appmdl.cancelAppOrderMdl(req.params.orderNo, req.customerId);
    if (!result.affectedRows) {
        return res.status(400).send({ 'status': 400, 'message': 'Order cannot be cancelled' });
    }
    res.send({ 'status': 200 });
});

//notifications
exports.appNotificationsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAppNotificationsMdl(req.customerId) });
});

exports.appReadNotificationsCtrl = appHandler(async function (req, res) {
    await appmdl.readAppNotificationsMdl(req.customerId);
    res.send({ 'status': 200 });
});

//subscriptions
exports.appSubscriptionsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAppSubscriptionsMdl(req.customerId) });
});

exports.appSaveSubscriptionCtrl = appHandler(async function (req, res) {
    var data = req.body;
    if (['daily', 'alternate', 'custom'].indexOf(data.plan) === -1) {
        return res.status(400).send({ 'status': 400, 'message': 'Invalid plan' });
    }
    var result = await appmdl.insertAppSubscriptionMdl(req.customerId, {
        productId: data.productId,
        quantity: Math.max(1, parseInt(data.quantity, 10) || 1),
        plan: data.plan,
        customDays: Array.isArray(data.customDays) ? data.customDays.join(',') : null,
        deliverySlot: data.deliverySlot || null
    });
    await appmdl.insertAppNotificationMdl(req.customerId, 'subscription', 'Subscription Started',
        'Your milk subscription has been successfully activated.');
    res.send({ 'status': 200, 'id': result.insertId });
});

exports.appSubscriptionStatusCtrl = appHandler(async function (req, res) {
    var status = { pause: 'paused', resume: 'active', cancel: 'cancelled' }[req.params.action];
    await appmdl.updateAppSubscriptionStatusMdl(req.params.id, req.customerId, status);
    res.send({ 'status': 200 });
});
//screen content (text, images, lists) is kept in app_settings so it can change without an app release
var APP_CONFIG_GROUPS = ['login', 'splash', 'onboarding', 'location', 'home', 'account', 'subscription', 'schedule', 'order', 'checkout'];

// turns rows like login.phone_length into { phoneLength: 10 }; JSON lists/objects and numbers are parsed
async function appLoadConfig(group) {
    var rows = await appmdl.getAppSettingsMdl(group + '.');
    var cfg = {};
    rows.forEach(function (r) {
        var key = r.setting_key.slice(group.length + 1).replace(/_([a-z])/g, function (m, c) { return c.toUpperCase(); });
        var value = r.setting_value;
        if (/^[\[{]/.test(value)) {
            try { value = JSON.parse(value); } catch (e) { value = null; }
        } else if (/^\d+$/.test(value)) {
            value = parseInt(value, 10);
        }
        cfg[key] = value;
    });
    return cfg;
}

exports.appConfigCtrl = appHandler(async function (req, res) {
    var group = req.params.group;
    if (APP_CONFIG_GROUPS.indexOf(group) === -1) {
        return res.status(404).send({ 'status': 404, 'message': 'Unknown config group' });
    }
    var cfg = await appLoadConfig(group);
    if (group === 'login') {
        // lets the app skip the SMS step for the test number (the OTP itself is never sent)
        cfg.testPhone = appcfg.TEST_LOGIN_ENABLED ? appcfg.TEST_LOGIN_PHONE : null;
    }
    res.send({ 'status': 200, 'data': cfg });
});

//**************************** Customer App Admin (dashboard) ***************/
exports.adminCouponsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminCouponsMdl() });
});
exports.adminSaveCouponCtrl = appHandler(async function (req, res) {
    var d = req.body;
    d.code = String(d.code || '').trim().toUpperCase();
    if (!d.code || !(d.percent > 0 && d.percent <= 100) || !(d.maxDiscount >= 0)) {
        return res.send({ 'status': 400, 'message': 'Enter a code, a percent (1-100) and a max discount' });
    }
    try {
        await appmdl.insertAdminCouponMdl(d);
    } catch (e) {
        return res.send({ 'status': 300, 'message': 'Coupon already exists' });
    }
    res.send({ 'status': 200 });
});
exports.adminUpdateCouponCtrl = appHandler(async function (req, res) {
    await appmdl.updateAdminCouponMdl(req.params.code, req.body);
    res.send({ 'status': 200 });
});
exports.adminDeleteCouponCtrl = appHandler(async function (req, res) {
    await appmdl.deleteAdminCouponMdl(req.params.code);
    res.send({ 'status': 200 });
});

exports.adminSlotsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminSlotsMdl() });
});
exports.adminSaveSlotCtrl = appHandler(async function (req, res) {
    if (!String(req.body.label || '').trim()) {
        return res.send({ 'status': 400, 'message': 'Enter a slot label' });
    }
    await appmdl.insertAdminSlotMdl(req.body);
    res.send({ 'status': 200 });
});
exports.adminUpdateSlotCtrl = appHandler(async function (req, res) {
    await appmdl.updateAdminSlotMdl(req.params.id, req.body);
    res.send({ 'status': 200 });
});
exports.adminDeleteSlotCtrl = appHandler(async function (req, res) {
    await appmdl.deleteAdminSlotMdl(req.params.id);
    res.send({ 'status': 200 });
});

var APP_ORDER_STATUSES = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
exports.adminOrdersCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminOrdersMdl() });
});
exports.adminOrderItemsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminOrderItemsMdl(req.params.id) });
});
exports.adminOrderStatusCtrl = appHandler(async function (req, res) {
    if (APP_ORDER_STATUSES.indexOf(req.body.status) === -1) {
        return res.send({ 'status': 400, 'message': 'Invalid status' });
    }
    await appmdl.updateAdminOrderStatusMdl(req.params.id, req.body.status);
    res.send({ 'status': 200 });
});

exports.adminSubscriptionsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminSubscriptionsMdl() });
});
exports.adminSubscriptionStatusCtrl = appHandler(async function (req, res) {
    if (['active', 'paused', 'cancelled'].indexOf(req.body.status) === -1) {
        return res.send({ 'status': 400, 'message': 'Invalid status' });
    }
    await appmdl.updateAdminSubscriptionStatusMdl(req.params.id, req.body.status);
    res.send({ 'status': 200 });
});

exports.adminCustomersCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminCustomersMdl() });
});

//master: categories
exports.adminCategoriesCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminCategoriesMdl() });
});
exports.adminSaveCategoryCtrl = appHandler(async function (req, res) {
    if (!String(req.body.name || '').trim()) {
        return res.send({ 'status': 400, 'message': 'Enter a category name' });
    }
    await appmdl.insertAdminCategoryMdl(req.body);
    res.send({ 'status': 200 });
});
exports.adminUpdateCategoryCtrl = appHandler(async function (req, res) {
    if (!String(req.body.name || '').trim()) {
        return res.send({ 'status': 400, 'message': 'Enter a category name' });
    }
    await appmdl.updateAdminCategoryMdl(req.params.id, req.body);
    res.send({ 'status': 200 });
});
exports.adminDeleteCategoryCtrl = appHandler(async function (req, res) {
    try {
        await appmdl.deleteAdminCategoryMdl(req.params.id);
    } catch (e) {
        return res.send({ 'status': 400, 'message': 'This category has products. Disable it instead of deleting.' });
    }
    res.send({ 'status': 200 });
});

//master: products
function validAdminProduct(d) {
    return d.categoryId && String(d.name || '').trim() && String(d.quantity || '').trim() && Number(d.price) > 0;
}
function cleanAdminVariants(list) {
    return (Array.isArray(list) ? list : []).filter(function (v) { return v && String(v.label || '').trim() && Number(v.price) > 0; });
}
exports.adminProductsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminProductsMdl() });
});
exports.adminProductVariantsCtrl = appHandler(async function (req, res) {
    res.send({ 'status': 200, 'data': await appmdl.getAdminProductVariantsMdl(req.params.id) });
});
exports.adminSaveProductCtrl = appHandler(async function (req, res) {
    if (!validAdminProduct(req.body)) {
        return res.send({ 'status': 400, 'message': 'Category, name, size and a price above 0 are required' });
    }
    var result = await appmdl.insertAdminProductMdl(req.body);
    await appmdl.replaceAdminProductVariantsMdl(result.insertId, cleanAdminVariants(req.body.variants));
    res.send({ 'status': 200, 'id': result.insertId });
});
exports.adminUpdateProductCtrl = appHandler(async function (req, res) {
    if (!validAdminProduct(req.body)) {
        return res.send({ 'status': 400, 'message': 'Category, name, size and a price above 0 are required' });
    }
    await appmdl.updateAdminProductMdl(req.params.id, req.body);
    await appmdl.replaceAdminProductVariantsMdl(req.params.id, cleanAdminVariants(req.body.variants));
    res.send({ 'status': 200 });
});
exports.adminDeleteProductCtrl = appHandler(async function (req, res) {
    try {
        await appmdl.deleteAdminProductMdl(req.params.id);
    } catch (e) {
        return res.send({ 'status': 400, 'message': 'This product is used by a subscription. Disable it instead of deleting.' });
    }
    res.send({ 'status': 200 });
});

//**************************** Customer App End ***************/
