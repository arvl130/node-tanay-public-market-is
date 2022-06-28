const { Timestamp } = require("firebase-admin/firestore");
const moment = require("moment-timezone");
const getStoresIDsByTenantUID = require("./getStoresIDsByTenantUID");
const getTotalBillByTenantUID = require("./getTotalBillByTenantUID");
const getTenantUIDsWithStoresOwned = require("./getTenantUIDsWithStoresOwned");
const getDueDateForCurrentMonth = require("./getDueDateForCurrentMonth");
const createNewPayment = require("./createNewPayment");

module.exports = async () => {
  console.log(
    `${moment.tz("Asia/Manila").format()}: Running scheduled payments...`
  );
  const tenantUIDsWithStores = await getTenantUIDsWithStoresOwned();
  const payments = [];
  const due_date = Timestamp.fromDate(getDueDateForCurrentMonth());

  tenantUIDsWithStores.forEach(async (tenant_uid) => {
    const storesAndTotalBill = await Promise.all([
      getStoresIDsByTenantUID(tenant_uid),
      getTotalBillByTenantUID(tenant_uid),
    ]);

    const payment = {
      tenant_uid,
      due_date,
      stores: storesAndTotalBill[0],
      description: "",
      status: "pending",
      amount: storesAndTotalBill[1],
    };

    payments.push(createNewPayment(payment));
  });

  Promise.all(payments);
};
