const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Failed to log out.");
        }
        res.redirect("/"); // Adjust this path to your login page or homepage
    });
};

export default logout;
