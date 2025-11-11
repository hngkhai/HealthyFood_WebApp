import getNotifications, { clearAllNotifications, enrichNotifications, getFlaggedPosts, markNotificationAsRead } from '../models/notificationsModel.js';

export default async function fetchNotifications(req, res) {
    const userId = req.session.user_id;
    const receiver = req.session.username;

    try {
        const notifications = await getNotifications(userId);
        const flags = await getFlaggedPosts();
        const relevantFlags = flags.filter(flag => flag.username === receiver);

        const enrichedNotifications = await enrichNotifications(notifications);

        // Filter out any null values in case of errors
        const validNotifications = enrichedNotifications.filter(item => item !== null);

        res.json({ 
            flags: relevantFlags, 
            notifications: validNotifications,
            nutritionixApiKey: process.env.NUTRITIONIX_API_KEY,
            nutritionixAppId: process.env.NUTRITIONIX_APP_ID   
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("An error occurred while fetching notifications.");
    }
}

export async function markAsRead(req, res) {
    const notificationId = req.params.id;
    try {
        await markNotificationAsRead(notificationId);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: "Failed to mark as read" });
    }
}

export async function fetchLatestNotifications(req, res) {
    const userId = req.session.user_id;

    try {
        const notifications = await getNotifications(userId);
        const enrichedNotifications = await enrichNotifications(notifications);

        res.json(enrichedNotifications);
    } catch (error) {
        console.error("Error fetching latest notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
}

export async function clearNotifications(req, res) {
    const userId = req.session.user_id;
    try {
        await clearAllNotifications(userId);
        res.status(200).json({ message: "All notifications cleared" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ error: "Failed to clear notifications" });
    }
}
