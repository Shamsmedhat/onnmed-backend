import mongoose from "mongoose";
import { Appointment , AppointmentUser } from "../../../database/models/appointment.model.js"
import { User } from "../../../database/models/user.model.js";

const checkPermission = (req, allowedTypes) => {
  const userType = req.body?.userType;
  if (!userType || !allowedTypes.includes(userType)) {
    return false;
  }
  return true;
};

// Add appointment
const addAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot, email, doctor, createdBy } = req.body;
    let getUser
    let isLoggedIn
    let userRole
    let userEmail
    if (mongoose.Types.ObjectId.isValid(createdBy)) {
      getUser = await User.findById(createdBy)
      isLoggedIn = !!req.body;
      userRole = getUser.userType;
      userEmail =  getUser.email;
    }

    // Role-based access control
    if (isLoggedIn && userRole !== "patient" && userRole !== "admin") {
      return res.status(403).json({ message: "Only patients or admins can create appointments." });
    }

    // Email validation
    let finalEmail;
    if (!isLoggedIn) {
      if (!email) return res.status(400).json({ message: "Email is required for guest users." });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format." });
      finalEmail = email;
    } else {
      finalEmail = userEmail;
      if (!finalEmail) return res.status(400).json({ message: "User email not found in session." });
    }

    // Validate doctor
    if (!doctor) {
      return res.status(400).json({ message: "Doctor ID is required." });
    }
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.userType !== 'doctor') {
      return res.status(400).json({ message: "Invalid doctor ID." });
    }

    // Normalize date
    const selectedDate = new Date(appointmentDate);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Check for existing appointment
    const Model = isLoggedIn ? Appointment : AppointmentUser;
    const existingAppointment = await Model.findOne({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked for the selected date." });
    }

    // Create appointment
    const appointment = await Model.create({
      appointmentDate,
      timeSlot,
      email: finalEmail,
      doctor,
      createdBy: isLoggedIn ? getUser._id : createdBy || finalEmail, 
      status: req.body.status || 'pending', 
      ...(isLoggedIn && userRole === "patient" && { patient: getUser._id }), 
      ...(isLoggedIn && userRole === "admin" && req.body.patient && { patient: req.body.patient }) 
    });

    res.status(201).json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({ message: "Server error while creating appointment.", error });
  }
};

// Get all appointment
const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("createdBy", "-password")
      .populate("doctor", "name email")
      .populate("patient", "name email");

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      appointments: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointments.",
      error: error.message,
    });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {

  try {
    if (!checkPermission(req, ["admin", "doctor"])) {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admin or doctor can update appointments.",
      });
    }

    const allowedUpdates = ["status"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating appointment.",
      error: error.message,
    });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  console.log("admin" , req.body)
  try {
    if (!checkPermission(req, ["admin"])) {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admin can delete appointments.",
      });
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
      appointment: appointment,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting appointment.",
      error: error.message,
    });
  }
};

export {
  addAppointment,
  getAllAppointment,
  updateAppointment,
  deleteAppointment
}

