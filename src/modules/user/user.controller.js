import { User } from "../../../database/models/user.model.js"


const checkPermission = (req, allowedTypes) => {
  const userType = req.user?.userType;
  if (!userType || !allowedTypes.includes(userType)) {
    return false;
  }
  return true;
};

const addUser =  async (req , res) => {
  let user = await User.insertMany(req.body)
  res.json({ message: "success" , user})
}

const getAllUsers = async (req, res) => {
  try {
    const { userType } = req.query;
    const allowedTypes = ['admin', 'doctor', 'patient'];

    let filter = {};
    if (userType) {
      filter.userType = userType;
    }

    const users = await User.find(filter);

    res.status(200).json({
      message: "Users fetched successfully.",
      users,
    });

    if (userType && !allowedTypes.includes(userType)) res.status(400).json({
        message: "Invalid userType provided.",
      })

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error while fetching users.",
      error,
    });
  }
};


const updateUser = async (req, res) => {
  if (!checkPermission(req, ["admin", "doctor"])) {
    return res.status(403).json({
      message: "Permission denied. Only admin or doctor can update users.",
    });
  }

  try {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "success", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Server error while updating user.",
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  if (!checkPermission(req, ["admin"])) {
    return res.status(403).json({
      message: "Permission denied. Only admin can delete users.",
    });
  }

  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "success", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Server error while deleting user.",
      error,
    });
  }
};
export {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser
}