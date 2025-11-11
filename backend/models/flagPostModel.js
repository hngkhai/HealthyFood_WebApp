import supabase from "../config/supabaseClient.js";

export async function getUserByUsername(username) {
    const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
    return { data, error };
}

export async function updateFlagDetails(username, flagReason, flagDescription, postID) {
    const { error } = await supabase
        .from('users')
        .update({
            flag_reason: flagReason,
            flag_description: flagDescription,
            flagged_post: postID
        })
        .eq('username', username);
    return { error };
}