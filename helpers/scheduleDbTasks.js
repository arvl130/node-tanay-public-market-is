const cron = require("node-cron");

const { getFirestore } = require("firebase-admin/firestore");
const issuePayment = require("./issuePayment/issuePayment");
const db = getFirestore();

db.collection("tpmis_settings")
  .doc("scheduled_tasks")
  .get()
  .then(async (scheduledTasksSnapshot) => {
    if (!scheduledTasksSnapshot.exists) {
      console.log("No tasks scheduled.");
    }

    const scheduledTasks = scheduledTasksSnapshot.data();
    const issuePaymentSchedule = scheduledTasks.issuePayments;

    // Check if we have scheduled issue payments.
    if (issuePaymentSchedule && cron.validate(issuePaymentSchedule)) {
      console.log(`Scheduling billing tasks [ ${issuePaymentSchedule} ]...`);
      cron.schedule(issuePaymentSchedule, issuePayment);
    }
  });
