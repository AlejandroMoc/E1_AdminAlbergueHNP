const router = require("express").Router();
const { changeAdminPassword } = require("../queries/LoginQueries.js");

router.post("/", async (req, res) => {
  //TODO debo enviar el id actual del admin, no solo la contra
  const { username, actual_password, new_password1, new_password2 } = req.body;
  if (!username || !actual_password || !new_password1 || !new_password2) {
    return res.status(400).send("All fields are required");
  }

  try {
    const nombre_u = req.body.username;
    const contrasena = req.body.actual_password;

    await changeAdminPassword(
      nombre_u,
      contrasena,
      new_password1,
      new_password2
    );
    res.status(200).json("Password changed successfully from route");
  } catch (error) {
    console.error("Error changing password from route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
