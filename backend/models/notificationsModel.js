import supabase from "../config/supabaseClient.js";

// Fetch notifications for a specific user
export default async function getNotifications(userId) {
    const { data, error } = await supabase
        .from('notifications')
        .select('id, sender_user_id, target_post_id, type, created_at')
        .eq('receiver_user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Fetch flagged posts for warnings
export async function getFlaggedPosts() {
    const { data, error } = await supabase
        .from('flags')
        .select('username, restriction_type, description')
        .eq('restriction_type', 'Warning')
        .not('restriction_type', 'is', null);

    if (error) throw error;
    return data;
}

// Fetch additional data for notifications (sender info, post title)
export async function enrichNotifications(notifications) {
    return Promise.all(notifications.map(async (notification) => {
        try {
            const { data: sender } = await supabase
                .from('users')
                .select('username, profile_picture')
                .eq('user_id', notification.sender_user_id)
                .single();

            const { data: post } = await supabase
                .from('posts')
                .select('title')
                .eq('id', notification.target_post_id)
                .single();

            const rawDate = new Date(notification.created_at);
            const date = rawDate.toISOString().split('T')[0];
            let hours = rawDate.getHours();
            const minutes = rawDate.getMinutes().toString().padStart(2, '0');
            const seconds = rawDate.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const dateTime = `${date} ${hours}:${minutes}:${seconds} ${ampm}`;

            return {
                id: notification.id,
                target_post_id: notification.target_post_id,
                senderUsername: sender.username,
                senderProfilePicture: sender.profile_picture,
                postTitle: post.title,
                type: notification.type,
                createdAt: dateTime,
            };
        } catch (error) {
            console.error("Error enriching notification data:", error);
            return null;
        }
    })).then((results) => results.filter(item => item !== null));
}

// Mark a specific notification as read
export async function markNotificationAsRead(notificationId) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) throw error;
}

// Delete all notifications for a specific user
export async function clearAllNotifications(userId) {
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('receiver_user_id', userId);

    if (error) throw error;
}
