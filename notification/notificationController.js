import Notification from "./notificationModel.js";
import NotificationHistory from "./notifHistory.js";
import firebase from "../config/firebase.js";

// Create Notifications
const createNotification = async (req, res) => {
  const { title, body, image } = req.body;

  console.log("111111-----", title, body, image);
  if (!title || !body) {
    res.status(500).json({
      status: false,
      message: "Please fill in all required fields...",
    });
  }
  try {
    const notification = new Notification({
      title: title,
      body: body,
      image: image || "",
    });
    const notif = await notification.save();
    console.log("22222-----", notif);

    // Save notification and also preparing notification message
    const message = {
      title: title,
      body: body,
      image: image || "",
    };

    console.log("3333333-----", message);

    const send = await sendToFirebase(message);
    console.log("4444444444-----", send);

    res.status(200).json({
      status: true,
      message: "Notification Created & Delivered Successfully",
      Sent: send,
      Item: notif,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Notification
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find(); // Fetch all notifications
    res.status(200).json({
      status: true,
      message: "Notifications retrieved",
      data: notifications,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Notification History

const getNotificationHistory = async (req, res) => {
  try {
    const history = await NotificationHistory.find(); // Fetch history
    res.status(200).json({
      status: true,
      message: "History retrieved",
      data: history,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      await Notification.findByIdAndDelete({ _id: id });
      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Invalid Notification ID.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({}); // Delete all notifications from DB
    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Send Notification to App
const sendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    const { title, body, image } = notif;

    // Validating input
    if (!title || !body) {
      return res
        .status(400)
        .json({ message: "Missing required fields: title, body" });
    }

    // preparing notification message

    const message = {
      title: title,
      body: body,
      image: image,
    };
    console.log(message);

    const send = await sendToFirebase(message);
    res.status(200).json({ status: send, message: "Notification sent" });
  } catch (err) {
    console.error("Error processing notification:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send notifications to FCM topics
const sendToFirebase = async (message) => {
  // Setting topic and image variable
  const topic = "saad";

  const notif = {
    title: message.title,
    body: message.body,
    image: message.image || "",
  };

  console.log("🟡 Notification Object:", notif);
  console.log("📢 Sending to topic:", topic);

  const notifHistory = new NotificationHistory(notif);

  // Initialize message function
  const { messaging } = firebase;

  // Preparing notification message
  let notification = {};

  if (message.image) {
    notification = {
      notification: {
        title: message.title,
        body: message.body,
        imageUrl: message.image,
      },
      topic: topic,
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            alert: {
              title: message.title,
              body: message.body,
            },
            badge: 1,
            sound: "default",
          },
        },
      },
      android: {
        priority: "high",
        notification: {
          title: message.title,
          body: message.body,
          imageUrl: message.image,
        },
      },
    };
  } else {
    notification = {
      notification: {
        title: message.title,
        body: message.body,
      },
      topic: topic,
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            alert: {
              title: message.title,
              body: message.body,
            },
            badge: 1,
            sound: "default",
          },
        },
      },
      android: {
        priority: "high",
        notification: {
          title: message.title,
          body: message.body,
        },
      },
    };
  }

  // Send a message to devices subscribed to the provided topic.
  console.log("Sending this notification:", notification);

  await messaging()
    .send(notification)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  await notifHistory.save();
};

export {
  createNotification,
  getAllNotifications,
  deleteNotification,
  sendNotification,
  getNotificationHistory,
  deleteAllNotifications,
};
