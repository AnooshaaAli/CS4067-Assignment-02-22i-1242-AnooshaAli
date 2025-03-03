app.get("/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await Notification.find({ user_id: userId }).sort({ created_at: -1 });
  
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  
  // Start Express Server
  app.listen(5005, () => console.log("🚀 Notification Service running on port 5005"));
  