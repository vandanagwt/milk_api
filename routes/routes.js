var express = require('express');
router = express.Router();
var sampleRoutes = require('../controllers/mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";

///**************************** Vandana Dashboard Start ********************************************************************
//20-03-25
router.post('/getUserData', sampleRoutes.getUserDataCtrl);

router.get('/mainmodules/', sampleRoutes.mainmodulesCtrl);
router.get('/submodules/', sampleRoutes.submodulesCtrl);

//roless
router.post('/role', sampleRoutes.submitusersloginctrl);
router.get('/role', sampleRoutes.getpermissionlistcompanywisectrl);
router.patch('/role/:id', sampleRoutes.updatroleCtrl);
router.delete('/role/:id', sampleRoutes.deleteroleCtrl);

//add employees start
router.get('/employees/', sampleRoutes.employeesCtrl);
router.get('/employees/role/:id', sampleRoutes.employeesbyroleCtrl);
router.post('/employees', sampleRoutes.postemployeesCtrl);
router.delete('/employees/:id', sampleRoutes.deleteemployeesCtrl);
router.patch('/employees/:id', sampleRoutes.updateemployeesCtrl);
//add employees end

//add categories start
router.post('/categories', sampleRoutes.saveCategoryCtrl);
router.get('/categories', sampleRoutes.getCategoriesCtrl);
router.patch('/categories/:id', sampleRoutes.updateCategoryCtrl);
router.delete('/categories/:id', sampleRoutes.deleteCategoryCtrl);
//add categories end


    
//**************************** Customer App Start ********************************************************************
//auth
router.post('/app/auth/verify', sampleRoutes.appVerifyCtrl);
router.post('/app/auth/test-login', sampleRoutes.appTestLoginCtrl);
router.get('/app/config/:group', sampleRoutes.appConfigCtrl);
router.get('/app/me', sampleRoutes.appAuth, sampleRoutes.appGetMeCtrl);
router.put('/app/me', sampleRoutes.appAuth, sampleRoutes.appUpdateMeCtrl);

//catalog
router.get('/app/categories', sampleRoutes.appCategoriesCtrl);
router.get('/app/products', sampleRoutes.appProductsCtrl);
router.get('/app/products/:id', sampleRoutes.appProductCtrl);
router.get('/app/delivery-slots', sampleRoutes.appDeliverySlotsCtrl);

//addresses
router.get('/app/addresses', sampleRoutes.appAuth, sampleRoutes.appAddressesCtrl);
router.post('/app/addresses', sampleRoutes.appAuth, sampleRoutes.appSaveAddressCtrl);
router.put('/app/addresses/:id', sampleRoutes.appAuth, sampleRoutes.appUpdateAddressCtrl);
router.put('/app/addresses/:id/default', sampleRoutes.appAuth, sampleRoutes.appDefaultAddressCtrl);
router.delete('/app/addresses/:id', sampleRoutes.appAuth, sampleRoutes.appDeleteAddressCtrl);

//wishlist
router.get('/app/wishlist', sampleRoutes.appAuth, sampleRoutes.appWishlistCtrl);
router.post('/app/wishlist/:productId/toggle', sampleRoutes.appAuth, sampleRoutes.appToggleWishlistCtrl);

//coupons and orders
router.post('/app/coupons/apply', sampleRoutes.appAuth, sampleRoutes.appApplyCouponCtrl);
router.post('/app/orders', sampleRoutes.appAuth, sampleRoutes.appPlaceOrderCtrl);
router.get('/app/orders', sampleRoutes.appAuth, sampleRoutes.appOrdersCtrl);
router.get('/app/orders/:orderNo', sampleRoutes.appAuth, sampleRoutes.appOrderCtrl);
router.put('/app/orders/:orderNo/cancel', sampleRoutes.appAuth, sampleRoutes.appCancelOrderCtrl);

//notifications
router.get('/app/notifications', sampleRoutes.appAuth, sampleRoutes.appNotificationsCtrl);
router.put('/app/notifications/read', sampleRoutes.appAuth, sampleRoutes.appReadNotificationsCtrl);

//subscriptions
router.get('/app/subscriptions', sampleRoutes.appAuth, sampleRoutes.appSubscriptionsCtrl);
router.post('/app/subscriptions', sampleRoutes.appAuth, sampleRoutes.appSaveSubscriptionCtrl);
router.put('/app/subscriptions/:id/:action(pause|resume|cancel)', sampleRoutes.appAuth, sampleRoutes.appSubscriptionStatusCtrl);
//dashboard: customer app admin
router.get('/admin/app/coupons', sampleRoutes.adminCouponsCtrl);
router.post('/admin/app/coupons', sampleRoutes.adminSaveCouponCtrl);
router.patch('/admin/app/coupons/:code', sampleRoutes.adminUpdateCouponCtrl);
router.delete('/admin/app/coupons/:code', sampleRoutes.adminDeleteCouponCtrl);
router.get('/admin/app/delivery-slots', sampleRoutes.adminSlotsCtrl);
router.post('/admin/app/delivery-slots', sampleRoutes.adminSaveSlotCtrl);
router.patch('/admin/app/delivery-slots/:id', sampleRoutes.adminUpdateSlotCtrl);
router.delete('/admin/app/delivery-slots/:id', sampleRoutes.adminDeleteSlotCtrl);
router.get('/admin/app/orders', sampleRoutes.adminOrdersCtrl);
router.get('/admin/app/orders/:id/items', sampleRoutes.adminOrderItemsCtrl);
router.put('/admin/app/orders/:id/status', sampleRoutes.adminOrderStatusCtrl);
router.get('/admin/app/subscriptions', sampleRoutes.adminSubscriptionsCtrl);
router.put('/admin/app/subscriptions/:id/status', sampleRoutes.adminSubscriptionStatusCtrl);
router.get('/admin/app/customers', sampleRoutes.adminCustomersCtrl);
router.get('/admin/app/categories', sampleRoutes.adminCategoriesCtrl);
router.post('/admin/app/categories', sampleRoutes.adminSaveCategoryCtrl);
router.patch('/admin/app/categories/:id', sampleRoutes.adminUpdateCategoryCtrl);
router.delete('/admin/app/categories/:id', sampleRoutes.adminDeleteCategoryCtrl);
router.get('/admin/app/products', sampleRoutes.adminProductsCtrl);
router.get('/admin/app/products/:id/variants', sampleRoutes.adminProductVariantsCtrl);
router.post('/admin/app/products', sampleRoutes.adminSaveProductCtrl);
router.patch('/admin/app/products/:id', sampleRoutes.adminUpdateProductCtrl);
router.delete('/admin/app/products/:id', sampleRoutes.adminDeleteProductCtrl);

//**************************** Customer App End ********************************************************************

module.exports = router;


